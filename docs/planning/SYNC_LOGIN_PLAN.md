# Sync And Login Plan

## User Pain

The app is localStorage-only. That makes it fragile across phone, desktop, browser clearing, device loss, and reinstalling.

## Goals

- Let one user access the same task data across devices.
- Preserve offline-first use as much as possible.
- Keep export/import as an escape hatch.
- Avoid silent data loss during migration from localStorage.

## Non-Goals

- Team sharing.
- Public profiles.
- Complex collaboration.
- Replacing the app's local-first feel with a server-required planner.

## Option A: Supabase

Pros:

- Email/password or OAuth auth.
- Hosted Postgres with row-level security.
- Can store structured item records.
- Good migration path if the app later needs server-side AI.

Cons:

- Requires backend schema and security rules.
- More moving parts than a static-only app.
- Needs careful conflict handling.

Good fit if the app becomes a real multi-device product.

## Option B: Firebase

Pros:

- Mature auth and realtime sync.
- Good offline support in client SDKs.
- Simple document storage model.

Cons:

- Vendor-specific data model.
- Security rules need care.
- Can become hard to reason about if records are overly nested.

Good fit if fast cross-device sync is more important than relational querying.

## Option C: Encrypted GitHub Gist

Pros:

- Fits a personal/dev-oriented workflow.
- User already uses GitHub.
- Could store one encrypted JSON snapshot.

Cons:

- OAuth setup and token scope risk.
- Conflict handling is awkward.
- Poor fit for non-technical users.

Good fit only if this remains a personal tool.

## Chosen First Sync MVP

Use Supabase first. Keep the runtime app static on GitHub Pages, keep `localStorage` as the offline cache, and store one user-scoped JSON state document in Supabase for the first version.

## Current Status As Of 2026-06-29

Implemented in the app:

- public Supabase config loading through `sync-config.js`
- email magic-link login button
- Google and Apple provider login buttons that call Supabase provider ids
- logout
- manual first-sync choice and Sync now fallback
- automatic sync after a first sync baseline exists
- one-document `user_state` upload/download
- first-sync choice dialog
- simple conflict choice
- local cooldown guard after email sends and rate-limit errors

Known setup blockers:

- Supabase's built-in email sender has a low hourly quota, so repeated magic-link testing can hit `email rate limit exceeded`.
- Google and Apple providers must be enabled in the Supabase dashboard before those buttons can succeed.
- If magic links remain the fallback, configure custom SMTP or a Send Email hook before raising email-send rate limits.
- Redirect URLs must include the GitHub Pages URL and whatever local test port is being used.
- Do not add Keycloak for the personal version unless this becomes an organization/enterprise product.

Next auth decision:

1. Enable Google first because it avoids the paid Apple Developer dependency.
2. Keep email magic link as fallback, but add custom SMTP before serious repeated testing.
3. Add Apple later if another provider is still useful and Apple Developer access is available.
4. Re-run the Google smoke test in `docs/planning/SUPABASE_SMOKE_TEST.md`.

Why one JSON document first:

- It matches the current normalized state shape.
- It avoids premature per-item conflict complexity.
- It is easier to migrate safely from existing browser data.
- It gives cross-device backup and restore quickly.
- It can later be split into per-item records without changing the user-facing model.

MVP behavior:

- login screen only when sync is enabled
- localStorage remains the offline cache and source for offline use
- Supabase stores one user-scoped state document
- manual "Sync now" still exists for reassurance
- auto-sync runs after local edits, session restore, tab visibility, online events, and a gentle interval
- import/export remains available
- no private API keys in GitHub Pages

## Data Migration

1. Detect existing localStorage data.
2. User signs in.
3. Show a migration choice:
   - upload this browser's data
   - replace this browser with cloud data
   - export backup first
4. Never overwrite local data without confirmation.

First-login screen copy should make the choices concrete:

- "Upload this browser" means local data becomes the cloud copy.
- "Use cloud copy" means this browser is replaced by the existing cloud copy.
- "Stay local" means login is cancelled and nothing changes.
- "Export backup first" downloads JSON before either destructive path.

## Supabase Data Shape

Initial table: `user_state`

Columns:

- `user_id uuid primary key references auth.users(id) on delete cascade`
- `state_json jsonb not null`
- `state_version integer not null`
- `client_updated_at timestamptz not null`
- `server_updated_at timestamptz not null default now()`
- `last_sync_client_id text`

Initial `state_json` is the current normalized app state:

- `version`
- `createdAt`
- `lastReviewed`
- `lastBackupAt`
- `mode`
- `filter`
- `todayPlan`
- `focusSession`
- `dailyCheckin`
- `alerts`
- `items`
- `recurring`

Row-level security:

- users can select only their own `user_id`
- users can insert only their own `user_id`
- users can update only their own `user_id`
- users can delete only their own `user_id`

The runnable SQL and verification queries live in `docs/planning/SUPABASE_SETUP.md`.

## Static Config Boundary

Allowed in GitHub Pages:

- Supabase project URL
- Supabase public anon key
- feature flag for sync enabled/disabled

Never store in GitHub Pages:

- Supabase service role key
- OpenAI/API provider keys
- private JWT secrets
- database admin credentials

If AI or server-side migration is added later, use a backend or Supabase Edge Function with server-side secrets. The static app should never call paid model APIs directly with a secret embedded in JavaScript.

## First Runtime Screens

Settings:

- "Sync: Off / Signed in / Needs attention"
- Login button
- Logout button
- Sync now button
- Last synced timestamp
- Local-only warning when signed out

First login migration:

- show local item count and cloud item count
- offer Upload this browser, Use cloud copy, Stay local, Export backup first
- require confirmation before replacing local data

Manual sync:

1. Normalize current local state.
2. Fetch cloud state for current user.
3. If no cloud state exists, upload local state.
4. If cloud exists and local has no newer changes, download cloud.
5. If both changed since last sync, show conflict choice.
6. Save successful result to localStorage.
7. Update last-sync metadata.

Automatic sync:

- does not run before the first sync choice
- debounces local edits so every checkbox click does not immediately hit Supabase
- downloads cloud changes when another device changed and this browser did not
- uploads local changes when this browser changed and the cloud did not
- opens the conflict choice if both sides changed
- leaves the manual Sync now button available as an explicit fallback

## Conflict Handling

Smallest useful version:

- store `lastSyncedAt` and `lastSyncedServerUpdatedAt` locally
- compare local `state.lastSaved` or equivalent to last synced time
- compare cloud `server_updated_at` to last synced server time
- if both changed, show a conflict screen
- first conflict options are "Keep this browser" or "Use cloud copy"

Later:

- per-item sync records
- tombstones for deletes
- merge history

## Privacy

The app may contain medical, work, finance, and personal data. Sync must document:

- what is stored remotely
- whether it is encrypted
- who can access it
- how to export and delete it

Current implementation:

- Supabase stores one `state_json` document per signed-in user.
- The app does not add end-to-end encryption before sending data to Supabase.
- Row-level security is required so each user can access only their own row.
- Export/import remains the local backup and recovery path.

## Failure Modes

- offline use
- auth token expiration
- cloud write failure
- conflicting edits across devices
- accidental login to wrong account
- corrupted cloud payload

Each failure must leave local data usable.

## Smallest Useful Implementation

Before writing sync code:

- improve backup confidence UI
- create Supabase project
- add `user_state` table and RLS policies
- add public config file or constants for project URL and anon key
- add login/logout UI inside settings
- add first-login migration screen
- add manual Sync now
- add sync status and failure feedback

## Implementation Checklist Issues

Completed:

- Add public `sync-config.js` with sync disabled by default.
- Add Settings sync status panel with Login, Logout, and Sync now controls.
- Add `state.sync` metadata for client id, login display, session checks, and sync timestamps.
- Add `user_state` schema SQL and RLS docs.
- Add Supabase browser client loader.
- Wire email magic-link login/logout to Supabase Auth.
- Add first-login migration dialog.
- Add manual Sync now with one-document upload/download.
- Add auto-sync after the first successful manual upload/download baseline.
- Add simple conflict choice for cloud/local divergence.

Remaining implementation:

1. Test against a real Supabase project.
2. Add stronger visible conflict details before choosing a winner.
3. Add a signed-in "last cloud change" status line.
4. Watch real cross-device sync behavior and decide whether per-item merge is worth the complexity.
5. Add a deletion/export account data path.
