# Deal Matching Workspace User Guide

## Overview
The matching workspace helps deal teams define reusable criteria presets, run AI-assisted matching, and action results directly from the UI. This guide walks through the primary workflows.

## Access
- Available to Professional tier and above. Starter users will see an upgrade prompt.
- Navigate to Deals → Matching Workspace. The page opens on the “Criteria” tab by default.

## Managing Criteria Presets
1. **Create a preset**
   - Click **New Criteria**.
   - Provide a name, deal type, at least one industry, and min/max deal size.
   - Optional: select target geographies; add custom filters (label/value pairs) for nuanced matching.
   - Submit to save; the preset becomes available immediately.
2. **Edit an existing preset**
   - In the criteria grid choose **Edit** on the desired card.
   - Adjust details and save. The modal preloads saved values.
3. **Preset behaviour**
   - Presets are surfaced in both tabs. Selecting a preset from the “Matches” tab drives find-matches calls.
   - Custom filters are stored as structured key/value pairs.

## Finding Matches
1. Select the **Matches** tab (requires a deal context).
2. Choose an existing preset via the radio list if not already selected.
3. Click **Find Matches**. The workspace shows an optimistic toast while refreshing.
4. Results display in a card list with score badge, confidence, and summary reason.

## Working Matches
- **View Details** opens the Match Detail modal with breakdown percentages.
- **Save Match** records the match for later review, optimistically updating state.
- **Pass** dismisses the match and closes the modal if open.
- **Request Introduction** launches the introduction modal to send a request.

## Analytics
When matches are available, the analytics panel summarises:
- Success rate (saved or intro requested)
- Score distribution bands
- Recent matches list
- Activity timeline derived from match history

## Feedback & Error Handling
- Toast messages confirm find/save/pass/intro actions or surface failures.
- Skeleton loaders display while criteria or matches load.
- An inline fallback message appears if the matches section encounters an unexpected error.

## Tips
- Maintain at least one preset per deal team to keep analytics populated.
- Custom filters are free-form but should align with backend expectations (e.g., `integration::Salesforce`).
- Intro requests trigger a modal with validation to ensure structured outreach.
