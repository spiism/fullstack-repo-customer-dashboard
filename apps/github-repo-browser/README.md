# GitHub Repository Browser

A lightweight Next.js application for browsing public repositories from a GitHub organization.

## What It Does

- Fetches public repositories from the GitHub organization API.
- Shows 10 repositories per page.
- Supports shareable Previous and Next pagination through the `page` query parameter.
- Displays repository name, description, visibility, language, stars, forks, and last updated date.
- Includes loading, empty, error, and retry states.

## Requirements

- Node.js 20 or newer is recommended.
- npm.

## Setup

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run lint
npm test
npm run build
```

## Tests

The test suite uses Vitest and React Testing Library. It covers GitHub API pagination/error parsing and the rendered repository browser pagination/error UI.

## API Used

The app fetches repositories server-side from:

```text
https://api.github.com/orgs/github/repos?sort=name&per_page=10&page=1
```

The page number changes through the `page` query parameter when using pagination. No GitHub token is required for basic browsing, but unauthenticated GitHub API rate limits can still apply.
