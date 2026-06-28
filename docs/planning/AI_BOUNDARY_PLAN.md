# AI Boundary Plan

## User Pain

The app can use deterministic rules for Today, but messy projects and brain dumps may eventually benefit from AI-assisted breakdown and prioritization.

## Goals

- Keep the automatic Today loop reliable and explainable.
- Use AI only where it reduces user effort.
- Require confirmation before AI-created tasks or edits are saved.
- Avoid sending sensitive data without clear user action and copy.

## Non-Goals

- Replacing deterministic scoring wholesale.
- Letting AI silently change user data.
- Adding API keys to a public static app.
- Sending all localStorage data to a model by default.

## Deterministic Responsibilities

Keep these rule-based:

- Today candidate inclusion.
- Time-window handling.
- Due/overdue rhythm logic.
- Snooze behavior.
- Work/Home mode filtering.
- Basic row completion and focus-session state.

## AI-Assisted Candidates

AI can help with:

- extracting tasks from messy text
- suggesting tiny starts
- breaking a project into steps
- rewriting an avoided task into a rescue action
- explaining why an item is recommended

## User Confirmation Rule

AI output is always a draft.

Before saving, user must be able to:

- edit title
- edit tiny start
- choose Project / Rhythm / Rescue / Later
- delete suggestions
- confirm save

## Data Boundary

Do not send the entire local state by default.

Smallest useful payloads:

- a pasted brain dump
- one selected item
- user-selected project notes

Sensitive areas:

- medical
- finance
- work
- relationships

The UI should warn when selected text may leave the browser.

## Provider Shape

Static GitHub Pages should not store API keys. Any model-backed version needs one of:

- user-provided key stored locally
- small backend proxy with auth
- sync backend that also brokers AI requests

## Failure Modes

- model suggests bad steps
- model hallucinates deadlines
- model over-prioritizes shame-heavy work
- network or quota failure
- privacy surprise

Fallback must be deterministic rules and editable drafts.

## Smallest Useful AI Experiment

After rule-based brain dump exists:

1. Add "Suggest tiny starts" for selected brain-dump candidates.
2. Send only candidate text, not full app state.
3. Show suggestions as editable drafts.
4. Save only after explicit confirmation.

