# Life Command Center

A static, mobile-first command center for ADHD-style executive function support. It is built for GitHub Pages and runs without a build step.

The primary screen is a Now cockpit: it recommends one next action using local priority rules for due dates, consequences, importance, dread, waiting checkbacks, stale items, and snoozes. Projects, map, wizard, and review are secondary views over the same data.

The Wizard tab guides task setup with three paths:

- Add a thing
- Break down a project
- Rescue something scary

Each path asks small questions, allows "I don't know," and creates a structured item with a tiny start and checkable steps.

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

The app stores data in the browser with `localStorage`. Use the `DL` button to export a JSON backup and the `UP` button to import one.

GitHub Pages is static, so it cannot save changes back to GitHub by itself. A future sync version would need a backend, a private database, or an authenticated storage provider.
