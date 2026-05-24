const { writeFileSync } = require('node:fs');
const { join } = require('node:path');

const apiBaseUrl = process.env.CUSTOMER_API_BASE_URL || '';
const configPath = join(__dirname, '..', 'config.js');

writeFileSync(
  configPath,
  `window.CUSTOMER_API_BASE_URL = ${JSON.stringify(apiBaseUrl)};\n`,
);
