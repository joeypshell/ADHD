# Supabase Smoke Test

Live Supabase verification is pending real project credentials in `sync-config.js` and provider setup in Supabase.

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

1. Press Continue with Google.
2. Complete the provider login.
3. Confirm Settings shows Signed in.
4. Press Sync now and verify the same first-sync choices.

## Apple

1. Press Continue with Apple.
2. Complete the provider login.
3. Confirm Settings shows Signed in.
4. Press Sync now and verify the same first-sync choices.

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

## Logout

1. Press Log out.
2. Confirm local task data remains visible.
3. Confirm Sync status no longer shows Signed in.
