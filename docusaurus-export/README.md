# Synwave — Docusaurus custom pages export

Drop-in React pages + theme for the iGEM Synwave wiki. These are the **custom,
designed pages**; the content-heavy chapters (Project, Engineering, Parts,
Model, Safety, Human Practices, Notebook, …) live as Markdown/MDX in `docs/`.

## What's in here

```
docusaurus-export/
├── src/
│   ├── pages/
│   │   ├── index.jsx             → route /       (Home — the frontpage)
│   │   └── team.jsx             → route /team   (Team page)
│   ├── components/
│   │   ├── SynwaveBackground.jsx  the animated particle hero field
│   │   └── useReveal.js           scroll-reveal hook (IntersectionObserver)
│   ├── data/
│   │   └── team.js                EDIT THIS — real members + advisors + photos
│   └── css/
│       └── custom.css             brand fonts, keyframes, Infima theme re-skin
└── static/
    └── img/
        └── synwave-logo-v2.png    hero logo (referenced as /img/synwave-logo-v2.png)
```

## Install

1. Copy the contents of `src/` into your Docusaurus project's `src/`
   (merge — keep your existing `src/pages/` and add `team.jsx`).
2. Point Docusaurus at the theme CSS in `docusaurus.config.js`:

   ```js
   presets: [
     ['classic', {
       theme: { customCss: require.resolve('./src/css/custom.css') },
       docs: { /* your docs config */ },
     }],
   ],
   ```

3. The `@site/...` import aliases used in the pages work out of the box in
   Docusaurus (it maps `@site` to the project root).
4. Copy `static/img/synwave-logo-v2.png` into your project's `static/img/`
   (the Home hero references it as `/img/synwave-logo-v2.png`).
5. `npm run start` → visit `/` (Home) and `/team`.

## Page links to wire up

The Home page's six "Explore the wiki" cards point at doc routes that don't
exist yet (`/docs/description`, `/docs/engineering`, `/docs/results`,
`/docs/human-practices`, `/docs/notebook`) plus `/team`. Update those `href`s
in `src/pages/index.jsx` (the `chapters` array at the top) to match the real
slugs of your Markdown docs once they exist.

## Editing the team

Open `src/data/team.js`. Add your real people and roles. For photos, drop images
in `static/img/team/` and set `photo: '/img/team/ada.jpg'` on each member — the
`PhotoSlot` component swaps the placeholder for the image automatically.

## Architecture notes (important)

- **No custom navbar in the page.** The prototype had its own fixed nav; the
  Docusaurus version intentionally drops it and uses the **theme navbar**
  (`<Layout>` wraps every page). `custom.css` re-skins that navbar to the navy/
  gold Synwave look, so the docs pages and custom pages share one shell. Set the
  navbar items + the gold "Explore" CTA in `docusaurus.config.js → themeConfig.navbar`.
- **Footer**: the page ends with the big stroked "Synwave" wordmark band; below
  it Docusaurus renders the theme footer (also re-skinned in `custom.css`).
  Configure its columns in `themeConfig.footer`. If you'd rather not show the
  theme footer, you can hide it per-page, but keeping it is recommended for the
  legal/CC-BY + nav links iGEM expects.
- **Fonts & keyframes** are global (in `custom.css`), so every page — including
  Markdown docs — gets Sora / Archivo / IBM Plex Mono automatically.

## Porting the rest

`team.jsx` is the reference pattern for converting the other prototype pages:

| Prototype (HTML/CSS/JS)        | Docusaurus React                         |
|--------------------------------|------------------------------------------|
| `class="..."`                  | `style={{ ... }}` object (camelCase keys)|
| `style-hover="..."`            | `onMouseEnter` / `onMouseLeave` handlers |
| `componentDidMount()` canvas   | `useEffect(() => { ... }, [])`           |
| fixed `<nav>`                  | delete — use theme navbar                |
| `<sc-for>` loops               | `array.map(...)`                          |

Both **Home** (`index.jsx`) and **Team** (`team.jsx`) are done. The count-up on
the Home stats and the marquee/scroll/logo animations rely on the keyframes in
`custom.css` (`marquee`, `scrollPulse`, `logoFloat`, `glowPulse`, `fadeUp`) —
all already included.

Still to port when you're ready: **Sponsors** and **Contact** (currently folded
into the Home page + footer).
