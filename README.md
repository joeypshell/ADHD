# Life Command Center

A static, mobile-first command center for ADHD-style executive function support. It is built for GitHub Pages and runs without a build step.

The primary screen is a Today cockpit: it recommends one clear action, shows a short priority queue, and keeps rhythm/list/map/review views secondary over the same local data.

The app has two lanes:

- Projects: finite things with an endpoint, steps, due/review dates, and stuck handling.
- Rhythms: recurring life rails like cleaning, gas, working out, weekly reset, and annual/admin maintenance.

The Rhythms tab shows recurring loops grouped by due now, coming up, and all rhythms. Missed rhythms stay visible until marked done.

Daily Launch gives the day a shape:

- Anchor task
- Backup task
- Minimum viable day

Shutdown captures what changed, shows open-loop counts, and marks the daily rhythm complete.

The Add tab starts with three paths: Quick capture, Templates, and Wizard. The Wizard guides setup with three paths:

- Project
- Rhythm
- Rescue something scary

Each path asks small questions, allows "I don't know," and creates a structured item with a tiny start. Rhythm setup includes cadence, trigger, and minimum version.

## Run Locally

From this folder:

```powershell
python -m http.server 8080
```

Open `http://localhost:8080`.

## Publish On GitHub Pages

1. Create a GitHub repository.
2. Upload these files to the repository root.
3. In GitHub, open `Settings` -> `Pages`.
4. Set the source to the main branch and root folder.
5. Open the GitHub Pages URL from your phone.

## Data

The app stores data in the browser with `localStorage`. Use the `...` backup menu to export or import a JSON backup.

GitHub Pages is static, so it cannot save changes back to GitHub by itself. A future sync version would need a backend, a private database, or an authenticated storage provider.
