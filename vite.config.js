import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const page = (p) => resolve(root, p);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page('index.html'),
        products: page('products.html'),
        benefits: page('benefits.html'),
        retail: page('retail.html'),
        wholesale: page('wholesale.html'),
        contact: page('contact.html'),
        blog: page('blog.html'),
        blogWhatIsArabicGum: page('blog/what-is-arabic-gum-benefits-uses-dosage.html'),
        blogIsHalal: page('blog/is-arabic-gum-halal-malaysia.html'),
        blogWhereToBuy: page('blog/where-to-buy-arabic-gum-malaysia.html'),

        msMain: page('ms/index.html'),
        msProducts: page('ms/products.html'),
        msBenefits: page('ms/benefits.html'),
        msRetail: page('ms/retail.html'),
        msWholesale: page('ms/wholesale.html'),
        msContact: page('ms/contact.html'),
        msBlog: page('ms/blog.html'),
        msBlogApaItu: page('ms/blog/apa-itu-gam-arab-faedah-kegunaan-dos.html'),
        msBlogHalal: page('ms/blog/gam-arab-halal-panduan-malaysia.html'),
        msBlogDiMana: page('ms/blog/di-mana-beli-gam-arab-malaysia.html'),
      },
    },
  },
});
