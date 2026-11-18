# Nwachukwu Ibekwe — Engineering Portfolio

A React + Vite engineering portfolio featuring seven project case studies, interactive project illustrations, a publication, a professional portrait, and contact links.

## Interactive workspace

The landing page is a Three.js workspace with five selectable stations: About, Experience, Projects, Research, and Contact. Drag to orbit, use the camera buttons to rotate or zoom, and select a station to enter its section. The bottom navigation returns to the workspace from any section. Your portrait, project reports, and particle project explorer remain available.

Motion respects the reduced-motion preference and can be paused. If WebGL is unavailable, station buttons still provide access to all content. The scene uses conceptual models rather than CAD or simulation data.

## Run locally

Install Node.js 18+ (Node.js 20 or 22 recommended), then open a terminal in this folder:

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite (typically http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Hosting

See [DEPLOYMENT.md](DEPLOYMENT.md) for the connected Cloudflare Workers project and GitHub branch previews. Production tracks `main`; the 3D redesign is on `adding-features-1`. Build and preview commands use `wrangler.jsonc`.

## Customize

- `src/main.jsx`: personal biography, project cards, technical summaries, publication and contact links.
- `src/style.css`: colors, typography, layout, animations.
- `public/headshot.jpg`: professional headshot.
- `public/projects/*.pdf`: seven uploaded project reports, accessible from each case study.

To add a project, append another object to the `projects` array in `src/main.jsx`, add its PDF to `public/projects/`, and select a `visual` style. The illustrations are conceptual SVG/CSS visuals, not actual simulation output or interactive CAD models.

## Resume

No resume file was supplied in this batch. Once you have a public-ready resume, put it at `public/resume.pdf` and add a link to `/resume.pdf` in the navigation or About section.

## Privacy

The project reports are served as public assets. Review them for any confidential, personal, or third-party information before publishing the site publicly. The included medical robotics description is intentionally high-level.


## Updated assets
- `public/resume/Nwachukwu-Ibekwe-Resume.pdf` — downloadable resume
- `public/images/ottava-platform.jpg` — public OTTAVA platform image provided by portfolio owner
- `public/images/baja-team.jpeg` and `baja-workshop.jpeg` — Baja team photos

The industry experience section presents publicly shareable outcomes only. Verify permission to use any employer imagery before public deployment.
