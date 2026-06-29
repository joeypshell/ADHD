# Apple Provider Setup

Goal: make the existing `Continue with Apple` button work through Supabase Auth.

The app-side call already uses Supabase OAuth provider id `apple`. The remaining work is Apple Developer and Supabase dashboard configuration.

## Static App Boundary

Keep these out of the repo and out of `sync-config.js`:

- Apple private `.p8` key
- Apple generated client secret
- Apple Key ID secret material
- Supabase service role key
- database passwords

The static app may only contain the Supabase public URL, public anon key, and app redirect URL.

## Required Values

Collect these before configuring Supabase:

- Apple Team ID
- Apple Services ID, also called the Apple OAuth client id
- Apple Key ID for a Sign in with Apple key
- downloaded `.p8` private key
- generated Apple client secret
- Supabase callback URL, usually `https://<project-ref>.supabase.co/auth/v1/callback`
- app redirect URL: `https://joeypshell.github.io/ADHD/`

## Apple Developer Checklist

1. Confirm the Apple Developer account has access to Certificates, Identifiers & Profiles.
2. Create or select an App ID with Sign in with Apple enabled.
3. Create a Services ID for this web app.
4. Enable Sign in with Apple on the Services ID.
5. Add the Supabase callback URL as the return URL for the Services ID.
6. Create a Sign in with Apple key.
7. Download the `.p8` key once and store it outside the repo.
8. Record the Team ID, Services ID, and Key ID.
9. Generate the Apple client secret from the Team ID, Services ID, Key ID, and `.p8` key.

Apple client secrets can expire. Use a maximum 6-month lifetime and plan to rotate before expiration.

## Supabase Dashboard Checklist

1. Open Supabase Dashboard -> Authentication -> Providers -> Apple.
2. Enable Apple.
3. Enter the Apple Services ID as the client id.
4. Enter the generated Apple client secret.
5. Save the provider settings.
6. Open Authentication -> URL Configuration.
7. Set the site URL to `https://joeypshell.github.io/ADHD/`.
8. Add redirect URLs for:
   - `https://joeypshell.github.io/ADHD/`
   - local test URLs used for QA, such as `http://127.0.0.1:4179/`

## App Smoke Test

1. Open the GitHub Pages app.
2. Open Settings.
3. Press Continue with Apple.
4. Complete Apple sign-in.
5. Confirm the app returns to `https://joeypshell.github.io/ADHD/`.
6. Reopen Settings and confirm the sync panel shows Signed in.
7. Press Sync now.
8. On first sync, choose Upload this browser or Use cloud copy intentionally.

## Common Failures

- `Provider not enabled`: Apple is not enabled in Supabase.
- Redirect mismatch: the Apple Services ID return URL or Supabase redirect allow list is wrong.
- Invalid client secret: the generated Apple client secret is expired or was generated with the wrong Team ID, Services ID, Key ID, or `.p8` key.
- Login returns to localhost: Supabase site URL or app `redirectUrl` is still set to a local URL.
