import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://earthsong.io',
  output: 'static',
  integrations: [tailwind(), mdx()],
  vite: {
    resolve: {
      alias: { '@': new URL('./src', import.meta.url).pathname }
    }
  }
});