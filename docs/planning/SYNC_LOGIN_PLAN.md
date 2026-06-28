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

## Recommended First Sync MVP

Use Supabase or Firebase, but keep the data payload close to the current normalized JSON shape.

MVP:

- login screen only when sync is enabled
- localStorage remains the offline cache
- cloud stores one encrypted or user-scoped state document
- manual "sync now" first, then auto-sync later
- import/export remains available

## Data Migration

1. Detect existing localStorage data.
2. User signs in.
3. Show a migration choice:
   - upload this browser's data
   - replace this browser with cloud data
   - export backup first
4. Never overwrite local data without confirmation.

## Conflict Handling

Smallest useful version:

- store `updatedAt` at the state level and item level
- if cloud and local both changed, show a conflict screen
- prefer item-level latest update only after user confirmation

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
- define provider
- define schema
- define migration copy and screens

