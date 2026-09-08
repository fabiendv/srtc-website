# TODOS

Deferred work captured during `/plan-eng-review` (2026-09-08, branch `tennis-club-website-vercel`).
These are post-v0 follow-ups, not v0 build tasks. v0 build tasks live in the design doc's Implementation Tasks.

## TODO-1 — Contact-form delivery monitoring
- **What:** Alerting on Resend errors/bounces and quota usage, a periodic end-to-end delivery check, and a named owner for credential rotation.
- **Why:** The contact form's one silent failure mode. `POST /api/contact` can return 200 while email lands in spam, DNS auth drifts (expired DKIM), or the 100/day quota is exhausted — the club receives nothing and no one notices for weeks.
- **Pros:** Turns a silent failure into a detected one; protects the club's only inbound channel in v0.
- **Cons:** Adds a monitor/cron and a small ops surface; overkill while traffic is tiny.
- **Context:** v0 ships with a launch smoke test (preview + prod) and relies on the Resend dashboard. That catches problems at deploy time but not ongoing drift. Start with a scheduled synthetic submission + Resend webhook for bounces.
- **Depends on:** v0 launch (domain + Resend sending subdomain verified).

## TODO-2 — Operating model / succession
- **What:** A documented process for keeping content current (hours, bureau/officers, expired news), renewing the domain and dependencies, and handing the site over when Fabien is unavailable.
- **Why:** Main long-term feasibility risk for a real association's site — infra and content quietly rot without an owner.
- **Pros:** The site survives a change of volunteer; renewals don't lapse.
- **Cons:** Governance work, not code; needs the association's buy-in.
- **Context:** Tied to open questions 8 and 9 (Vercel plan eligibility, infra ownership by the association vs Fabien's personal accounts). Resolve ownership first, then document the runbook.
- **Depends on:** Open questions 8, 9.

## TODO-3 — Phase-2 Content Security Policy
- **What:** A CSP once the Metadot widget origins are known.
- **Why:** v0 ships with no CSP so the first widget install isn't blocked by headers. That is deferred security work, not "readiness" — the site should not stay CSP-less once origins are known.
- **Pros:** Closes the XSS/third-party surface the widget opens.
- **Cons:** Must be tuned to the widget's real origins or it breaks the widget.
- **Context:** Design doc "Widget readiness" reserves this. The scoped `<ThirdPartyWidgets/>` component makes the origin set small and knowable.
- **Depends on:** Phase 2 (Metadot ticket widget install).
