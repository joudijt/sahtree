"""
Deploys dist/ to the sihatree.com docroot over explicit FTPS.

    set SIHATREE_FTP_PASS=...          (password contains ) - never pass it on
    python scripts/ftp-deploy.py --dry-run    the command line, the shell mangles it)
    python scripts/ftp-deploy.py --clean
    python scripts/ftp-deploy.py --skip-static  (skips images/SVG/assets whose
                                                 remote SIZE already matches)

Notes for whoever runs this next:
  * ftp.madinah.com.my does not resolve. The working host is the bare IP
    162.0.215.47 (same box as ftp.sihatree.com / mail.madinah.com.my).
  * The cert doesn't match the bare IP, so hostname verification must be off.
  * The account is chrooted to the docroot, so "/" is the web root - there is no
    public_html directory to descend into.
  * Every upload is retried on a fresh connection, and afterwards every file's
    remote SIZE is compared with the local byte count, because a clean STOR
    return proves nothing.
  * --clean deletes remote files that no longer exist in dist/. PROTECTED holds
    the server-owned paths it must never touch.
"""
import os
import ssl
import sys
import time
from ftplib import FTP_TLS, error_perm

HOST = "162.0.215.47"
USER = "claudesihatree@madinah.com.my"
LOCAL = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")

# Server-owned; deleting any of these breaks the account or the TLS renewal.
PROTECTED = {"/cgi-bin", "/.well-known", "/.ftpquota"}

DRY_RUN = "--dry-run" in sys.argv
CLEAN = "--clean" in sys.argv
SKIP_STATIC = "--skip-static" in sys.argv

# Directories holding bulk static assets whose filename changes whenever the
# content does (Vite hashes assets/*) or whose content effectively never changes
# (images, SVG). With --skip-static, a file under one of these is skipped when the
# remote SIZE already matches the local byte count.
#
# Deliberately NOT applied to html/txt/md/xml: an edit can leave the byte count
# identical, and silently not shipping an edited page is the worst failure this
# script can have. dist/ is 35 MB and 31 MB of it is images, so this is where all
# the wall-clock is anyway — a full run takes ~13 minutes, almost all of it
# re-sending images that did not change.
STATIC_DIRS = ("/images/", "/SVG/", "/assets/")

password = os.environ.get("SIHATREE_FTP_PASS")
if not password:
    sys.exit("SIHATREE_FTP_PASS is not set")


def connect():
    ctx = ssl.create_default_context()
    # Cert is issued for the hosting provider, not the bare IP, so hostname
    # verification can never pass here.
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    f = FTP_TLS(context=ctx)
    f.connect(HOST, 21, timeout=60)
    f.login(USER, password)
    f.prot_p()
    f.set_pasv(True)
    return f


def is_protected(path):
    return any(path == p or path.startswith(p + "/") for p in PROTECTED)


ftp = connect()
print("connected to %s as %s%s" % (HOST, USER, "  [DRY RUN]" if DRY_RUN else ""))

# ---------------------------------------------------------------- local files
local_files = {}
for root, _dirs, files in os.walk(LOCAL):
    rel = os.path.relpath(root, LOCAL).replace("\\", "/")
    for name in files:
        remote = "/" + name if rel == "." else "/%s/%s" % (rel, name)
        local_files[remote] = os.path.join(root, name)
print("%d local files in dist/" % len(local_files))

# ---------------------------------------------------------------- upload
made = set()


def ensure_dir(d):
    if d in ("", "/", ".") or d in made:
        return
    ensure_dir(os.path.dirname(d))
    try:
        ftp.mkd(d)
        print("  MKD %s" % d)
    except error_perm as e:
        if not str(e).startswith("550"):
            raise
    made.add(d)


uploaded, failed, skipped = [], [], []


def is_static(path):
    return any(path.startswith(d) for d in STATIC_DIRS)


for remote, local in sorted(local_files.items()):
    size = os.path.getsize(local)
    if SKIP_STATIC and is_static(remote):
        try:
            if ftp.size(remote) == size:
                skipped.append(remote)
                continue
        except Exception:
            pass          # not on the server yet, or SIZE refused - upload it
    if DRY_RUN:
        print("  PUT %-58s %8d" % (remote, size))
        uploaded.append((remote, size))
        continue
    ensure_dir(os.path.dirname(remote))
    for attempt in (1, 2, 3):
        try:
            with open(local, "rb") as fh:
                ftp.storbinary("STOR " + remote, fh, blocksize=32768)
            uploaded.append((remote, size))
            print("  PUT %-58s %8d" % (remote, size))
            break
        except Exception as e:
            print("  ERR %s (attempt %d): %s" % (remote, attempt, e))
            if attempt == 3:
                failed.append(remote)
            else:
                try:
                    ftp.quit()
                except Exception:
                    pass
                for reconnect_attempt in (1, 2, 3):
                    try:
                        ftp = connect()
                        break
                    except Exception as reconnect_err:
                        print("  RECONNECT FAILED (attempt %d): %s" % (reconnect_attempt, reconnect_err))
                        if reconnect_attempt == 3:
                            raise
                        time.sleep(5)

# ---------------------------------------------------------------- orphans
def walk_remote(path="/"):
    """Yields every remote file path under `path`, skipping protected subtrees."""
    entries = []
    try:
        ftp.retrlines("LIST " + path, entries.append)
    except Exception as e:
        print("  LIST failed for %s: %s" % (path, e))
        return
    for line in entries:
        parts = line.split(None, 8)
        if len(parts) < 9:
            continue
        name, is_dir = parts[8], line.startswith("d")
        if name in (".", ".."):
            continue
        child = (path.rstrip("/") + "/" + name)
        if is_protected(child):
            continue
        if is_dir:
            for sub in walk_remote(child):
                yield sub
        else:
            yield child


if CLEAN:
    print("\n=== orphans (on server, not in dist/) ===")
    orphans = [r for r in walk_remote("/") if r not in local_files]
    for o in orphans:
        if DRY_RUN:
            print("  would DELE %s" % o)
        else:
            try:
                ftp.delete(o)
                print("  DELE %s" % o)
            except Exception as e:
                print("  DELE failed %s: %s" % (o, e))
    print("%d orphan(s)" % len(orphans))

# ---------------------------------------------------------------- verify
if not DRY_RUN:
    print("\n=== verify: remote SIZE vs local ===")
    mismatch = []
    for remote, size in uploaded:
        actual = None
        for verify_attempt in (1, 2, 3):
            try:
                actual = ftp.size(remote)
                break
            except Exception as e:
                actual = "ERR:%s" % e
                if verify_attempt < 3:
                    try:
                        ftp.quit()
                    except Exception:
                        pass
                    try:
                        ftp = connect()
                    except Exception:
                        time.sleep(5)
        if actual != size:
            mismatch.append((remote, size, actual))
    print("checked %d, mismatched %d" % (len(uploaded), len(mismatch)))
    for m in mismatch:
        print("  MISMATCH %s local=%s remote=%s" % m)
else:
    failed, mismatch = [], []

try:
    ftp.quit()
except Exception:
    ftp.close()

print("\nuploaded %d, skipped %d unchanged static, failed %d" % (len(uploaded), len(skipped), len(failed)))
sys.exit(1 if (failed or mismatch) else 0)
