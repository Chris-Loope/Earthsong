import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://earthsong.io',
  output: 'static',
  redirects: {
    '/guide': '/codex',
    '/elders': '/codex#symbols',
    '/newsletter/003-the-long-dark': '/newsletter/004-the-long-dark',
    '/newsletter/004-earths-silent-partner': '/newsletter/005-earths-silent-partner',
  },
  integrations: [tailwind(), mdx()],
  vite: {
    resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } }
  }
});
