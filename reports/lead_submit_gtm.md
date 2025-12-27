# lead_submit SPA tracking setup

## Frontend behavior
- The pre-approval form at `/analise` only pushes `lead_submit` to `window.dataLayer` after a successful API response.
- A session flag (`window.__leadSent`) prevents duplicate pushes from retries or double submissions within the same page session.

## Google Tag Manager configuration
1. **Create Trigger (Custom Event)**
   - Go to **Triggers → New**.
   - Name: **CE - lead_submit**.
   - Type: **Custom Event**.
   - Event name: `lead_submit`.
   - Fire: **All Custom Events**.
   - Save.

2. **Create GA4 Event tag**
   - Go to **Tags → New**.
   - Name: **GA4 - lead_submit**.
   - Type: **Google Analytics: GA4 Event**.
   - Configuration Tag: select the existing **GA4 - Config** (Measurement ID `G-ZMT8T2H7FQ`, trigger All Pages). Create it if missing.
   - Event name: `lead_submit`.
   - (Optional) Event parameters:
     - `page_path` = `{{Page Path}}`.
   - Trigger: **CE - lead_submit**.
   - Save.

3. **Publish**
   - Menu: **Submit → Publish**.
   - Version name: `v1 - lead_submit SPA`.
   - Notes: `Adicionado evento lead_submit para conversão SPA via dataLayer`.

## GA4 follow-up
1. **Confirm reception**
   - GA4 → **DebugView**.
   - Submit the form in GTM preview/debug mode.
   - Check that `lead_submit` events appear.

2. **Mark as Key event**
   - GA4 → **Admin → Events**.
   - Mark `lead_submit` as **Key event**.

## Google Ads import
1. GA Ads → **Tools → Conversions → Import → Google Analytics (GA4)**.
2. Select `lead_submit` (Key event) and set it as **Primary** conversion.
3. After enough traffic, Ads can optimize for this conversion.

## Validation checklist
- [ ] GTM snippet installed (head + body noscript).
- [ ] Old GA4 `gtag` removed to avoid duplicates.
- [ ] `dataLayer.push({ event: 'lead_submit' })` fires only after successful submission.
- [ ] Custom Event trigger configured in GTM.
- [ ] GA4 Event tag created and published.
- [ ] `lead_submit` appears in GA4 DebugView.
- [ ] `lead_submit` marked as Key event.
- [ ] `lead_submit` imported into Google Ads as Primary conversion.
