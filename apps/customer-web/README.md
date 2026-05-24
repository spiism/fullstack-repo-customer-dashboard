# Customer Web Client

Small static web client for the Customer API. It fetches paginated JSON from the backend and renders a searchable customer list.

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

For a Vercel test deployment, update `config.js` with the deployed SST/API Gateway URL:

```js
window.CUSTOMER_API_BASE_URL = "https://your-api-url.example.com/api/v1";
```

Use the generated Vercel URL as the backend CORS origin:

```env
WEB_ORIGIN="https://your-customer-web.vercel.app"
```

To temporarily point a local page at a different API base URL without editing files, add `apiBase` to the page URL:

```text
index.html?apiBase=http://localhost:3001/api/v1
```

## Vercel

- Root Directory: `apps/customer-web`
- Framework Preset: `Other`
- Build Command: empty
- Output Directory: `.`
