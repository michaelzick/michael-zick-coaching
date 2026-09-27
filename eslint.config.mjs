import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [...nextVitals, { ignores: ['.open-next/**', '.wrangler/**', 'cloudflare-env.d.ts'] }];

export default config;
