# Voice Capture Plan

## User Pain

Typing every task is friction, especially on a phone. Voice capture could make quick capture and brain-dump triage easier.

## Goals

- Capture spoken thoughts quickly.
- Show transcript before creating tasks.
- Keep user confirmation before saving anything.
- Provide a fallback when speech recognition is unavailable.

## Non-Goals

- Medical dictation.
- Always-listening behavior.
- Sending audio to a server in the first version.
- AI extraction in the first version.

## Browser Speech API Option

Use the Web Speech API where available.

Pros:

- No custom backend.
- Natural fit for static GitHub Pages.
- Can be implemented as progressive enhancement.

Cons:

- Browser support varies.
- Mobile behavior may differ by OS/browser.
- Some implementations may route speech through browser/vendor services.

## Provider API Option

Use a speech-to-text provider through a backend.

Pros:

- More consistent results.
- Can pair with AI extraction.

Cons:

- Requires backend.
- Audio leaves the browser.
- Cost, auth, privacy, and retention need planning.

## Recommended First Version

Use browser speech recognition only as an optional enhancement.

Flow:

1. User taps a microphone button in Add or Today quick capture.
2. Browser asks for microphone permission.
3. Transcript appears in an editable text area.
4. User edits transcript.
5. User sends it to Quick Capture or Brain Dump triage.

## Fallback

If unsupported:

- hide or disable microphone button
- show "Voice capture is not supported in this browser"
- keep text capture fully available

## Privacy Copy

The UI must explain:

- microphone is only used after tapping the button
- transcript is editable before saving
- browser speech support may use browser/vendor services

## Acceptance Requirements

- No microphone prompt on page load.
- No item created without confirmation.
- Transcript can be edited or discarded.
- Unsupported browsers do not break Add or Today.

