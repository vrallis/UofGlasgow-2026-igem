import { useEffect } from 'react';

/**
 * Marks the current page as a "dark-only" custom Synwave page.
 *
 * The custom pages (home, team, future landing-style pages) are hardcoded to
 * the navy/gold Synwave design and don't have a light variant, so the navbar
 * light/dark toggle is meaningless there. This adds a body class while the page
 * is mounted; custom.css uses it to hide the color-mode switch. Docs/blog pages
 * never call this hook, so they keep the toggle.
 *
 * Usage: call `useDarkOnly();` at the top of any custom page component.
 */
export default function useDarkOnly() {
  useEffect(() => {
    document.body.classList.add('synwave-darkonly');
    return () => document.body.classList.remove('synwave-darkonly');
  }, []);
}
