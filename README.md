# Team UofGlasgow 2026 Wiki

This repository holds the iGEM UofGlasgow 2026 wiki (project **Synwave**), built
with [Docusaurus](https://docusaurus.io) — pages are written as Markdown/MDX,
with React for the custom landing and team pages.

Published at **<https://2026.igem.wiki/uofglasgow/>**.

## iGEM requirements

This repository **MUST** contain all coding assets to generate your team's wiki
(HTML, CSS, JavaScript, TypeScript, Python, etc).

Images, photos, icons and fonts **MUST** be stored on `static.igem.wiki` using
[the uploads tool](https://teams.igem.org/go/deliverables/wiki/uploads), and Videos **must** be embedded
from [iGEM Video Universe](https://video.igem.org); see [the Video & Audio page](https://teams.igem.org/go/deliverables/wiki/videos-and-audios) for guidance on adding video and audio.

**Everything your wiki loads (CSS, JavaScript, fonts, images) must be served from
iGEM infrastructure.** Do not link to external or third-party CDNs (for example
Google Fonts, jsDelivr, cdnjs) — upload the files you need via
[the uploads tool](https://teams.igem.org/go/deliverables/wiki/uploads) and reference them from `static.igem.wiki`
instead.

For up-to-date requirements, resources, help and guidance, visit
[teams.igem.org/go/deliverables/wiki](https://teams.igem.org/go/deliverables/wiki).

> **Using an AI assistant (e.g. Claude Code)?** Please read
> [.claude/RESPONSIBLE_AI_USE.md](.claude/RESPONSIBLE_AI_USE.md) first. You remain
> fully responsible for everything you publish: never fabricate scientific
> results, data, or citations.

## Getting started

1. Clone the repository from **GitHub** (not GitLab — see
   [Repositories and deployment](#repositories-and-deployment)):
   ```bash
   git clone git@github.com:vrallis/UofGlasgow-2026-igem.git uofglasgow
   cd uofglasgow
   ```
2. Enable `pnpm` (this repo pins its version via `packageManager` in
   `package.json`, and `corepack` ships with Node):
   ```bash
   corepack enable
   ```
3. Install the dependencies:
   ```bash
   pnpm install
   ```
   **Node.js `>=20` is required** (Node 22 LTS recommended). Check with `node -v`.
4. Start the dev server at <http://localhost:3000/uofglasgow/>:
   ```bash
   pnpm start
   ```
5. Edit content (see [Where to edit](#where-to-edit) below).
6. Open a pull request against **`main`** on GitHub. Once merged, the wiki
   deploys automatically — see
   [Repositories and deployment](#repositories-and-deployment).

Useful commands:

| Command        | What it does                                              |
| -------------- | --------------------------------------------------------- |
| `pnpm start`   | Dev server with hot reload                                 |
| `pnpm build`   | Production build into `build/` — run this before pushing   |
| `pnpm serve`   | Serve the built site locally, exactly as it will deploy    |
| `pnpm typecheck` | Type-check the TypeScript config/sidebars                |
| `pnpm clear`   | Clear the Docusaurus cache when something looks stale      |

## Where to edit

    ├── docs/                     -> Wiki pages, as Markdown/MDX. Add a file, add it to sidebars.ts
    │   ├── description.mdx           Project Description
    │   ├── engineering.mdx           Engineering
    │   ├── results.mdx               Results
    │   ├── human-practices.mdx       Human Practices
    │   ├── notebook.mdx              Lab notebook
    │   ├── safety.mdx                Safety
    │   ├── mdx-power.mdx             Reference: everything MDX can do here
    │   └── _snippets/                Reusable MDX fragments (leading _ = not a page)
    ├── src/
    │   ├── pages/                -> Custom React pages (index.jsx = landing, team.jsx)
    │   ├── components/           -> Shared components (Cite, Part, GrowthChart, …)
    │   ├── data/
    │   │   ├── team.js               Team members + advisors
    │   │   ├── references.js         Bibliography used by <Cite />
    │   │   └── od600.json            Example dataset for <GrowthChart />
    │   ├── css/
    │   │   ├── custom.css            Global theme (navy/gold Synwave system)
    │   │   ├── fonts.css             Self-hosted @font-face rules
    │   │   └── fonts/                The .woff2 files themselves
    │   └── theme/
    │       ├── Footer/index.jsx      Site footer — see the warning below
    │       └── MDXComponents.js      Components available in every .mdx without importing
    ├── static/img/               -> Favicon + logo. Prefer static.igem.wiki for new images
    ├── docs sidebar: sidebars.ts
    ├── docusaurus.config.ts      -> Site config. `url` + `baseUrl` must match the iGEM path
    ├── .gitlab-ci.yml            -> Build + deploy pipeline
    └── docusaurus-export/        -> Original standalone export of the custom pages (reference only)

### Two things you must not break

1. **`url` + `baseUrl` in `docusaurus.config.ts`.** iGEM serves the wiki at
   `https://2026.igem.wiki/uofglasgow/`, so they must be:
   ```ts
   url: 'https://2026.igem.wiki',
   baseUrl: '/uofglasgow/',   // leading AND trailing slash
   ```
   If `baseUrl` is wrong, every asset on every page 404s.

2. **The licence notice and the `gitlab.igem.org` repository link in
   `src/theme/Footer/index.jsx`.** iGEM requires both on *every* page for judging.
   That footer is a swizzled component and fully replaces the default one, so the
   `footer` block in `docusaurus.config.ts` is not what renders — edit the JSX.

### Linking and assets, safely

`baseUrl` is not the domain root, so raw paths break in production. Use the
Docusaurus helpers:

```jsx
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

<Link to="/docs/results">Results</Link>          // ✅  not <a href="/docs/results">
<img src={useBaseUrl('/img/logo.png')} />        // ✅  not src="/img/logo.png"
```

In Markdown, ordinary `[text](./other-page.mdx)` links are handled for you.

Note that `stylesheets` and `scripts` in `docusaurus.config.ts` are **not**
baseUrl-aware. Import CSS from `src/css/custom.css` instead — that is why KaTeX's
stylesheet is imported there rather than declared in the config.

## Repositories and deployment

**GitHub is the source of truth. Never commit directly on iGEM GitLab.**

| Where       | Role                                                            |
| ----------- | --------------------------------------------------------------- |
| GitHub      | All work: branches, pull requests, review, issues                |
| iGEM GitLab | Deploy target. Receives `main` only, written by CI, never by hand |

Day-to-day: branch off `main` on GitHub, open a pull request. `Build check` runs
`pnpm typecheck` and `pnpm build` on it. Merge when green.

On merge, `Mirror main to iGEM GitLab` builds the site again and — only if that
build succeeds — pushes `main` to GitLab. `.gitlab-ci.yml` then runs there:
it installs with the pinned pnpm, runs `pnpm build`, and moves `build/` to
`public/` because GitLab Pages serves from `public/`. The result is published at
<https://2026.igem.wiki/uofglasgow/>. A broken commit never reaches GitLab, so
the published wiki always corresponds to a build that passed.

The mirror pushes without `--force`, on purpose. iGEM protects `main`, so a
Developer-role push could never be a force push anyway. More importantly, if the
two ever diverge — because someone committed on GitLab by hand — a plain push
fails loudly and a human decides what to do, rather than the mirror silently
overwriting it.

A scheduled run each morning checks that GitLab still matches GitHub. It exists
to catch a revoked or expired SSH key weeks before the wiki freeze rather than on
the day of it. **If you get a failure email from it, do not ignore it.**

Run `pnpm build` locally before opening a pull request.

### Before the wiki freeze

1. Merge everything to `main` well ahead of the deadline.
2. Actions → **Mirror main to iGEM GitLab** → **Run workflow**. Confirm green.
3. Confirm the **GitLab** pipeline also went green at
   <https://gitlab.igem.org/2026/uofglasgow/-/pipelines>. A green GitHub build only
   proves the site compiles — GitLab's pipeline is what actually publishes Pages.
4. Load <https://2026.igem.wiki/uofglasgow/> and confirm it is current.

**During the freeze the mirror job will fail on every push. That is expected, not
an incident** — GitLab rejects all writes while frozen. Keep working on GitHub;
GitLab holds the frozen state that gets judged.

### Mirror credentials

The mirror authenticates over SSH as a dedicated, passphrase-free key stored as
the GitHub Actions secret `MIRROR_SSH_KEY`, with its public half registered on a
team member's GitLab account (Preferences → SSH Keys, usage type **Write**).
iGEM grants teams only Developer role, which rules out deploy keys and project
access tokens, so an account key is the only option.

The workflow pins iGEM's SSH host key rather than disabling host-key checking.
If it ever fails with `Host key verification failed`, iGEM rotated their key —
re-run `ssh-keyscan -t ed25519 ssh.gitlab.igem.org`, confirm the new value out of
band, and update the pin in `.github/workflows/mirror-to-gitlab.yml`.

Note the key's expiry date. When it lapses, generate a new keypair, update both
the GitLab key and the GitHub secret, then run the mirror manually to confirm.

## Technologies

- [Docusaurus 3](https://docusaurus.io) — static site generator; Markdown/MDX pages
- [React 19](https://react.dev) — the custom landing and team pages
- [MDX](https://mdxjs.com) — React components inside Markdown
- [KaTeX](https://katex.org) via `remark-math` / `rehype-katex` — LaTeX math
- [Mermaid](https://mermaid.js.org) — diagrams in ` ```mermaid ` code blocks
- [Recharts](https://recharts.org) — charts from your own data
- [TypeScript](https://www.typescriptlang.org) — config and sidebars

<!-- mirror pipeline verified 2026-07-27 -->
