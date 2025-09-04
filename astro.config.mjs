
-import { defineConfig } from 'astro/config';
-import tailwind from '@astrojs/tailwind';
-import mdx from '@astrojs/mdx';
+import { defineConfig } from 'astro/config';
+import tailwind from '@astrojs/tailwind';
+import mdx from '@astrojs/mdx';
+import react from '@astrojs/react';

 export default defineConfig({
   site: 'https://earthsong.io',
-  output: 'static',
-  integrations: [tailwind(), mdx()],
+  output: 'static',
+  integrations: [tailwind(), mdx(), react()],
   vite: {
     resolve: {
       alias: { '@': new URL('./src', import.meta.url).pathname }
     }
   }
 });


});