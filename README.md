# Life Command Center

A static, mobile-first command center for ADHD-style executive function support. It is built for GitHub Pages and runs without a build step.

The primary screen is an automatic Today queue: it recommends one clear action, shows the next few items that matter now, and keeps rhythm/list/map/review views secondary over the same local data. The user should not have to plan the day manually.

The app has two lanes:

- Projects: finite things with an endpoint, steps, due/review dates, and stuck handling.
- Rhythms: recurring life rails like cleaning, gas, working out, weekly reset, and annual/admin maintenance.

The Rhythms tab shows recurring loops grouped by due now, coming up, and all rhythms. Missed rhythms stay visible until marked done, and due rhythms flow into Today automatically.

Today is generated from recurring items, due/overdue work, review checkbacks, explicit "now" items, and time-window matches. Capture and Wizard entries can be added in batches or whenever motivation appears; they do not all become same-day tasks just because they were created today.

The Add tab starts with three paths: Quick capture, Templates, and Wizard. The Wizard guides setup with three paths:

- Project
- Rhythm
- Rescue something scary

Each path asks small questions, allows "I don't know," and creates a structured item with a tiny start. Rhythm setup includes cadence, trigger, and minimum version.

## Agent Workflow

Development guidance lives in [`AGENTS.md`](AGENTS.md). Current facts live in `docs/current/`; future plans live in `docs/planning/`.

Run the local checks with:

```powershell
.\scripts\test.ps1 -Tier quick
```

For documentation/workflow changes:

```powershell
.\scripts\test.ps1 -Tier docs
```

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

GitHub Pages is static, so it cannot save changes back to GitHub by itself. The current app includes a disabled-by-default Supabase sync scaffold in `sync-config.js` plus a Settings sync panel, but cross-device login and cloud writes are not active yet.

To prepare Supabase sync, create a Supabase project, run the SQL and RLS setup in `docs/planning/SUPABASE_SETUP.md`, and add only the public project URL and public anon key to `sync-config.js`. Never add the service role key, database password, API provider keys, or other private secrets to this static app.
