# Cloudflare Pages: GitHub hosting and branch previews

## Project settings

| Setting | Value |
| --- | --- |
| Git provider | GitHub |
| Repository | `TheeObelix/nwachukwu-portfolio` |
| Project name | `nwachukwu-portfolio` (if available) |
| Production branch | `main` |
| Framework preset | React (Vite), or None with the settings below |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root (leave blank) |
| Node version | 22, selected by `.node-version` |
| Runtime secrets | None required for the current static website |

## Connect the repository

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Open **Workers & Pages → Create application → Pages → Connect to Git**.
3. Authorize GitHub and grant access to `TheeObelix/nwachukwu-portfolio`.
4. Select the repository, apply the project settings above, and select **Save and Deploy**.
5. Wait for the production build to complete and copy its actual `pages.dev` URL.

Cloudflare's GitHub authorization must be completed by the account owner. No API token belongs in this repository or the frontend.

## Enable previews

In the Pages project's build settings, enable automatic production deployments for `main` and preview deployments for **All non-Production branches**. For more restrictive previews, choose **Custom branches** and include `adding-features-1` instead.

Use the Deployments tab to create/retry a deployment of `adding-features-1` if no preview was triggered when the project was connected. Subsequent pushes to that branch trigger preview builds automatically. Copy the preview URL from Cloudflare; the hostname is assigned by Cloudflare and is not assumed here.

`main` currently contains the original portfolio. `adding-features-1` contains the interactive 3D workspace and updated palette. Setting production to `main` intentionally keeps the redesign in preview until it is merged.

## Verify before promoting

- Confirm production and preview show the expected versions.
- Open all five workspace stations on the preview.
- Check the portrait, resume download, and project PDF links.
- Check mobile navigation and return to the 3D workspace.
- Merge the reviewed feature branch into `main` when ready for production.

The website uses hash navigation, so section links do not require custom server redirects. Vite copies files from `public/` to `dist/` during the build, including the PDFs and images.

## References

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
