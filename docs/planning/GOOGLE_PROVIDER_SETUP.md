# Google Provider Setup

Goal: make the existing `Continue with Google` button work through Supabase Auth.

The app-side call already uses Supabase OAuth provider id `google`. The remaining work is Google Cloud and Supabase dashboard configuration.

## Static App Boundary

Keep these out of the repo and out of `sync-config.js`:

- Google OAuth Client Secret
- Supabase service role key
- database passwords
- private API keys

The static app may only contain the Supabase public URL, public anon key, and app redirect URL.

## Required Values

Collect these before configuring Supabase:

- Google OAuth Client ID
- Google OAuth Client Secret
- Supabase callback URL, usually `https://<project-ref>.supabase.co/auth/v1/callback`
- app redirect URL: `https://joeypshell.github.io/ADHD/`
- authorized domain: `joeypshell.github.io`

For this project, the Supabase callback URL should be:

```text
https://hmkzkbkugpzvzwvjuind.supabase.co/auth/v1/callback
```

## Google Cloud Checklist

1. Open Google Cloud Console.
2. Create or select a Google Cloud project.
3. Open APIs & Services -> OAuth consent screen.
4. Configure the consent screen.
5. Add `joeypshell.github.io` as an authorized domain if Google asks for one.
6. If the app remains in Testing mode, add the Google account you will use as a test user.
7. Open APIs & Services -> Credentials.
8. Create OAuth client ID.
9. Choose Web application.
10. Add the Supabase callback URL as an Authorized redirect URI.
11. Save the OAuth client.
12. Copy the Client ID and Client Secret.

## Supabase Dashboard Checklist

1. Open Supabase Dashboard -> Authentication -> Providers -> Google.
2. Enable Google.
3. Paste the Google Client ID.
4. Paste the Google Client Secret.
5. Save the provider settings.
6. Open Authentication -> URL Configuration.
7. Set the site URL to `https://joeypshell.github.io/ADHD/`.
8. Add redirect URLs for:
   - `https://joeypshell.github.io/ADHD/`
   - local test URLs used for QA, such as `http://127.0.0.1:4179/`

## App Smoke Test

1. Open the GitHub Pages app.
2. Open Settings.
3. Press Continue with Google.
4. Complete Google sign-in.
5. Confirm the app returns to `https://joeypshell.github.io/ADHD/`.
6. Reopen Settings and confirm the sync panel shows Signed in.
7. Press Sync now.
8. On first sync, choose Upload this browser or Use cloud copy intentionally.

## Common Failures

- `Provider not enabled`: Google is not enabled in Supabase.
- Redirect mismatch: the Google OAuth authorized redirect URI or Supabase redirect allow list is wrong.
- Access blocked or app not verified: the OAuth consent screen is incomplete, the app is still in Testing mode without your account as a test user, or the authorized domain is missing.
- Login returns to localhost: Supabase site URL or app `redirectUrl` is still set to a local URL.
