---
name: merge-renovate-prs
description: >-
  Triage and merge this repo's open Renovate PRs (npm dependency bumps for the
  Next.js site) safely, in bulk. Use when the user asks to "go through the PRs",
  "merge the PRs", "clear the Renovate backlog", "update dependencies", or
  similar. Handles the pnpm-lock.yaml pile-up that makes every PR conflict with
  every other one, duplicate major/minor PRs, formatter bumps that reformat
  source files, majors that break the eslint-config-next plugin chain, and
  GitHub Actions bumps on the Pages publish path that no CI check exercises.
---

# Merge Renovate / dependency PRs

This is a static Next.js 16 site (`will-white/willwhite.dev`) deployed to GitHub
Pages. Most open PRs are Renovate npm bumps, but Renovate bumps the **GitHub
Actions** too — they use plain `@vN` tags — and Dependabot separately bumps the
devcontainer image. The npm bumps and the Actions bumps need different
verification (§4e).

**Merging to `main` deploys.** `deploy.yml` runs on every push to `main` and
publishes to Pages. There is no release gate, no tag, no manual approval. This
is the opposite of a repo where main is a staging area — a bad merge is live in
about two minutes.

The good news: **CI verifies nearly everything that deploy does.** `ci.yml` runs
`prettier --check`, `pnpm lint`, and `pnpm build` — the same build `deploy.yml`
runs. What CI never executes is the Pages publish path itself
(`configure-pages`, `cache`, `upload-pages-artifact`, `deploy-pages`), because
`deploy.yml` has no `pull_request` trigger. That is the whole of the
unverifiable surface, and only Actions PRs touch it.

A green PR check is therefore a strong signal but not a sufficient one: it says
nothing about the deploy, and — because of the lockfile pile-up (§6) — it does
not even guarantee `main` stays green. Check `main` after every merge.

## 0. Preflight

- **`gh` is not installed in Linux. Use `gh.exe`** (Windows GitHub CLI at
  `/mnt/c/Program Files/GitHub CLI/gh.exe`). It is **not** on `PATH` here —
  invoke it by full path, quoted:
  `G="/mnt/c/Program Files/GitHub CLI/gh.exe"`.
- **Always pass `--repo will-white/willwhite.dev`.** `gh.exe` shells out to
  Windows `git`, which rejects the WSL path with _"detected dubious ownership …
  //wsl.localhost/…"_. Do not fix this with a global `safe.directory`; just pass
  `--repo`.
- Confirm auth: `"$G" api user -q .login` → `will-white`.
- `main` is **unprotected** (`branches/main/protection` → 404), so red checks do
  not block merging. Do not treat that as permission — merging deploys.
- Merge settings: squash, rebase, **and merge commits** are all enabled;
  branches auto-delete. History has been linear so far — **use `--squash`**.
- **`pnpm` and `node` work locally and the npm registry is reachable.** This is
  the single biggest difference from other repos: you can fully reproduce CI
  before merging anything. Use that. `pnpm install`, `pnpm exec prettier
--check .`, `pnpm lint`, and `pnpm build` all run in well under a minute.
- The repo is on **pnpm 11** (`packageManager` in `package.json`), and pnpm
  self-manages to that version, so a bare `pnpm` picks it up regardless of what
  is installed globally — confirm with `pnpm --version`. pnpm 11 enforces
  supply-chain policies at install time that pnpm 10 did not; see §4d before
  regenerating any lockfile.
- `git fetch origin` first — Renovate merges land without touching the local
  clone.

## 1. Survey every open PR

```bash
R=will-white/willwhite.dev; G="/mnt/c/Program Files/GitHub CLI/gh.exe"
"$G" pr list --repo $R --state open --limit 100 \
  --json number,title,author,mergeable,mergeStateStatus,isDraft \
  --jq '.[] | "\(.number)\t\(.author.login)\t\(.mergeable)\t\(.mergeStateStatus)\t\(.title)"' | sort -n
```

Skip the file-conflict map — you already know the answer. **Every single PR
touches `pnpm-lock.yaml`**, and roughly half also touch `package.json`. There is
no such thing as a "unique-file" PR here (§5).

Split the list by shape, because it determines how you verify:

- **Lockfile-only PRs** (`pnpm-lock.yaml` alone) — the existing `^` range
  already permits the new version; Renovate just re-resolved. Reproduce with
  `pnpm update`.
- **package.json PRs** — a pinned dep (`next`, `react`, `react-dom`) or a range
  bump (`eslint`, `prettier-plugin-tailwindcss`). Reproduce by editing
  `package.json` then `pnpm install --no-frozen-lockfile`.

## 2. Reproduce the whole backlog locally, at once, first

Do this **before** touching a single PR. One local run tells you more than ten
CI runs, and it catches the cross-PR interactions that no individual PR's CI can
see (§4).

```bash
git fetch origin && git checkout -b chore/verify-renovate-batch origin/main
# apply every package.json bump the open PRs request, e.g.:
sed -i 's/"next": "16.1.6"/"next": "16.3.0"/' package.json
pnpm install --no-frozen-lockfile   # package.json bumps
pnpm update                         # lockfile-only bumps: re-resolve within ranges
pnpm exec prettier --check .
pnpm lint
pnpm build
```

`pnpm list --depth 0` confirms each dep actually landed on the version its PR
claims — `pnpm install` alone will **not** move an in-range dep, which is why
`pnpm update` is a separate step.

Throw the branch away afterwards (`git checkout -- . && git checkout main &&
git branch -D chore/verify-renovate-batch`); its value is the verdict, not the
lockfile. The real lockfiles ship in the PRs.

## 3. Diagnose red CI before assuming the PR broke it

```bash
"$G" pr checks <pr> --repo $R
"$G" run view <run-id> --repo $R --log-failed | tail -40
```

One check gates a PR: **`lint-and-build`** (install → `prettier --check` →
`eslint` → `next build`). A failure in **~15s is the format check**, not the
build — the build alone takes longer than that.

Two causes of a repo-wide red, and they look identical from the checks list:

- **Stale base.** A branch cut before a CI fix does not have the fix. Precedent:
  `.prettierignore` (excluding `pnpm-lock.yaml`, which pnpm generates in a style
  Prettier rejects) landed in `35a196a` on 2026-08-12, and every open PR at that
  moment was older and failed the format check on the lockfile it had just
  regenerated. Fixed by `update-branch` / rebase, **not** by editing anything.
- **A formatter bump reformatting source.** This one `update-branch` cannot fix
  (§4a).

Both were live at once on 2026-08-12: all ten open PRs were stale, and #92 was
_additionally_ reformatting a file. Fixing the first does not reveal the second
until CI re-runs, so re-read the log after every rebase rather than assuming one
cause.

Always check whether `main` itself is green before blaming the PRs:

```bash
"$G" run list --repo $R --branch main --limit 6 \
  --json workflowName,conclusion,headSha --jq '.[] | "\(.conclusion)\t\(.workflowName)\t\(.headSha[0:7])"'
```

## 4. The failure modes specific to this repo

### a. A `prettier` bump reformats source files

Prettier's output changes between minors. A lockfile-only Prettier bump can
therefore turn a currently-green source file red, and **rebasing will not help**
— the PR's own new Prettier is what rejects the file.

Precedent: prettier `3.6.2 → 3.9.6` (#92) dropped the redundant parentheses
around the JSX argument in `app/opengraph-image.tsx`.

The fix has an ordering trap: **the reformat must land in the same commit as the
Prettier bump.** Committing the new-style formatting to `main` first would break
`main`, because the old Prettier still on `main` wants the old style back. So:

```bash
git checkout -B <renovate-branch> origin/<renovate-branch>
git merge origin/main            # or rebase
pnpm install --no-frozen-lockfile
pnpm exec prettier --write .     # reformat with the PR's own Prettier
git commit -am 'style: reformat for prettier <new-version>'
git push --force-with-lease
```

Read the reformat diff before committing — it should be pure whitespace and
punctuation. Anything else means the plugin chain changed behaviour, not style.

### b. Peer-dependency floors that make PR order load-bearing

A range bump can require a _different_ package's new version, turning two
independent-looking PRs into an ordered pair.

Precedent: `prettier-plugin-tailwindcss ^0.7 → ^0.8` (#110) requires
`prettier >= 3.7`, supplied only by the separate prettier PR (#92). Merged
alone, #110 resolves against the lockfile's prettier 3.6.2 and every format
check explodes with `TypeError: a.startsWith is not a function` from
`plugins/babel.mjs`.

Catch these in the §2 batch run — a lone PR's CI can be green while the pair is
broken, and vice versa. When you find one, merge the provider first and say so
in the report.

### c. Majors blocked by the `eslint-config-next` plugin chain

This is the single most common reason a major cannot land here, and it catches
bumps that look unrelated to linting.

`eslint-config-next` loads `typescript-eslint` unconditionally, so **anything
`typescript-eslint` or its sibling plugins refuse to run with takes `pnpm lint`
— and therefore the whole CI job — down with it**. `pnpm build` passing means
nothing: CI runs lint first. The advertised
`peerDependencies: { eslint: ">=9.0.0" }` is a lie by omission; the plugins
underneath have much narrower ranges. Never trust that peer range.

Confirmed members of this family (as of 2026-08-12):

- **eslint `^9 → ^10`** (#101) — blocked by `eslint-plugin-react@7.37.5`, which
  caps at `^9.7` and throws
  `TypeError: … contextOrFilename.getFilename is not a function`. Merge the
  same-cycle eslint 9.x minor instead (§5 duplicates).
- **typescript `^5 → ^7`** (#118) — blocked by `typescript-eslint@8.67.0`, which
  declares `typescript@">=4.8.4 <6.1.0"` and hard-throws
  `Error: typescript-eslint does not support TS 7.0.` `tsc` and `next build`
  both compile the site fine; only lint fails.

The triage for any suspected member is `pnpm lint` after installing the bump —
30 seconds, and it is the only check that tells the truth. **Leave these PRs
open** rather than closing them, so Renovate keeps them current, and comment
with the exact error so the next pass does not re-derive it.

**Name the blocking package, not just the failing bump, and re-test on each
pass.** The chain moves underneath these PRs: eslint 10 was originally blocked
by _both_ `typescript-eslint` and `eslint-plugin-react`, and landing
`eslint-config-next` 16.3.0 (which pulls `typescript-eslint` 8.67.0, peer range
widened to include `^10.0.0`) silently removed one of the two. A stale verdict
here is worse than no verdict — it hides a bump that has become mergeable.

**Do not try to unblock these by combining them into one PR.** Distinguish the
two shapes:

- A **floor** — "package A needs a newer B" — is an ordering problem, and
  combining or sequencing is exactly the fix (§4b, the prettier ↔
  prettier-plugin-tailwindcss pair).
- A **ceiling** — an upstream package declaring an upper bound and hard-throwing
  above it — cannot be fixed by combining. Both blockers above are ceilings
  sitting at their own latest published release, so there is no version to
  upgrade _to_. Bundling #101 with #118 is strictly worse: both failures are
  then present and lint dies on the TS 7 one first.

The check that tells them apart: look up the blocking package's latest version
(`pnpm view <pkg> version peerDependencies`). If a release already exists whose
range admits the bump, it is a floor — go find which PR carries it. If the
newest release still excludes the bump, it is a ceiling — hold and wait upstream.

### d. `pnpm` majors can change install _policy_, not just behaviour

Bumping the `packageManager` field is not a routine bump; the new pnpm may
reject a lockfile the old one accepted.

Precedent: pnpm 11 (#120 → landed as #123). A bare `packageManager` bump could
not pass CI; it took **two** policy fixes plus a Renovate change, and the second
policy only surfaced after the first was solved. Expect to iterate.

**Policy 1 — `minimumReleaseAge` defaults to 24 hours.** `--frozen-lockfile`
refuses any lockfile entry published inside that window:

```
✗ Lockfile failed supply-chain policy check (576 entries in 7.5s)
[ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION] 3 lockfile entries failed verification
```

Do **not** wait for the packages to age out, and do not disable the policy. The
fix is to rebuild the lockfile under the new pnpm, which resolves to aged
versions instead:

```bash
CI=true npx --yes pnpm@<new> clean --lockfile   # removes node_modules + lockfile
CI=true npx --yes pnpm@<new> install
```

`--no-frozen-lockfile` is **not** enough — it still validates the existing
lockfile before re-resolving, so it fails with the same error. Only a fresh
resolution works. In practice this moved 12 transitive pins and **zero** direct
dependency versions, so the diff is large but inert; confirm that with
`pnpm list --depth 0` before trusting it.

Then stop Renovate from re-introducing the violation: add
`"minimumReleaseAge": "3 days"` to `renovate.json`. Without it, future lockfile
PRs fail CI for reasons unrelated to the bump they carry. This is a companion to
the pnpm major, not an alternative to fixing the lockfile — it governs only
future PRs.

**Policy 2 — an undecided build script became fatal.** pnpm 10 warned; pnpm 11
exits 1:

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: unrs-resolver@1.12.2
```

`unrs-resolver` arrives via `eslint-config-next` and has always installed
unbuilt here (it falls back to its wasm binding), so the decision to keep it
unbuilt is recorded in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  unrs-resolver: false
```

**The setting is `allowBuilds` in pnpm 11.** The pnpm 10 spelling
`ignoredBuiltDependencies` is still accepted by `pnpm config get` — it will read
back correctly — but has no effect on the install, which makes it look like the
config file is not being read at all. Do not chase that; `pnpm approve-builds
'!<pkg>'` writes the correct modern key for you.

Test a pnpm major without installing it globally:

```bash
sed -i 's/"packageManager": "pnpm@<old>"/"packageManager": "pnpm@<new>"/' package.json
CI=true npx --yes pnpm@<new-version> install --frozen-lockfile
```

`CI=true` is required — otherwise pnpm aborts with
`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`. Note that `npx pnpm@N` alone does
**not** test version N: pnpm self-manages to whatever `packageManager` says, so
the field must be edited first.

### e. GitHub Actions bumps: which ones CI can and cannot see

Renovate does bump the Actions here (they use plain `@vN` tags). What matters is
**which workflow the action appears in**:

- `ci.yml` — `checkout`, `pnpm/action-setup`, `setup-node`. Fully verified by
  the PR's own check.
- `deploy.yml` only — `configure-pages`, `cache`, `upload-pages-artifact`,
  `deploy-pages`. **`deploy.yml` runs only on push to `main`**, so no PR check
  ever executes these. The verification is to merge and watch the deploy; the
  blast radius is a failed deploy, not a broken site, and it is revertible.

**`upload-pages-artifact` and `deploy-pages` must be bumped in the same
commit.** `upload-pages-artifact@v5` switches its internal upload to
`actions/upload-artifact@v7`; merging the two Renovate PRs separately produces
one deploy where a v5 writer and a v4 reader disagree about the artifact. Close
both and open a single combined PR (precedent: #122 superseding #115 and #117).

The Pages-action majors so far (`cache` v6, `configure-pages` v6,
`deploy-pages` v5, `upload-pages-artifact` v5, `checkout` v7, `setup-node` v7,
`pnpm/action-setup` v6) were all Node-24 runtime / ESM migrations with unchanged
input schemas — read the changelog for input changes, and if there are none, the
merge-and-watch loop is enough.

## 5. Classify

- **True duplicates** — Renovate opens a minor _and_ a major for the same
  package (e.g. `eslint to v9.39.5` #99 alongside `eslint to v10` #101). Keep
  the highest version that §2 and §4 clear, **close the other** with a comment
  naming the PR that superseded it and why.
- **Monorepo PRs are already grouped.** `renovate/react-monorepo` moves `react`
  and `react-dom` together; `renovate/nextjs-monorepo` moves `next` and
  `eslint-config-next`; `renovate/tailwindcss-monorepo` moves `tailwindcss`,
  `@tailwindcss/postcss`, and `@tailwindcss/typography`. Do not split these.
- **Pinned vs ranged.** `next`, `react`, and `react-dom` are pinned exactly in
  `package.json`; everything else uses `^`. A pinned-dep PR is the only way
  those move, so it is never "just a lockfile refresh".
- **Non-Renovate PRs** — review individually, never batch. Dependabot separately
  handles `.devcontainer/`.

`renovate.json` is `config:recommended` plus
`"minimumReleaseAge": "3 days"`, added alongside the pnpm 11 bump so Renovate
stops proposing releases that pnpm's own supply-chain policy would reject at
install time (§4d). If you ever see Renovate open a PR for a same-day release,
that setting has been lost — restore it rather than working around the resulting
CI failure.

## 6. Merge

**The pile-up is `pnpm-lock.yaml`, and it is total.** Every PR edits it, so the
moment one merges, every other one is behind. GitHub's 3-way merge sometimes
handles it — lockfile entries are alphabetical, so distant packages merge
cleanly — but the `importers` block at the top lists every direct dep in one
alphabetical run, which puts `eslint` / `eslint-config-next` /
`eslint-config-prettier` and `prettier` / `prettier-plugin-tailwindcss` within
conflict range of each other.

Merge one at a time, cheapest-first, re-checking after each:

```bash
"$G" pr merge <pr> --repo $R --squash
"$G" pr view <pr> --repo $R --json state,mergedAt   # verify; gh is quiet on success
```

1. Merge any **ordering provider** first (§4b) — e.g. prettier before
   prettier-plugin-tailwindcss.
2. After each merge, re-survey (§1). PRs still `MERGEABLE` need only
   `"$G" pr update-branch <pr> --repo $R`; wait for green, then merge.
3. For PRs that flip to `CONFLICTING`, do **not** hand-resolve the lockfile.
   Regenerate it:

   ```bash
   git fetch origin
   git checkout -B <branch> origin/<branch>
   git merge origin/main            # take main's lockfile on conflict:
   git checkout --theirs pnpm-lock.yaml 2>/dev/null || git checkout origin/main -- pnpm-lock.yaml
   pnpm install --no-frozen-lockfile   # re-derives it from the merged package.json
   git add pnpm-lock.yaml && git commit --no-edit
   git push --force-with-lease
   ```

   A hand-merged pnpm lockfile will fail `--frozen-lockfile` in CI even when it
   looks fine. **GitHub's own 3-way merge counts as hand-merging** — a PR whose
   lockfile GitHub auto-merged can be green on its branch and still break
   `main`. Precedent: #108 merged clean and green, then `main` failed with
   `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY  Broken lockfile: no entry for
'@types/node@24.10.13'` because #104 had moved that version underneath it.
   Prefer a regenerated lockfile even when GitHub says `MERGEABLE`, and always
   check `main` after each merge (§7) rather than trusting the PR's own check.

   **`pnpm update <pkg>` also rewrites the range in `package.json`** (e.g.
   `^8.5.3` → `^8.5.26`), which Renovate's lockfile-only PRs do not do. Do not
   fix that with a bare `git checkout -- package.json`: the lockfile has already
   recorded the new specifier, and CI fails with
   `specifiers in the lockfile don't match specifiers in package.json`. Revert
   `package.json` **then re-run `pnpm install --no-frozen-lockfile`** so the
   lockfile's `specifier:` line is rewritten to match, keeping the new
   `version:`.

4. **Renovate rebases branches while you work.** It may fix a conflict before
   you do, which makes `git push --force-with-lease` fail — harmless if its head
   is already green, since the PR merges anyway. Re-survey (§1) before doing
   local work on any branch; several PRs in a backlog will have fixed
   themselves. Expect **new PRs to appear mid-run** too (this is how the Actions
   majors showed up); re-list open PRs before declaring the backlog clear.
5. **Always let CI go green before merging**, even on a bump you verified in §2.
   Merging deploys, and the §2 run validated the _combined_ state, not each
   intermediate one.

### Gotchas

- Shell is **bash**; `gh.exe` needs its full quoted path (`"$G"`).
- Never `git push origin main` — branch, PR, merge, even though main is
  unprotected.
- If Renovate **auto-closes** a PR whose branch conflicted (`state: CLOSED,
mergedAt: null`) and the bump is still wanted, either wait for Renovate to
  reopen it on its next run or apply the bump by hand in a fresh branch.
- Committing anything under `.claude/` means Prettier will check it — run
  `pnpm exec prettier --write .claude` before pushing, or CI goes red on a
  Markdown file.

## 7. Verify

```bash
"$G" run list --repo $R --branch main --limit 6 \
  --json workflowName,conclusion,headSha \
  --jq '.[] | "\(.conclusion)\t\(.workflowName)\t\(.headSha[0:7])"'
```

Both **`CI`** and **`Deploy Next.js site to Pages`** must be green on the final
`main` SHA. The deploy is the part CI never rehearsed — confirm it, and confirm
the live site still renders, before calling the backlog clear.

Check this **after every merge**, not just at the end. A green PR check does not
imply a green `main` (§6.3), and because `deploy.yml` fires on each push, a
broken `main` is a skipped deploy. Waiting for the run to settle on the new head
also avoids a trap: `gh pr checks` reports the _previous_ push's completed run
for a few seconds after a force-push, which reads as a stale failure. Match on
the head SHA instead:

```bash
HEAD=$("$G" pr view <pr> --repo $R --json headRefOid --jq .headRefOid)
"$G" run list --repo $R --commit "$HEAD" --limit 1 \
  --json status,conclusion --jq '.[0] | "\(.status) \(.conclusion)"'
```

## 8. Report

Summarize: merged count, duplicates closed (with which version won and why),
PRs that needed an extra commit (§4a) or a lockfile regeneration (§6.3), any
bump **held** with the specific error that justifies holding it and the
condition for revisiting, and the final `main` CI + deploy status. Offer to
re-test held majors on the next pass.
