# Life Command Center

A static, mobile-first command center for ADHD-style executive function support. It is built for GitHub Pages and runs without a build step.

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

The app stores data in the browser with `localStorage`. Use the down-arrow button to export a JSON snapshot and the up-arrow button to import one.

GitHub Pages is static, so it cannot save changes back to GitHub by itself. A future sync version would need a backend, a private database, or an authenticated storage provider.
