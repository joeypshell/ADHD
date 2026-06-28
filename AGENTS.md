# Agent Operating Guide

This file is the working agreement for AI-assisted development in this repository. It is adapted from the OceanGame agent workflow, but scoped to this app: a static, mobile-first ADHD command center hosted on GitHub Pages.

## Project North Star

The app should answer one question quickly:

> What do I do now?

Keep the main flow automatic. The user should be able to add projects, rhythms, and messy captures in batches or random bursts, then later open the app and see a trustworthy Today dashboard without daily planning.

The app is not a generic calendar clone. It should combine visual day structure with decision support:

- One recommended next action.
- A complete Today list.
- A visual Now / Next / Later / Missed timeline.
- Tiny starts and visible reasons.
- Work/Home modes with separate task surfaces.
- Recurring rhythms that come back without shame.

## ADHD UX Guardrails

- Do not require daily planning or daily setup.
- Do not hide must-do items just because a time window passed.
- Avoid shame framing, streak pressure, or punitive copy.
- Keep the primary screen visually calm. Add controls only when they reduce friction.
- Prefer concrete action labels over abstract planning labels.
- If a feature collects state, it should change recommendations or reduce effort.
- Do not add medical advice. This is an executive-function support tool, not treatment guidance.

## Repository Shape

This is a static app with no build step.

- `index.html`: app structure and dialogs.
- `styles.css`: responsive UI, visual language, mode themes.
- `app.js`: state model, migrations, scoring, rendering, interactions.
- `sw.js`: service worker cache list and version.
- `manifest.webmanifest`: installable app metadata.
- `docs/current/`: current architecture and tooling references.
- `docs/planning/`: active or proposed work that is not yet fully implemented.
- `docs/archive/`: old plans that should not steer current work.
- `.github/`: issue templates, PR template, and CI checks.
- `scripts/test.ps1`: local verification entry point.

## Source Of Truth Rules

- Update `docs/current/ARCHITECTURE.md` when behavior, data model, storage, scoring, or major UI surfaces change.
- Update `docs/current/TOOLING.md` when commands, test tiers, deployment, or CI changes.
- Put future proposals in `docs/planning/` until they become true.
- Move stale plans to `docs/archive/` instead of leaving them in active planning.
- Keep README user-facing and concise. Put agent/development details in `AGENTS.md` and `docs/`.

## Implementation Rules

- Follow existing vanilla HTML/CSS/JS patterns unless a larger refactor is explicitly planned.
- Keep GitHub Pages compatibility. Do not introduce a build requirement casually.
- Preserve localStorage data through migrations. Existing user data matters.
- Bump the service worker cache version in `sw.js` whenever shipped assets change.
- Treat `app.js` as legacy-monolithic for now. Small helper extraction is fine; broad rearchitecture needs a planning doc first.
- Keep UI changes mobile-first and verify small widths.
- Prefer deterministic rules before AI. AI can be planned later behind a clear boundary.
- Do not add sync/login/backend code without a plan for privacy, auth, migration, and failure modes.

## Git Workflow

- Work on focused commits.
- Do not rewrite or discard user changes.
- Before commit, run at least the quick test tier.
- Commit messages should describe user-visible or workflow-visible change.
- Push to `main` only when the user asks or when the current task is clearly intended to publish the GitHub Pages app.

## Verification Tiers

Use `scripts/test.ps1` as the entry point.

```powershell
.\scripts\test.ps1 -Tier quick
.\scripts\test.ps1 -Tier docs
.\scripts\test.ps1 -Tier full
```

Minimum before most commits:

- `node --check app.js`
- `git diff --check`
- static smoke checks for required files and IDs
- ASCII scan for source/docs

For UI changes, also do a browser check at mobile width:

- no horizontal overflow
- Today recommendation renders
- Today timeline renders
- Today list renders
- mode switch still filters
- queue/detail/Done controls still work when touched

## Issue Workflow

Use GitHub issues for non-trivial work. A good issue should include:

- user problem
- desired behavior
- acceptance checks
- affected files or surfaces
- risk level
- test tier required

If an issue becomes outdated, update it or close it. Do not let stale issues outrank the current product direction.

## Planning Policy

Use a planning doc when work changes core behavior, storage, sync, notifications, AI, auth, data migration, or app architecture.

Planning docs should answer:

- What user pain does this solve?
- What is intentionally out of scope?
- What data changes are needed?
- What can fail?
- What is the smallest useful version?
- How will it be tested?

## Known Product Priorities

Near-term:

- Make the Today dashboard trusted and scannable.
- Make focus/Doing mode more central.
- Add a small energy/brain-state check-in that changes scoring.
- Upgrade quick capture into rule-based brain-dump triage.
- Improve backup confidence before attempting cloud sync.

Later:

- Private sync/login.
- Voice-to-text capture.
- AI-assisted breakdown and triage.
- Browser notifications for due-now rhythms and focus sessions.
- Provider-backed storage, only after privacy and data ownership are planned.

