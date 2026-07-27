# Notes for AI assistants

Read **[README.md](README.md)** first — it covers the stack (Docusaurus 3 + MDX),
where to edit (`docs/*.mdx`, `src/pages/*`, `sidebars.ts`), the `pnpm` commands,
and the iGEM asset rules (images via the uploads tool, videos from iGEM servers,
no external CDNs).

## Responsible & honest use
@.claude/RESPONSIBLE_AI_USE.md

## Guardrails
- Don't change `LICENSE` or the license notice + GitLab repository link in
  `src/theme/Footer/index.jsx` (both required on every page for judging). That
  swizzled footer replaces the default one, so the `footer` block in
  `docusaurus.config.ts` is inert — edit the JSX.
- Don't change `url` / `baseUrl` in `docusaurus.config.ts`. They must stay
  `https://2026.igem.wiki` + `/uofglasgow/` or every asset 404s in production.
- Never introduce a third-party CDN reference (Google Fonts, jsDelivr, cdnjs,
  YouTube/Vimeo embeds). Fonts are self-hosted in `src/css/fonts/`; KaTeX CSS is
  imported from `node_modules` via `src/css/custom.css`. Note that `stylesheets`
  and `scripts` in `docusaurus.config.ts` are not baseUrl-aware — don't use them.
- In JSX use `<Link to>` and `useBaseUrl()`, never raw `<a href="/…">` or
  `src="/…"` for internal paths.
- GitHub is the source of truth; iGEM GitLab is a deploy target written only by
  `.github/workflows/mirror-to-gitlab.yml`. Never push to the GitLab remote by
  hand, and don't add workflows that write to it.
- `.gitlab-ci.yml` works as-is; change it only if you know what you're doing —
  any build/deploy issues that result are the team's responsibility.
- Run `pnpm build` before claiming a change works.