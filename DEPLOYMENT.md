# Cloudflare Workers: GitHub hosting and branch previews

## Existing project

- Repository: `TheeObelix/nwachukwu-portfolio`
- Worker name: `nwachukwu-portfolio`
- Production URL: https://nwachukwu-portfolio.nwachuks-ni.workers.dev
- Production branch: `main`
- Preview branch: `adding-features-1`
- Node version: 22, selected by `.node-version`

## Build settings

| Setting | Production | Previews Base |
| --- | --- | --- |
| Build command | `npm run build` | `npm run build` |
| Deploy / preview command | `npx wrangler deploy` | `npx wrangler preview` |
| Root directory | `/` | `/` |
| Include paths | `*` | `*` |
| Exclude paths | `node_modules/**`, `.git/` | `node_modules/**`, `.git/` |

Enable **Builds for Preview branches** under Previews Base. `wrangler.jsonc` identifies the Worker and the generated `dist` assets directory. Its empty `previews` block enables preview configuration without adding runtime secrets or backend services. Wrangler is installed as a development dependency and locked by `package-lock.json`.

Pushes to `main` update production. Pushes to `adding-features-1` create a separate preview when the GitHub integration and preview builds are enabled. The preview name defaults to the Git branch.

## Find the actual preview

After a successful feature-branch build, use the preview selector or build output in the Cloudflare dashboard to copy the generated Preview URL. The `*-nwachukwu-portfolio.nwachuks-ni.workers.dev` entry under Domains is a wildcard pattern, not an individual preview URL. Worker Previews and version URLs are distinct features; use the URL produced by `wrangler preview`.

The feature branch contains the 3D workspace and the updated palette. `main` retains the original portfolio until a reviewed merge promotes the redesign.

## Verify before promoting

- Confirm production and preview show the expected versions.
- Open all five workspace stations on the preview.
- Check the portrait, resume download, and project PDF links.
- Check mobile navigation and return to the 3D workspace.
- Merge the reviewed feature branch into `main` when ready for production.

The website uses hash navigation. The assets configuration also supplies an SPA fallback. Vite copies PDFs and images from `public/` into `dist/` during the build.

## References

- [Workers Builds branch settings](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Worker Previews setup](https://developers.cloudflare.com/workers/previews/get-started/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
