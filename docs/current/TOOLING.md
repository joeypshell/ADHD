# Tooling

This app is intentionally light on tooling so it can remain a static GitHub Pages project.

## Local Run

From the repository root:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080
```

Any static server is acceptable. There is no build step.

## Test Runner

Use the PowerShell test wrapper:

```powershell
.\scripts\test.ps1 -Tier quick
.\scripts\test.ps1 -Tier docs
.\scripts\test.ps1 -Tier full
```

The script supports these tiers:

- `quick`: syntax, whitespace, manifest, service worker assets, required DOM IDs, ASCII scan.
- `docs`: quick checks plus required documentation/template checks.
- `visual`: quick checks plus visual-surface static checks.
- `mobile-like`: quick checks plus mobile-critical static checks.
- `full`: docs, visual, and mobile-like checks.

For UI changes, also run an actual browser check at mobile width. The script can catch static regressions, but it cannot prove visual polish.

## Required Local Tools

- Git
- Node.js
- PowerShell 7 or Windows PowerShell

The script accepts explicit tool paths:

```powershell
$env:NODE_EXE = "C:\path\to\node.exe"
$env:GIT_EXE = "C:\path\to\git.exe"
.\scripts\test.ps1 -Tier quick
```

## GitHub Actions

The workflow in `.github/workflows/static-checks.yml` runs the docs tier on every push and pull request.

## Manual Browser QA

Use this checklist for UI changes:

- mobile width around 390px
- desktop width around 1280px
- no horizontal overflow
- Today recommendation renders
- Timeline renders and remains readable
- Today list count matches rows
- Done row button completes an item
- row tap opens details
- Work/Home switch filters visible items
- Add screen shows only the selected Add panel
- service worker cache version was bumped

## Deployment

Publishing is via GitHub Pages from the repository root on `main`.

Live URL:

```text
https://joeypshell.github.io/ADHD/
```

After push, GitHub Pages may lag. Verify live files with cache-busting query strings when needed.

