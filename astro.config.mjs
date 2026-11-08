// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  redirects: {
    '/app': 'https://bowlsmart-6b195.web.app/'
  },

  integrations: [mdx()],
  adapter: cloudflare()
});