# AM to PM

AM to PM is a React and TypeScript application built with Vite.

## Local development

```sh
npm install
npm run dev
```

Create a local `.env` from `.env.example` if you need to configure integrations.

## Deploy to Cloudflare Pages

Create a Pages project in the Cloudflare dashboard and connect this GitHub repository. Use these build settings:

- Production branch: `main`
- Root directory: `frontend`
- Build command: `npm run build`
- Build output directory: `dist`

Cloudflare Pages will build and deploy each push to `main`.

The app currently uses the mock backend by default. Configure only public `VITE_` values as Pages build variables: Vite embeds them in browser assets, so they are visible to site visitors. Never put API secrets or private credentials in `VITE_` variables.
