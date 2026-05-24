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

To point it at a different API base URL, add `apiBase` to the page URL:

```text
index.html?apiBase=http://localhost:3001/api/v1
```
