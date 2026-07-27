# GitHub → iGEM GitLab Mirror Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make GitHub the source of truth for the UofGlasgow 2026 wiki, with a GitHub Actions workflow that force-pushes `main` to iGEM GitLab after a successful build, so the iGEM wiki freeze can never catch the team with stale or broken content.

**Architecture:** Two GitHub Actions workflows. `ci.yml` typechecks and builds every pull request. `mirror-to-gitlab.yml` runs on pushes to `main`, on manual dispatch, and daily on a schedule — it compares GitHub `main` to GitLab `main`, builds when there is drift, and force-pushes over SSH. GitLab is written to only by this workflow and holds nothing but `main`.

**Tech Stack:** GitHub Actions, Node 22, pnpm 11.7.0 (pinned via `packageManager`), Docusaurus 3.10.1, SSH push to `ssh.gitlab.igem.org`.

**Spec:** `.claude/specs/2026-07-27-github-gitlab-mirror-design.md`

## Global Constraints

- Node `>=20` (`engines`), CI uses **22** to match `.gitlab-ci.yml`'s `image: node:22`.
- pnpm is pinned to `11.7.0` by `packageManager`; always enable it via `corepack enable`, never `npm i -g pnpm`.
- `COREPACK_ENABLE_DOWNLOAD_PROMPT: "0"` must be set wherever corepack runs unattended.
- Install with `pnpm install --frozen-lockfile`. Never let CI mutate `pnpm-lock.yaml`.
- GitLab remote is `git@ssh.gitlab.igem.org:2026/uofglasgow.git` — SSH lives on the `ssh.` subdomain, **not** the web host `gitlab.igem.org`.
- Pinned SSH host key (verified via `ssh-keyscan` on 2026-07-27):
  `ssh.gitlab.igem.org ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMk+O4X7TW0ThKHCON769PMtvcX+uJQ5hRssTaVCeWYd`
- Never set `StrictHostKeyChecking=no`.
- Only `main` is ever pushed to GitLab.
- **Do not modify** `.gitlab-ci.yml`, `docusaurus.config.ts` (`url` / `baseUrl`), `LICENSE`, or `src/theme/Footer/index.jsx`.
- Specs and plans live under `.claude/`, never under `docs/` — `sidebars.ts` autogenerates the wiki sidebar from every Markdown file in `docs/`, so a file placed there is published as a wiki page.

---

## Task 0: Credentials and GitHub repository (manual — user only)

These steps require account access an agent does not have. **The user performs
all of them.** No later task can be verified until Task 0 is complete.

**Files:** none.

**Interfaces:**
- Produces: a GitHub repository with `main` and `synwave-migration` pushed; a
  GitHub Actions secret named exactly `MIRROR_SSH_KEY` containing an OpenSSH
  private key with no passphrase; the matching public key registered on the
  user's GitLab account.

- [ ] **Step 1: Generate a dedicated, passphrase-free CI keypair**

Run locally. The empty `-N ''` is deliberate — CI cannot answer a passphrase prompt.

```bash
ssh-keygen -t ed25519 -N '' -C 'github-actions-mirror-uofglasgow' -f ~/.ssh/igem_mirror_ci
```

This writes `~/.ssh/igem_mirror_ci` (private) and `~/.ssh/igem_mirror_ci.pub` (public).

- [ ] **Step 2: Register the public key on GitLab**

```bash
cat ~/.ssh/igem_mirror_ci.pub
```

Paste the output at <https://gitlab.igem.org/-/user_settings/ssh_keys>. Title it
`github-actions-mirror`. Set usage type **Write**. Set the expiry as far out as
iGEM permits and note the date.

This is an account-level setting, so Developer project role is no obstacle.

- [ ] **Step 3: Verify the key can reach iGEM GitLab**

```bash
ssh -i ~/.ssh/igem_mirror_ci -o IdentitiesOnly=yes -T git@ssh.gitlab.igem.org
```

Expected: a welcome line naming your GitLab username.
If it says `Permission denied (publickey)`, the key was not saved correctly — redo Step 2.

- [ ] **Step 4: Create the GitHub repository**

Create a new **empty** repository (no README, no `.gitignore`, no licence — the
repo already has all three). Name suggestion: `igem-uofglasgow-2026`.

- [ ] **Step 5: Add the GitHub remote and push both branches**

Replace `<owner>/<repo>` with the repository just created.

```bash
git remote add github git@github.com:<owner>/<repo>.git
git push github main
git push github synwave-migration
```

`origin` is deliberately left pointing at GitLab so the mirror's target is
unambiguous; day-to-day work uses the `github` remote.

- [ ] **Step 6: Store the private key as a GitHub Actions secret**

```bash
cat ~/.ssh/igem_mirror_ci
```

Copy the **entire** output including the `-----BEGIN OPENSSH PRIVATE KEY-----`
and `-----END OPENSSH PRIVATE KEY-----` lines and the trailing newline.

In the GitHub repository: Settings → Secrets and variables → Actions → New
repository secret. Name it exactly `MIRROR_SSH_KEY`. Paste the key as the value.

- [ ] **Step 7: Set the default branch**

Confirm GitHub Settings → General → Default branch is `main`.

---

## Task 1: Pull request build check

Delivers a working PR gate. Independently useful and testable without any
secret, so it is built first.

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: the GitHub repository from Task 0.
- Produces: a workflow named `Build check` with a job id `build`. Task 4 relies
  on this appearing as a required-looking status on the cutover PR.

- [ ] **Step 1: Establish the failing verification**

The check this workflow automates is `pnpm build`. Confirm it currently passes
locally, so that a later CI failure means a CI problem, not a content problem.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

Expected: both succeed, and `build/` is written.
If `pnpm build` fails here, **stop** — fix the site before continuing. Mirroring
a broken site is the exact failure this plan exists to prevent.

- [ ] **Step 2: Confirm no workflow exists yet**

```bash
ls .github/workflows/ 2>/dev/null || echo "no workflows directory"
```

Expected: `no workflows directory`. This is the "test fails first" state — GitHub
runs no checks on pull requests today.

- [ ] **Step 3: Create the workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: Build check

on:
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Set up Node 22
        uses: actions/setup-node@v5
        with:
          node-version: 22

      - name: Enable pinned pnpm
        env:
          COREPACK_ENABLE_DOWNLOAD_PROMPT: "0"
        run: corepack enable

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: pnpm typecheck

      - name: Build
        run: pnpm build
```

- [ ] **Step 4: Verify the YAML parses**

```bash
node -e "const y=require('fs').readFileSync('.github/workflows/ci.yml','utf8'); if(!/jobs:/.test(y)) process.exit(1); console.log('ci.yml readable, contains jobs')"
```

Expected: `ci.yml readable, contains jobs`.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: build and typecheck every pull request on GitHub"
```

- [ ] **Step 6: Verify it runs for real**

Push the branch to GitHub and open a pull request against `main`. Watch the
Actions tab.

Expected: the `Build check / build` job runs and goes green.
If `corepack enable` fails with a permissions error, change that step's `run` to
`sudo corepack enable` and commit the fix.

---

## Task 2: Mirror workflow

The core deliverable. Requires `MIRROR_SSH_KEY` from Task 0.

**Files:**
- Create: `.github/workflows/mirror-to-gitlab.yml`

**Interfaces:**
- Consumes: GitHub Actions secret `MIRROR_SSH_KEY` (Task 0, Step 6).
- Produces: a workflow named `Mirror main to iGEM GitLab`, manually runnable via
  `workflow_dispatch`. Task 4's cutover and the README playbook both depend on
  that dispatch button existing.

- [ ] **Step 1: Establish the failing verification**

Prove GitLab is currently *behind* GitHub, so a successful mirror is observable
rather than a no-op.

```bash
git rev-parse main
git ls-remote git@ssh.gitlab.igem.org:2026/uofglasgow.git refs/heads/main
```

Expected: two **different** SHAs, or the same SHA if `main` has not diverged yet.
Record both. If `git ls-remote` errors, Task 0 Step 3 did not actually succeed —
go back and fix the key before writing the workflow.

- [ ] **Step 2: Create the workflow**

Create `.github/workflows/mirror-to-gitlab.yml`:

```yaml
name: Mirror main to iGEM GitLab

# GitHub is the source of truth. iGEM GitLab is a deploy target that receives
# `main` and nothing else, so force-pushing is safe: nobody commits there.
#
#   push to main   -> build, then push (a broken build never reaches GitLab)
#   manual         -> same. This is the freeze-eve "sync now" button.
#   daily schedule -> no build; re-push only if GitLab has drifted. Its real job
#                     is to fail loudly when the SSH key expires or is revoked,
#                     weeks before the wiki freeze rather than on the day.

on:
  push:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: "17 6 * * *"

permissions:
  contents: read

# Never let two mirror runs push at once.
concurrency:
  group: mirror-to-gitlab
  cancel-in-progress: false

env:
  GITLAB_REMOTE: git@ssh.gitlab.igem.org:2026/uofglasgow.git

jobs:
  mirror:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout full history
        uses: actions/checkout@v5
        with:
          # A shallow clone cannot be pushed as a complete history.
          fetch-depth: 0

      - name: Configure SSH for iGEM GitLab
        env:
          MIRROR_SSH_KEY: ${{ secrets.MIRROR_SSH_KEY }}
        run: |
          if [ -z "$MIRROR_SSH_KEY" ]; then
            echo "::error::Secret MIRROR_SSH_KEY is not set on this repository."
            exit 1
          fi
          mkdir -p ~/.ssh
          chmod 700 ~/.ssh
          printf '%s\n' "$MIRROR_SSH_KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          # Host key pinned deliberately; never StrictHostKeyChecking=no.
          cat > ~/.ssh/known_hosts <<'EOF'
          ssh.gitlab.igem.org ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMk+O4X7TW0ThKHCON769PMtvcX+uJQ5hRssTaVCeWYd
          EOF
          chmod 600 ~/.ssh/known_hosts
          cat > ~/.ssh/config <<'EOF'
          Host ssh.gitlab.igem.org
            User git
            IdentityFile ~/.ssh/id_ed25519
            IdentitiesOnly yes
            StrictHostKeyChecking yes
          EOF
          chmod 600 ~/.ssh/config

      - name: Compare GitHub main to GitLab main
        id: drift
        run: |
          local_sha="$(git rev-parse HEAD)"
          # A failure here means the key is dead or GitLab is unreachable.
          # `set -e` is on by default, so the job fails and GitHub notifies us.
          remote_sha="$(git ls-remote "$GITLAB_REMOTE" refs/heads/main | cut -f1)"
          echo "GitHub main: ${local_sha}"
          echo "GitLab main: ${remote_sha:-<empty>}"
          if [ "$local_sha" = "$remote_sha" ]; then
            echo "in_sync=true" >> "$GITHUB_OUTPUT"
            echo "GitLab is already up to date. Nothing to do."
          else
            echo "in_sync=false" >> "$GITHUB_OUTPUT"
          fi

      # Scheduled runs skip the build: whatever is on `main` was already gated
      # by the push-triggered run, so a self-heal push needs no re-verification.
      - name: Set up Node 22
        if: steps.drift.outputs.in_sync == 'false' && github.event_name != 'schedule'
        uses: actions/setup-node@v5
        with:
          node-version: 22

      - name: Build, exactly as .gitlab-ci.yml does
        if: steps.drift.outputs.in_sync == 'false' && github.event_name != 'schedule'
        env:
          COREPACK_ENABLE_DOWNLOAD_PROMPT: "0"
        run: |
          corepack enable
          pnpm install --frozen-lockfile
          pnpm build

      - name: Push main to iGEM GitLab
        if: steps.drift.outputs.in_sync == 'false'
        run: git push --force "$GITLAB_REMOTE" HEAD:refs/heads/main

      - name: Summary
        if: always()
        run: |
          if [ "${{ steps.drift.outputs.in_sync }}" = "true" ]; then
            echo "Already in sync — no push needed." >> "$GITHUB_STEP_SUMMARY"
          else
            echo "Pushed $(git rev-parse --short HEAD) to GitLab main." >> "$GITHUB_STEP_SUMMARY"
            echo "Check the GitLab pipeline: https://gitlab.igem.org/2026/uofglasgow/-/pipelines" >> "$GITHUB_STEP_SUMMARY"
          fi
```

- [ ] **Step 3: Verify the YAML parses and the host key is pinned**

```bash
node -e "const y=require('fs').readFileSync('.github/workflows/mirror-to-gitlab.yml','utf8'); if(/StrictHostKeyChecking[= ]no/.test(y)) { console.error('FAIL: host key checking disabled'); process.exit(1); } if(!/ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMk\+O4X7TW0ThKHCON769PMtvcX\+uJQ5hRssTaVCeWYd/.test(y)) { console.error('FAIL: pinned host key missing'); process.exit(1); } console.log('OK: host key pinned, strict checking on')"
```

Expected: `OK: host key pinned, strict checking on`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/mirror-to-gitlab.yml
git commit -m "ci: mirror main to iGEM GitLab after a successful build"
```

- [ ] **Step 5: Verify the mirror end to end**

This only works once the workflow file is on GitHub's `main` — `workflow_dispatch`
reads the workflow from the default branch. If Task 4 has not run yet, defer this
step until immediately after the cutover merge.

In the GitHub Actions tab, select **Mirror main to iGEM GitLab** → **Run workflow**.

Expected, in order:
1. `Configure SSH` succeeds — meaning the secret exists and is well-formed.
2. `Compare GitHub main to GitLab main` prints two SHAs.
3. If they differ, the build runs and the push succeeds.
4. `git ls-remote git@ssh.gitlab.igem.org:2026/uofglasgow.git refs/heads/main`
   run locally now returns the same SHA as GitHub `main`.

Failure triage:
- `Permission denied (publickey)` → the secret is truncated or the GitLab key was
  registered with **Read** usage type instead of **Write**.
- `Host key verification failed` → iGEM rotated their host key. Re-run
  `ssh-keyscan -t ed25519 ssh.gitlab.igem.org`, confirm the new value out of band,
  and update the pin.
- `pre-receive hook declined` / `repository is read-only` → the wiki freeze is
  active. Expected; see the README playbook.

---

## Task 3: Documentation

Records the new topology so nobody force-pushes GitLab by hand or panics at a
red mirror job during the freeze.

**Files:**
- Modify: `README.md` — replace the `## Deployment` section (lines 132–139)
- Modify: `CLAUDE.md` — add one bullet to `## Guardrails`

**Interfaces:**
- Consumes: workflow names from Tasks 1 and 2 (`Build check`, `Mirror main to iGEM GitLab`).
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Replace the README Deployment section**

Replace the whole `## Deployment` section with:

```markdown
## Repositories and deployment

**GitHub is the source of truth. Never commit directly on iGEM GitLab.**

| Where | Role |
| ----- | ---- |
| GitHub | All work: branches, pull requests, review, issues |
| iGEM GitLab | Deploy target. Receives `main` only, written by CI, never by hand |

Day-to-day: branch off `main` on GitHub, open a pull request. `Build check` runs
`pnpm typecheck` and `pnpm build` on it. Merge when green.

On merge, `Mirror main to iGEM GitLab` builds the site again and — only if that
build succeeds — force-pushes `main` to GitLab. `.gitlab-ci.yml` then runs there
and publishes to <https://2026.igem.wiki/uofglasgow/>. A broken commit never
reaches GitLab, so the published wiki always corresponds to a build that passed.

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

Note the key's expiry date. When it lapses, generate a new keypair, update both
the GitLab key and the GitHub secret, then run the mirror manually to confirm.
```

- [ ] **Step 2: Update the Getting started clone URL**

In `README.md` step 1 of `## Getting started`, replace the GitLab clone command
with the GitHub one:

```bash
git clone git@github.com:<owner>/<repo>.git
cd uofglasgow
```

Use the actual repository path created in Task 0, Step 4.

- [ ] **Step 3: Update the Getting started commit instruction**

In `## Getting started` step 6, replace the text telling contributors to commit
to `main` with:

```markdown
6. Open a pull request against **`main`** on GitHub. Once merged, the wiki
   deploys automatically — see [Repositories and deployment](#repositories-and-deployment).
```

- [ ] **Step 4: Add the CLAUDE.md guardrail**

Add to the `## Guardrails` list in `CLAUDE.md`:

```markdown
- GitHub is the source of truth; iGEM GitLab is a deploy target written only by
  `.github/workflows/mirror-to-gitlab.yml`. Never push to the GitLab remote by
  hand, and don't add workflows that write to it.
```

- [ ] **Step 5: Verify the docs are internally consistent**

```bash
grep -n "Repositories and deployment" README.md
grep -n "mirror-to-gitlab" README.md CLAUDE.md
grep -rn "gitlab.igem.org/2026/uofglasgow$" README.md
```

Expected: the new heading exists, both files reference the mirror workflow, and
no stale "clone from GitLab" instruction remains.

- [ ] **Step 6: Confirm the docs edits did not break the site build**

`README.md` and `CLAUDE.md` are not part of the Docusaurus build, but run this to
be certain nothing else was touched:

```bash
pnpm build
```

Expected: success.

- [ ] **Step 7: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: describe the GitHub-first workflow and freeze playbook"
```

---

## Task 4: Cutover

Merges the Synwave wiki to `main` and proves the whole chain end to end.

**Files:** none created; this task executes the pipeline built above.

**Interfaces:**
- Consumes: everything from Tasks 0–3.
- Produces: `https://2026.igem.wiki/uofglasgow/` serving the Synwave wiki.

- [ ] **Step 1: Push the branch and open the cutover pull request**

```bash
git push github synwave-migration
```

Open a pull request on GitHub: `synwave-migration` → `main`.

- [ ] **Step 2: Verify the build check gates it**

Expected: `Build check / build` runs on the pull request and goes green.
Do not merge until it does. This is the gate, not a formality.

- [ ] **Step 3: Merge**

Merge the pull request on GitHub. Use a regular merge commit so the old `main`
line stays an ancestor and the GitLab push is not a history rewrite.

- [ ] **Step 4: Verify the mirror fired**

In the GitHub Actions tab, confirm `Mirror main to iGEM GitLab` triggered on the
merge and succeeded.

```bash
git fetch github main
git rev-parse github/main
git ls-remote git@ssh.gitlab.igem.org:2026/uofglasgow.git refs/heads/main
```

Expected: both commands print the **same** SHA.

- [ ] **Step 5: Verify GitLab published it**

Open <https://gitlab.igem.org/2026/uofglasgow/-/pipelines>.

Expected: a pipeline for that SHA, `pages` job green.

- [ ] **Step 6: Verify the live wiki**

Load <https://2026.igem.wiki/uofglasgow/>.

Expected: the Synwave wiki, not the iGEM starter. Check that CSS and images load
— a broken `baseUrl` shows as an unstyled page with 404s in the console.

If assets 404, confirm `docusaurus.config.ts` still has `url: 'https://2026.igem.wiki'`
and `baseUrl: '/uofglasgow/'`. Do not "fix" this by changing them.

- [ ] **Step 7: Verify the scheduled drift check**

Wait for the next scheduled run (06:17 UTC), or dispatch manually.

Expected: it reports `Already in sync — no push needed.` and exits green.
This confirms the daily key-health canary works before you need to trust it.

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
| ---------------- | ---- |
| GitHub source of truth, PR workflow | 0, 3, 4 |
| Dedicated passphrase-free CI keypair, `MIRROR_SSH_KEY` | 0 |
| Public half on GitLab account, Write usage | 0 |
| Push over `ssh.gitlab.igem.org`, host key pinned | 2 |
| Build gate before mirroring | 2 |
| `push` / `workflow_dispatch` / `schedule` triggers | 2 |
| Scheduled run skips build, self-heals drift, fails on dead key | 2 |
| `fetch-depth: 0` | 2 |
| PR build check | 1 |
| Failure-mode and freeze documentation | 3 |
| Freeze playbook | 3 |
| `CLAUDE.md` guardrail | 3 |
| Cutover sequence and live verification | 4 |
| `.gitlab-ci.yml` and config untouched | Global Constraints |

No gaps.

**Placeholder scan:** The only intentional placeholders are `<owner>/<repo>`,
which cannot be known until the user creates the repository in Task 0, Step 4.
Every other step contains its literal command or file content.

**Type consistency:** The secret is `MIRROR_SSH_KEY` in Task 0 Step 6, Task 2's
`env:` block, and Task 3's documentation. Workflow names `Build check` and
`Mirror main to iGEM GitLab` are used identically in Tasks 1, 2, 3 and 4. The
remote `git@ssh.gitlab.igem.org:2026/uofglasgow.git` is byte-identical
everywhere. The host key literal in Task 2's file matches the one its own Step 3
greps for and the one in Global Constraints.
