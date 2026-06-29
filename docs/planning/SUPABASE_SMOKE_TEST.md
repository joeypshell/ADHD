# Supabase Smoke Test

Live Supabase verification is pending provider setup and a cooldown window after email rate-limit testing.

Current known state as of 2026-06-29:

- `sync-config.js` contains public Supabase project configuration for the GitHub Pages app.
- Email magic link worked on mobile, then repeated testing hit Supabase's email quota.
- Google and Apple providers were not yet enabled in the Supabase dashboard.
- The next auth pass should test Google first, then email magic link with custom SMTP or after the quota resets.

Run these checks after:

- `sync-config.js` has `enabled: true`
- Supabase URL and public anon key are present
- `user_state` SQL and RLS policies are installed
- redirect URLs include the GitHub Pages URL and the local test URL
- Google and Apple providers are enabled if those login paths are being tested

## Local Browser QA

1. Open the app with sync disabled.
2. Confirm Settings shows Sync Off.
3. Confirm Send login link, Continue with Google, Continue with Apple, and Sync now show guarded feedback.
4. Confirm Today stays uncluttered and has no horizontal overflow on mobile.

## Magic Link

1. Enable sync config.
2. Enter email and send login link.
3. Open the link in the same browser.
4. Confirm Settings shows Signed in.
5. Press Sync now.
6. Choose Upload this browser.
7. Confirm `user_state` has one row for the signed-in user.

## Google

Before testing, complete `docs/planning/GOOGLE_PROVIDER_SETUP.md`.

1. Press Continue with Google.
2. Complete the provider login.
3. Confirm the browser returns to the configured app redirect URL.
4. Confirm Settings shows Signed in.
5. Press Sync now and verify the same first-sync choices.
6. If Google fails before showing the Google login screen, re-check the Supabase Google provider is enabled.
7. If Google signs in but does not return to the app, re-check the Google OAuth authorized redirect URI and Supabase redirect allow list.

## Apple

Before testing, complete `docs/planning/APPLE_PROVIDER_SETUP.md`.

1. Press Continue with Apple.
2. Complete the provider login.
3. Confirm the browser returns to the configured app redirect URL.
4. Confirm Settings shows Signed in.
5. Press Sync now and verify the same first-sync choices.
6. If Apple fails before showing the Apple login screen, re-check the Supabase Apple provider is enabled.
7. If Apple signs in but does not return to the app, re-check the Apple Services ID return URL and Supabase redirect allow list.

## Second Browser Or Device

1. Open the app in another browser or phone.
2. Sign in with the same account.
3. Press Sync now.
4. Choose Use cloud copy.
5. Confirm the Today queue and Lists match the uploaded browser.

## Conflict Check

1. Sync browser A.
2. Change an item in browser A without syncing.
3. Change an item in browser B and sync.
4. Return to browser A and press Sync now.
5. Confirm the app shows a conflict choice instead of silently overwriting.

## Auto-Sync Check

1. Complete the first sync choice on both phone and computer.
2. On phone, add or check off a small test item.
3. Wait a few seconds, then open or foreground the app on computer.
4. Confirm the change appears without pressing Sync now.
5. On computer, change the same test item.
6. Wait a few seconds, then foreground the app on phone.
7. Confirm the change appears without pressing Sync now.
8. Put one browser offline, change an item, then return online.
9. Confirm sync resumes automatically or opens the conflict dialog if both sides changed.

## Logout

1. Press Log out.
2. Confirm local task data remains visible.
3. Confirm Sync status no longer shows Signed in.
