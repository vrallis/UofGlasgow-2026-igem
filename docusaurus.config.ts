import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Synwave',
  tagline: 'An engineered bacterial biosensor reading the gut–brain axis for early Alzheimer’s detection.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // iGEM publishes each team's wiki at https://<year>.igem.wiki/<team-slug>/
  // For this repo (gitlab.igem.org/2026/uofglasgow) that is
  //   https://2026.igem.wiki/uofglasgow/
  // baseUrl needs BOTH a leading and a trailing slash, or every asset 404s.
  url: 'https://2026.igem.wiki',
  baseUrl: '/uofglasgow/',

  organizationName: '2026', // gitlab.igem.org group = the competition year
  projectName: 'uofglasgow', // gitlab.igem.org project = the team slug

  onBrokenLinks: 'warn',

  // Mermaid diagram support (```mermaid code blocks in MD/MDX)
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // NOTE: KaTeX's stylesheet is NOT declared here. Docusaurus does not prefix
  // `stylesheets` hrefs with baseUrl, so '/katex/katex.min.css' would resolve to
  // https://2026.igem.wiki/katex/... and 404. Instead src/css/custom.css imports
  // it from node_modules, which lets webpack emit the CSS and its font files
  // under baseUrl automatically. No CDN involved either way.

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          editUrl:
            'https://gitlab.igem.org/2026/uofglasgow/-/tree/main/',
        },
        // No blog on the wiki — the docs tree plus the custom landing/team
        // pages are the whole site.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // og:image / twitter:image — path is relative to static/, baseUrl is added.
    image: 'img/synwave-logo-v2.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Synwave',
      logo: {
        alt: 'Synwave Logo',
        src: 'img/synwave-logo-v2.png',
      },
      items: [
        {to: '/docs/description', label: 'Project', position: 'left'},
        {to: '/docs/engineering', label: 'Engineering', position: 'left'},
        {to: '/docs/results', label: 'Results', position: 'left'},
        {to: '/docs/human-practices', label: 'Human Practices', position: 'left'},
        {to: '/docs/notebook', label: 'Notebook', position: 'left'},
        {to: '/team', label: 'Team', position: 'left'},
        {
          to: '/docs/description',
          label: 'Explore',
          position: 'right',
          className: 'navbar__link--cta',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Wiki',
          items: [
            {label: 'Project Description', to: '/docs/description'},
            {label: 'Engineering', to: '/docs/engineering'},
            {label: 'Results', to: '/docs/results'},
            {label: 'Notebook', to: '/docs/notebook'},
          ],
        },
        {
          title: 'Team',
          items: [
            {label: 'Human Practices', to: '/docs/human-practices'},
            {label: 'Team & Advisors', to: '/team'},
            {label: 'Safety', to: '/docs/safety'},
          ],
        },
        {
          title: 'iGEM',
          items: [
            {label: 'iGEM 2026', href: 'https://igem.org'},
            {label: 'University of Glasgow', href: 'https://www.gla.ac.uk'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} iGEM Synwave — University of Glasgow. Content under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
