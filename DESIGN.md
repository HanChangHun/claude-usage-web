# Widget design contract

Preserve the existing compact Windows widget and vanilla JavaScript components.
The source of truth is `app/src/style.css`: warm dark backgrounds, Inter body
text, Fraunces branding, orange usage bars, amber warning and red critical states.
Reuse `row`, `row-head`, `label`, `pct`, `reset`, `bar`, `fill`, `toggle`, and
`settings-btn`. Percentages represent used quota; remaining quota is explicit text.

Codex is an optional section in the scrollable usage area, enabled in Settings.
Its refresh, errors and timestamp are independent of Claude. Default is off;
the choice persists locally. Disabling clears displayed data and stops polling.
Only the main Codex seven-day window is shown; omit Spark and session limits.
Preserve the existing Claude API-driven rows: the user's current account reports
Session (5h), Weekly (all models), and Fable weekly. Do not inject legacy Opus or
Sonnet rows. These three plus one compact Codex weekly row must fit at 440x420
with settings closed. Codex has no redundant section heading above its row.
Absent windows are unavailable,
never zero. A failure clears old rows and offers retry and login instructions.

Use existing color tokens and 1rem horizontal padding. Section labels use the
existing 0.88rem row typography, helper text 0.74rem, status text 0.78rem.
The section uses the existing border-soft separator. Do not introduce a new theme.
The app remains 440x420, supports 300x320 and scrolls when content exceeds space.
Usage and settings share one scroll container beneath the fixed header. Opening
settings scrolls them into view; no nested scrollbars or squeezed usage pane.
Buttons and toggles remain keyboard accessible;
status changes use an aria-live region. Respect reduced motion.

Accepted existing scope: Claude rendering, fonts, update flow and authentication
remain as implemented. This feature does not redesign the application or add a
web dashboard. Validate native WebView2 behavior and small-window overflow.
