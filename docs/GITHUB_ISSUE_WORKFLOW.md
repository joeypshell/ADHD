# GitHub Issue Workflow

Use issues for non-trivial work, especially anything touching Today scoring, storage, sync, notifications, AI, or major UI layout.

## When To Open An Issue

Open an issue when work has any of these traits:

- more than one file or surface
- unclear product behavior
- data migration risk
- user-data safety risk
- needs manual browser QA
- could be split into multiple commits

Tiny copy/style fixes do not need issues.

## Issue Shape

Each issue should include:

- Problem
- Desired behavior
- Scope
- Out of scope
- Acceptance checks
- Required test tier
- Risk level

## Labels

Suggested labels:

- `area:today`
- `area:add`
- `area:sync`
- `area:notifications`
- `area:ai`
- `area:docs`
- `risk:low`
- `risk:medium`
- `risk:high`
- `needs:browser-qa`
- `needs:planning`

## Closing Rules

Close an issue only when:

- acceptance checks are satisfied
- required test tier passes
- docs are updated if behavior changed
- any follow-up work is captured separately

## Stale Issues

If an issue no longer matches the product direction:

- update it, or
- close it with a short note, or
- move the idea into a planning doc.

