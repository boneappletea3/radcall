# Fellowship Case Log Dashboard - Implementation Plan

## Overview
Add a fellowship case log dashboard to RadCall as **two new HTML pages** linked from the main navigation. The pages will use RadCall's dark theme and include all 798 cases from the reference data.

## Architecture Decision: Separate HTML Files
The case log has its own sidebar/filter layout and 798 embedded cases (~500KB of data). Embedding this in the 4600-line main HTML would be unwieldy. Instead:
- `case-log.html` — Case browser with filtering, search, and detail drawer
- `procedure-averages.html` — 3-column procedure averages dashboard
- Both pages link to each other and back to RadCall

## Files to Create/Modify

### 1. `case-log.html` (new)
- Adapted from `IR_Case_Reference_v2.html`
- **Dark theme** using RadCall's color variables (`--bg: #0b0f14`, etc.)
- Top nav with logo, links (Case Log / Procedure Averages / Back to RadCall), search
- Left sidebar: filter by Procedure Type, ACGME Category, Hospital
- Main area: sortable case cards with technique previews
- Right drawer: full case detail (technique, implants, tips, complications, stats)
- All 798 cases embedded as JSON
- localStorage for any user-added cases (future extensibility)

### 2. `procedure-averages.html` (new)
- Adapted from `IR_Procedure_Averages.html`
- **Dark theme** matching RadCall
- 3-column layout: Categories | Procedure List | Detail Panel
- Detail panel shows: anesthesia breakdown, tools/equipment bars, techniques, tips
- Pre-computed averages data embedded as JSON

### 3. `rad-call-reference(3).html` (modify)
- Add a new nav item "Case Log" in the sidebar under a new "Fellowship" nav section
- This nav item will use `window.location.href='case-log.html'` instead of `showSection()`

### 4. `server.py` (no changes needed)
- Already serves all static files from the project root

## Dark Theme Adaptation
Map the light theme variables to RadCall's dark palette:
| Light (reference) | Dark (RadCall) |
|---|---|
| `--cream: #faf8f4` | `--bg: #0b0f14` |
| `--warm-white: #fff` | `--bg2: #111620` |
| `--slate: #1e2530` | `--text: #e2e8f0` |
| `--border: #e4e1da` | `border: #1e2737` |
| `--teal: #0d7377` | `--teal: #14b8a6` (keep RadCall's teal) |

## Implementation Steps

1. **Create `case-log.html`** — Full case browser page with dark theme, all data, filtering, search, drawer
2. **Create `procedure-averages.html`** — Procedure averages page with dark theme, 3-column layout
3. **Add nav link in main RadCall HTML** — New "Fellowship" section with "Case Log" link
4. **Test and verify** — Preview both pages, check navigation between all three pages
