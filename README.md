# Fast Flux Demo

A Next.js app that shows off how fast Flux is on Replicate.

Check it out at [fast-flux-demo.replicate.workers.dev](https://fast-flux-demo.replicate.workers.dev)

## Running locally

To run this app locally or deploy your own copy, you'll need:

- Node.js (20 or later)
- A [Replicate API token](https://replicate.com/account/api-tokens)

Set your Replicate API token in your environment:

```sh
export REPLICATE_API_TOKEN=r8_...
```

Then install dependencies and run the development server:

```
npm install && npm run dev
```

Then open [localhost:3000](http://localhost:3000) in your browser to see the app.

## Continuous Deployment

This project uses GitHub Actions for continuous deployment. Every push to the `main` branch triggers a workflow that builds and deploys the site to Cloudflare Workers.

The deployment process is defined in `.github/workflows/deploy.yml`. It uses the Wrangler GitHub Action to publish the site to Cloudflare.

To set up deployment for your fork of this project:

1. Generate a Cloudflare API token with the necessary permissions.
2. In your GitHub repository settings, go to Secrets and add a new secret named `CLOUDFLARE_API_TOKEN` with your Cloudflare API token as the value.

Once set up, every push to the `main` branch will automatically deploy your site.