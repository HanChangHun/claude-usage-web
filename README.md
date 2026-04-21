# Claude Usage Web

A single-file static website that shows your live **Claude.ai quota** — Session (5h), Weekly, Sonnet/Opus Weekly, and any extra-usage balance.

Mirrors the sidebar widget that claude.ai renders natively, but as a standalone page you can pin / bookmark / embed.

![screenshot placeholder](favicon.svg)

## How it works

Claude.ai has an internal endpoint:

```
GET https://claude.ai/api/organizations/<org_id>/usage
```

It returns the same data that powers the sidebar widget. Only a logged-in browser tab on `claude.ai` can call it (same-origin + session cookie). A plain website hosted elsewhere **cannot** reach it due to CORS.

So this project uses a **one-shot snippet bridge** you run on claude.ai yourself:

1. You open claude.ai (already logged in) and press F12 to open DevTools.
2. You paste a short snippet (copied from this page) into the Console and press Enter.
3. The snippet fetches the usage JSON with your existing session cookie, then opens this page with the data base64-encoded in the URL hash.
4. This page decodes the hash, renders the widget, and caches the snapshot in `localStorage` so you see the last known values even without re-running.

No backend. No extension. No API key. Your claude.ai session cookie never leaves `claude.ai`.

> **Why not a bookmarklet?** claude.ai sets a strict Content Security Policy that blocks `javascript:` bookmarks — clicking one redirects to `about:blank#blocked`. The Console-paste method sidesteps CSP because DevTools is privileged.

## Use

1. Open the hosted page (or `index.html` locally).
2. Copy the snippet with the **Copy** button.
3. Open [claude.ai](https://claude.ai) in another tab, logged in. Press <kbd>F12</kbd> (or <kbd>Cmd</kbd>+<kbd>⌥</kbd>+<kbd>I</kbd> on Mac) → **Console** tab.
4. Paste the snippet, press <kbd>Enter</kbd>. Chrome may warn about pasting — type the requested confirmation or use the "allow pasting" button.
5. A tab opens/refocuses on this page with your current quota.
6. Re-run the snippet (↑ arrow in the console) whenever you want a fresh snapshot.

## What gets displayed

| Field | Source |
|-------|--------|
| Session (5h) | `five_hour.utilization` + `resets_at` |
| Weekly | `seven_day.utilization` + `resets_at` |
| Sonnet Weekly | `seven_day_sonnet.utilization` (Max plan only) |
| Opus Weekly | `seven_day_opus.utilization` (Max plan only) |
| Extra usage | `extra_usage.used_credits / monthly_limit` (if enabled) |

Countdowns refresh locally every 30 s. The LIVE/STALE badge flips after 10 min without a refresh.

## Privacy

- The bookmarklet runs only when you click it, only on the tab you click it in.
- The only network call it makes is the same call claude.ai already makes for you: `claude.ai/api/organizations/<org>/usage`, with your existing logged-in session.
- The JSON response is base64-encoded into this page's URL hash — the URL never leaves your browser tab history.
- A copy is cached under `localStorage` key `claude-usage-web:v2`.
- Clear data anytime: DevTools → Application → Local Storage → delete the key.

## Limitations

- Manual refresh (click the bookmark again). No background polling — a website can't do that without an extension or a proxy.
- Anthropic could change the endpoint shape without notice. If the page shows "No limits reported," the response likely shifted.
- Works on desktop browsers where bookmarks bars exist. Mobile Safari / iOS Chrome don't support bookmarklet drag; you'd need to paste the `javascript:` URL as a bookmark manually.

## Files

- `index.html` — the whole app (styles, script, bookmarklet generator)
- `favicon.svg` — bar-chart icon
- `LICENSE` — MIT

## License

MIT © 2026 Han Changhun
