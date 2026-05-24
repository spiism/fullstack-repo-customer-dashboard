# Customer Web Client

Small static web client for the Customer API. It fetches paginated JSON from the backend and renders a responsive, searchable customer list with row-count and page selectors.

## Run

Start the API first:

```bash
cd ../customer-api
npm run start:dev
```

Then open `index.html` in a browser.

By default the page calls:

```text
http://localhost:3001/api/v1
```

For a local one-off test, update `config.js` with the deployed SST/API Gateway URL:

```js
window.CUSTOMER_API_BASE_URL = "https://your-api-url.example.com/api/v1";
```

For Vercel, set `CUSTOMER_API_BASE_URL` as a project environment variable and generate `config.js` during the build.

For a locked-down production API, use the generated Vercel URL as the backend CORS origin:

```env
WEB_ORIGIN="https://your-customer-web.vercel.app"
```

The demo SST deployment currently allows any origin at the API Gateway CORS layer so this static client can be tested quickly from local files or Vercel preview URLs.

To temporarily point a local page at a different API base URL without editing files, add `apiBase` to the page URL:

```text
index.html?apiBase=http://localhost:3001/api/v1
```

## Vercel

- Root Directory: `apps/customer-web`
- Framework Preset: `Other`
- Build Command:

```bash
printf 'window.CUSTOMER_API_BASE_URL = "%s";\n' "$CUSTOMER_API_BASE_URL" > config.js
```

- Output Directory: `.`

Vercel environment variable:

```text
CUSTOMER_API_BASE_URL=https://your-api-url.example.com/api/v1
```

The API URL will still be visible to anyone who opens the deployed web app and inspects browser network requests. The env var keeps it out of git; it does not make the API private.
