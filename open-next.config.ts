import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  cloudflare: {
    compatibilityDate: '2026-06-01',
    compatibilityFlags: ['nodejs_compat'],
    assets: {
      directory: '.open-next/assets',
      binding: 'ASSETS',
    },
  },
};

export default config;
