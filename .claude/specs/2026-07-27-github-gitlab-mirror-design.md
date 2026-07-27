# Design: GitHub as source of truth, mirrored to iGEM GitLab

**Date:** 2026-07-27
**Status:** Implemented. Amended 2026-07-27 — see "Why the push is not forced".

## Problem

The iGEM GitLab instance (`gitlab.igem.org/2026/uofglasgow`) has a restrictive
permissions model. Team members hold **Developer** role at most, which blocks
deploy keys, project access tokens, and most project settings. Day-to-day
collaboration — branch protection, PR review, issue triage — is impractical
there.

The wiki must still be published from GitLab: iGEM's Pages runner is what serves
`https://2026.igem.wiki/uofglasgow/`, and it only builds from that repository.

Additionally, iGEM enforces a **wiki freeze** deadline after which the repository
rejects pushes. Work-in-progress that has not reached GitLab by that moment is
not judged.

## Goal

Move all collaboration to GitHub, and keep GitLab continuously up to date via
automation, so that the freeze can never catch the team with stale or broken
content on GitLab.

## Non-goals

- Bidirectional sync. GitHub is authoritative; GitLab is written to only by CI.
- Mirroring branches other than `main`.
- Changing how the wiki is built or deployed. `.gitlab-ci.yml` is unchanged.

## Architecture

```
  team ──PR──▶ GitHub (source of truth)
                  │  push to main
                  ▼
         .github/workflows/mirror-to-gitlab.yml
                  │  1. pnpm install --frozen-lockfile
                  │  2. pnpm build          ◀── gate: fail here = no mirror
                  │  3. git push gitlab HEAD:main
                  ▼
            iGEM GitLab (deploy target, main only)
                  │  .gitlab-ci.yml (unchanged)
                  ▼
         https://2026.igem.wiki/uofglasgow/
```

Feature branches, pull requests, reviews and issues live only on GitHub. GitLab
receives `main` and nothing else.

### Why the push is not forced

**Amended 2026-07-27, after the first mirror attempt failed.**

The original design force-pushed, reasoning that nobody commits on GitLab so
force-push could not destroy work. Two things were wrong with that.

First, the premise was already false: `synwave-migration` had been merged on
GitLab as merge request !1 (`5db2207`) the day before, and again on GitHub as
pull request #1. Two independent merge commits of the same branch left the two
`main` branches genuinely divergent. That was reconciled with an empty merge
commit making GitHub `main` a descendant of GitLab `main`.

Second, and permanently: iGEM protects `main`, and a protected branch rejects
non-fast-forward pushes regardless of the flag. A Developer-role force push is
therefore impossible, so `--force` bought nothing and could only mask problems.

The mirror pushes plainly. If GitHub and GitLab diverge, the push fails loudly
and a human reconciles — the same principle the daily drift check is built on.
The cost is that a genuine history rewrite on GitHub `main` must be reconciled by
hand. Since force-push is impossible here, that cost is unavoidable rather than
chosen.

## Authentication

Developer role blocks deploy keys and project access tokens, so the mirror
authenticates as a **user account** over SSH.

- A **dedicated CI keypair** is generated, with **no passphrase** (CI cannot
  answer a prompt).
- The public half is added at **GitLab → Preferences → SSH Keys**. This is an
  account-level setting, so Developer role is no obstacle.
- The private half is stored as GitHub Actions secret `MIRROR_SSH_KEY`.

A dedicated key is used rather than a personal daily-driver key so that a leak is
contained to one revocable credential.

Push remote: `git@ssh.gitlab.igem.org:2026/uofglasgow.git` — note iGEM serves SSH
from the `ssh.` subdomain, not the web host. Its host key is pinned into
`known_hosts` in the workflow rather than relying on `StrictHostKeyChecking=no`.

Secrets are unreadable by fork pull requests, and the mirror workflow triggers
only on `push: main`, `workflow_dispatch` and `schedule`. A public GitHub
repository is therefore safe.

## Workflows

### `.github/workflows/mirror-to-gitlab.yml`

| Trigger | Behaviour |
|---|---|
| `push` to `main` | install → `pnpm build` → on success, push `HEAD:main` to GitLab |
| `workflow_dispatch` | Same as above, run manually. The freeze-eve button. |
| `schedule`, daily | No build. `git ls-remote` GitLab and compare to GitHub `main`. Equal → exit. Different → push (self-heal). Auth failure → job fails → GitHub notifies. |

Checkout uses `fetch-depth: 0`; a shallow clone cannot push full history.

The build step mirrors `.gitlab-ci.yml` exactly — Node 22, `corepack enable`,
`pnpm install --frozen-lockfile`, `pnpm build` — so a green GitHub build is
strong evidence the GitLab build will also pass.

The scheduled run is the core reliability feature. An expired or revoked key, or
a silently failed push, surfaces the next morning rather than on freeze day.

### `.github/workflows/ci.yml`

Runs `pnpm build` on every pull request. Broken builds are caught at review time
and never reach `main`.

## Failure modes

| Condition | Result |
|---|---|
| Build fails | No push. GitLab keeps serving the last good deploy. GitHub shows red. |
| Key revoked or expired | Job fails, GitHub notifies. GitLab holds last good state. |
| **Freeze active** | GitLab rejects the push and the mirror job fails on every push to `main`. **This is expected, not an incident.** Work continues on GitHub; GitLab holds the frozen judged state. |
| GitHub `main` history rewritten | Mirror push fails as non-fast-forward. Reconcile by hand — see "Why the push is not forced". |

## Freeze playbook

Documented in `README.md`:

1. Merge everything to `main` well before the deadline.
2. Trigger the mirror manually via `workflow_dispatch`; confirm green.
3. Confirm the **GitLab** pipeline also went green. A green GitHub build only
   proves the site compiles; GitLab's job is what publishes Pages.
4. Load `https://2026.igem.wiki/uofglasgow/` and confirm it is current.

## Files

| File | Change |
|---|---|
| `.github/workflows/mirror-to-gitlab.yml` | new |
| `.github/workflows/ci.yml` | new |
| `README.md` | new section: remotes, secret setup, freeze playbook |
| `CLAUDE.md` | one guardrail: GitHub is authoritative, never push to GitLab by hand |

Untouched: `.gitlab-ci.yml`, `docusaurus.config.ts`, `LICENSE`,
`src/theme/Footer/index.jsx`. All existing guardrails hold.

Note: specs live in `.claude/specs/` rather than `docs/`, because `sidebars.ts`
autogenerates the wiki sidebar from every Markdown file under `docs/` — a spec
placed there would be published as a wiki page.

## Cutover sequence

Steps 1–3 require the user's hands (credentials and repository creation); the
rest can be automated.

1. Generate the CI keypair; add the public half to the GitLab account.
2. Create the fresh GitHub repository; push `main` and `synwave-migration`.
3. Add the `MIRROR_SSH_KEY` secret to the GitHub repository.
4. Open a PR merging `synwave-migration` → `main`; `ci.yml` proves it builds.
5. Merge. The mirror fires, GitLab `main` updates, Pages rebuilds.
6. Verify `https://2026.igem.wiki/uofglasgow/` serves the Synwave wiki.

The existing archived GitHub repository stays archived as a historical record.
