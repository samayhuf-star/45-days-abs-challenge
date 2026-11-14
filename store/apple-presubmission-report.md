# Apple pre-submission report — 45 Days Abs Challenge

- Date: 14 November 2026
- Branch: `abs45/launch` (working branch `cursor/app-store-version-iap-02ce`)
- Version in `app.json`: 1.0, iOS build number 3, bundle `com.momentum.abs45`
- `eas.json`: `cli.appVersionSource` is `local` (not `remote`). Production `autoIncrement` is true. `submit.production.ios.ascAppId` is 6834676005.
- No EAS build was run. App Store Connect was not opened. The TestFlight build already on the app (build 2) was not installed.
- Web evidence: Expo web, Chrome, 430×932 CSS pixels. Earlier iOS sim: `qa/sim-shots/run-43584645762/summary.md` (maestro exit 0).

**Summary line:** `PASS 51 · FAIL 0 · N/A 30 · NEEDS DEVICE 12 · NEEDS ASC 12 · Decision: DO NOT SUBMIT`

The seven legal-URL failures from the previous pass now return HTTP 200. Nothing in this checklist is FAIL. Do not submit until the NEEDS DEVICE and NEEDS ASC rows are done on a phone and in App Store Connect.

## Legal URLs

B7, B8, D7, F1, H1, H2, and H3 pass. `curl -sI -L` on 14 November 2026 (response `date: Sat, 14 Nov 2026 21:41:38 GMT`, `content-type: text/html`):

- privacy `200 https://samayhuf-star.github.io/45-days-abs-challenge/privacy/`
- terms `200 https://samayhuf-star.github.io/45-days-abs-challenge/terms/`
- support `200 https://samayhuf-star.github.io/45-days-abs-challenge/support/`
- docs privacy `200 https://samayhuf-star.github.io/45-days-abs-challenge/docs/privacy/`
- docs terms `200 https://samayhuf-star.github.io/45-days-abs-challenge/docs/terms/`
- docs support `200 https://samayhuf-star.github.io/45-days-abs-challenge/docs/support/`
- Apple EULA `200 https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`

The root paths return 200, and the `/docs/` paths return 200 as well. The live pages are the Privacy Policy, Terms of Use, and Support HTML from this repo. Support and the policy both include `samayhuf@gmail.com`. GitHub Pages is serving the `gh-pages` branch.

## NEEDS DEVICE

A2, A3, A10, B6, B10, C7, D2, D13, D14, F3, K2, K3.

A physical iPhone on the submission build still has to prove launch, the workout, a sandbox purchase, restore, and iPad compatibility mode. The packaged `PrivacyInfo.xcprivacy` was not extracted from an IPA.

## NEEDS ASC

A1, A9, D3, D4, D8, D9, D11, D12, F2, G4, I3, J1.

The local StoreKit file and the paywall match the required prices. The live App Store Connect products, agreements, privacy labels, age-rating answers, and review-contact phone were not opened.

## Fixes made while scoring

- Paywall (`src/Paywall.tsx`): each plan shows its title, length, and full price before Continue. The renewal paragraph and the Terms, Apple EULA, and Privacy links sit above Continue. The screen scrolls. Restore Purchases and Manage Subscriptions (`https://apps.apple.com/account/subscriptions`) are on the paywall, and Manage Subscriptions is also under About.
- Home screenshot caption no longer says "free" (`store/screenshots/01-home-plan.png`).
- `ios.supportsTablet` is false, so a 13-inch screenshot set is not required for this phone layout.
- The privacy manifest declares UserDefaults reason `CA92.1`, which covers on-device progress in AsyncStorage.
- `expo.version` is `1.0` and `ios.buildNumber` is `3`.
- IAP review screenshots, one per product, are in `store/iap-review/`. They are 1290×2796 captures of this paywall with that product selected.

## 4.3 note

This account also has Momentum for men, Momentum for women, and the earlier CoreForge / men-workout and women-workout trees (see `docs/launch-archive/workout-apps-audit-2026-11-12.md` and the store-assets momentum plan). Those are separate codebases and bundle IDs (`com.samayvashsht.momentummen`, `com.samayvashsht.momentumwomen`). This app is a fixed 45-day core sequence, bundle `com.momentum.abs45`, products `com.momentum.abs45.monthly`, `.yearly`, and `.lifetime`. It is not a title-swap of those apps. The category is crowded, so the review notes include that distinction. A reviewer can still apply 4.3(b) to a common workout category; that risk is not a failed check on this packet.

## Screenshot rule (16 October 2026)

Five iPhone screenshots, all showing the app in use: the plan, today's workout, the rest timer running, a form still open, and the calendar after a day is completed. The rule for five images is at least three in use. Captions do not cover the interface. Files are 1290×2796, PNG color type 2 (no alpha), which Apple lists for iPhone with Dynamic Island (large display). App Store Connect scales that set into the required medium slot when a separate 1206×2622 set is not uploaded.

## Checklist

| ID | Area | Result | Evidence | Notes |
| --- | --- | --- | --- | --- |
| A1 | Binary matches listing | NEEDS ASC | `app.json` version 1.0, `ios.buildNumber` 3, bundle `com.momentum.abs45`. `eas.json` `ascAppId` 6834676005. `cli.appVersionSource` is `local`. | IPA not built here. TestFlight build 2 was not installed, so the uploaded build was not compared. |
| A2 | Clean install does not crash | NEEDS DEVICE | No physical iPhone. | Web cold load reached the home screen. |
| A3 | Core journeys on device | NEEDS DEVICE | Web walk in `store/qa.md`. | Purchase and restore were not completed on a device. |
| A4 | No placeholder UI | PASS | `rg` for coming soon, lorem, TBD, TO ADD in `*.tsx,ts,html,md,json` outside `node_modules` found no hits. Web walk opened home, workout, form, timer, paywall, and About. | |
| A5 | No hidden features | PASS | `App.tsx` has no debug menu or secret gesture. | |
| A6 | Background modes | PASS | `app.json` has no `UIBackgroundModes`. | |
| A7 | IPv6 | N/A | The plan does not call an app server. | StoreKit's own network was not tested on NAT64. |
| A8 | Capture indicator | N/A | No camera, microphone, or screen-recording API. | |
| A9 | Export compliance | NEEDS ASC | `app.json` `ITSAppUsesNonExemptEncryption` is false. | ASC export answers were not opened. |
| A10 | Minimum iOS | NEEDS DEVICE | Expo SDK 58 / RN 0.88. No deployment-target run on a device. | |
| A11 | No "restart your device" copy | PASS | `rg` found no restart-device or disable-Wi-Fi copy. | |
| A12 | Release profile, not a dev client | PASS | `eas.json` production iOS `distribution` is `store`. `developmentClient` is only on the development profile. | The store IPA was not unzipped. |
| B1 | Demo login | N/A | No account system. `store/review-notes.md`. | |
| B2 | Lapsed-subscription demo account | N/A | No app accounts. A sandbox Apple ID is the reviewer's. | |
| B3 | Role credentials | N/A | No roles. | |
| B4 | Backends live | N/A | No API, auth, or CDN. Progress is AsyncStorage. | |
| B5 | Review notes are a script | PASS | `store/review-notes.md` covers the plan, the paywall path, restore, legal links, StoreKit, and what was tested. | |
| B6 | Every IAP works for review | NEEDS DEVICE | Product IDs in `src/products.ts` and `storekit/Abs45.storekit`. | No sandbox purchase. |
| B7 | Metadata URLs work | PASS | `curl -sI -L` on 14 November 2026: privacy, terms, and support each returned HTTP 200. `/docs/privacy/`, `/docs/terms/`, and `/docs/support/` also returned HTTP 200. | See the curl block above. |
| B8 | Support contact reachable | PASS | Support URL HTTP 200. The live page lists samayhuf@gmail.com. | ASC review-contact phone was not checked (I3). |
| B9 | External services named | PASS | Notes name StoreKit as the only external service. | |
| B10 | Devices and OS in notes | NEEDS DEVICE | Notes record web and the earlier simulator run only. | No physical device pass to list. |
| C1 | Metadata matches the binary | PASS | `store/listing.md` matches the web walk: 45-day plan, days 1–7 free, timer, stills, three prices. | |
| C2 | No false claims | PASS | Description, paywall, and notes say it is not medical advice and do not mention AI. Prices match the StoreKit file. | |
| C3 | Premium content is marked | PASS | Description says days 8–45 need Pro. `01-home-plan.png` shows locks from day 8. | |
| C4 | iPhone screenshot size | PASS | All five PNGs are 1290×2796, color type 2, no alpha. Apple lists 1290×2796 for Dynamic Island large display and scales that set into the required medium slot. | [Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/) |
| C5 | iPad 13-inch screenshots | N/A | `app.json` `ios.supportsTablet` is false. | |
| C6 | More than half show the app in use | PASS | 5 of 5: plan, workout list, timer running, form still open, calendar after a completion. The bar for 5 images is 3. | 16 October 2026 screenshot guidance. |
| C7 | Screenshots match TestFlight | NEEDS DEVICE | Shots are from this branch's web UI. | Not compared with TestFlight build 2. |
| C8 | No other-platform imagery | PASS | Screenshots show this UI only. `android` appears in `app.json`, `eas.json`, and the npm script, not in the UI or shots. | |
| C9 | No prices in name, subtitle, keywords, or shots | PASS | Name, subtitle, and keywords have no price. The home caption was changed from "Days 1 to 7 are free" to "Four phases, one day at a time." | Prices stay in the description and on the paywall. |
| C10 | Name length and keywords | PASS | Name is 21 characters. Keywords are 85 characters and do not name the sibling apps. | |
| C11 | 4+ safe assets | PASS | No "for kids" wording. The form shot is the CC0 mannequin still. | |
| C12 | What's New | PASS | `store/listing.md` What's New is the 1.0 first-release line. | |
| C13 | Category | PASS | Health & Fitness. | |
| C14 | Previews | N/A | No preview videos. | |
| C15 | Creative assets | N/A | No promotional assets beyond the icon and screenshots. | |
| C16 | Fictional data in shots | PASS | No real name, email, or photo of a person. | |
| D1 | StoreKit only | PASS | `src/IapProvider.tsx` uses `expo-iap`. No web checkout, license key, or other payment URL. | |
| D2 | Restore works | NEEDS DEVICE | `paywall-restore` is on the paywall before any purchase. | Web tap cannot restore: `Cannot find native module 'ExpoIap'`. |
| D3 | Subscription length and value | NEEDS ASC | Local file: monthly P1M and yearly P1Y, both with a P1W free intro. Lifetime is a non-consumable. | ASC durations were not opened. |
| D4 | One subscription group | NEEDS ASC | `storekit/Abs45.storekit` has one group, "Pro", with monthly and yearly. Lifetime is outside the group. | ASC group and upgrade path were not opened. |
| D5 | Schedule 2 disclosures before purchase | PASS | `src/Paywall.tsx` shows title, length (1 month, 1 year, or does not renew), the full price, what Pro unlocks, and the renewal paragraph above Continue. | |
| D6 | Trial length and post-trial price | PASS | Plan rows say "7-day free trial, then $2.99 billed every month" and the yearly equivalent. Lifetime says no trial. | |
| D7 | Live Privacy and Terms from the paywall | PASS | Links are above Continue and again in About. Privacy and Terms both return HTTP 200. | |
| D8 | Metadata points at Privacy and Terms | NEEDS ASC | Description in `store/listing.md` includes Privacy, Terms, and the standard EULA URL. | The ASC license field was not opened. |
| D9 | Prices match ASC and the listing | NEEDS ASC | Paywall fallbacks, `FALLBACK_PRICES`, and the StoreKit numbers are $2.99, $19.99, and $39.99. | ASC prices were not opened. |
| D10 | No unfinished paywall benefits | PASS | The benefit is days 8–45, which `src/workouts.ts` defines. `assert-workouts` passed. | |
| D11 | IAPs in the version submission | NEEDS ASC | Not opened. | |
| D12 | Paid Applications Agreement | NEEDS ASC | Not opened. | |
| D13 | Sandbox purchase unlocks | NEEDS DEVICE | Not run. | |
| D14 | Manage or cancel in the app | NEEDS DEVICE | Paywall and About link to `https://apps.apple.com/account/subscriptions`. | Not opened on a subscribed device. |
| D15 | Prior paid users kept access | N/A | No earlier paid product. | |
| D16 | Notes explain the paywall | PASS | Notes say tap Pro or any locked day. No demo login exists. | |
| E1 | Lasting utility without paying | PASS | Days 1–7 include workouts, a timer, form stills, and the calendar. Used on web. | |
| E2 | Not a client template | PASS | One developer-owned app, one bundle. | |
| E3 | Not a duplicate bundle | PASS | Bundle `com.momentum.abs45`. Sibling bundles in the 12 Nov audit are different. | |
| E4 | Not a bare saturated clone | PASS | Fixed 45-day phased plan, not a single timer. Differentiation is in the review notes. | Residual 4.3(b) risk remains because workout apps are common. |
| E5 | Sibling apps are distinct | PASS | Different code, bundles, and product IDs from Momentum men, Momentum women, and CoreForge, per `docs/launch-archive/workout-apps-audit-2026-11-12.md`. | Sibling binaries were not reinstalled this session. |
| E6 | No impersonation | PASS | Descriptive name. Icon is this repo's `assets/icon.png`. | No trademark search in ASC. |
| E7 | No forced ratings | PASS | No rating or cross-download gate in `App.tsx`. | |
| E8 | Works without another app | PASS | First screen is the plan. | |
| F1 | Live privacy policy is complete | PASS | Privacy URL HTTP 200. The live page covers on-device progress, no account, Apple payments, no ads, Reset Progress, and samayhuf@gmail.com. | |
| F2 | Nutrition labels | NEEDS ASC | `package.json` has no analytics or ads SDK. | ASC App Privacy was not walked. |
| F3 | Privacy manifest reasons | NEEDS DEVICE | `app.json` now declares `NSPrivacyAccessedAPICategoryUserDefaults` / `CA92.1`. | The IPA was not unzipped, so the packaged `PrivacyInfo.xcprivacy` was not confirmed. |
| F4 | Listed third-party SDK manifests | N/A | Dependencies are Expo, expo-iap, AsyncStorage, and React Native. None are on Apple's commonly required binary-SDK list. | |
| F5 | Purpose strings | PASS | No camera, photo, mic, location, tracking, contacts, Bluetooth, or HealthKit usage strings in `app.json`. | |
| F6 | Permissions in context | N/A | No permission prompts. | |
| F7 | In-app account deletion | N/A | No accounts. Reset Progress clears local workout data. | |
| F8 | Usable without sign-in | PASS | Day 1 is available immediately. | |
| F9 | Sign in with Apple | N/A | No third-party login. | |
| F10 | ATT | N/A | No tracking SDK and no ATT prompt. | |
| F11 | Tracking manifest flags | PASS | The manifest does not declare tracking domains. No tracking SDK is linked. | |
| F12 | Third-party AI consent | N/A | No network model. Form stills are local files. | |
| F13 | Health data not used for ads | N/A | No ads and no HealthKit. Progress stays on device. | |
| F14 | Health data not in iCloud | N/A | No iCloud entitlement. | |
| F15 | Name and email optional | N/A | The app does not ask for a name or email. | |
| F16 | Location | N/A | No location API. | |
| G1 | No diagnosis or cure claims | PASS | Listing, paywall, About, and terms avoid diagnose, treat, and cure. `scripts/assert-workouts.ts` also rejects those words. | |
| G2 | Measurement accuracy | N/A | No sensor measurements. | |
| G3 | Consult a professional | PASS | About, nutrition note, and `docs/terms/index.html` say to consult a professional and to stop if you feel pain. | |
| G4 | Age-rating answers | NEEDS ASC | Suggested 4+. The questionnaire was not re-answered. | |
| G5 | Notes do not over-claim | PASS | Notes call it a training plan and say it is not medical advice. | |
| H1 | Privacy URL 200 | PASS | HTTP 200 `https://samayhuf-star.github.io/45-days-abs-challenge/privacy/`. `/docs/privacy/` also HTTP 200. | |
| H2 | Support URL 200 | PASS | HTTP 200 `https://samayhuf-star.github.io/45-days-abs-challenge/support/`. The live page has samayhuf@gmail.com. `/docs/support/` also HTTP 200. | |
| H3 | Terms URL 200 | PASS | Custom terms URL HTTP 200. `/docs/terms/` also HTTP 200. Apple EULA URL HTTP 200. | |
| H4 | Legal links before purchase | PASS | Terms, Apple EULA, and Privacy are on the paywall above Continue, and again in About. | The custom pages return HTTP 200 (H1 and H3). |
| H5 | No placeholder URLs | PASS | Listing and notes have no lorem, TO ADD, or example.com. | |
| I1 | Extra demo materials | N/A | No OTP, QR, or sample file. | |
| I2 | Hardware video | N/A | No accessory. | |
| I3 | Review contact monitored | NEEDS ASC | Legal pages use samayhuf@gmail.com. The ASC phone was redacted in the archive and was not confirmed. | |
| J1 | Age questionnaire | NEEDS ASC | Not submitted. | |
| J2 | No child-audience metadata | PASS | No "for kids" or "for children" in the listing or UI. | |
| J3 | Kids Category rules | N/A | Not a Kids Category app. | |
| J4 | UGC and generated-content moderation | N/A | No user content and no chat. | |
| J5 | Age-gated chat | N/A | No chat. | |
| K1 | iPad layout and 13-inch shots | N/A | `supportsTablet` is false. | |
| K2 | iPad compatibility mode | NEEDS DEVICE | iPhone-only apps can still be installed on iPad. Not run. | |
| K3 | Small and large phones | NEEDS DEVICE | Web was one 430×932 viewport. No physical SE or Pro Max. | |
| K4 | Missing hardware | N/A | No camera or Bluetooth path. | |
| L1 | Asset licenses | PASS | `assets/CREDITS.md` and `store/screenshots/CREDITS.md`. The form screenshot uses the CC0 Dead Bug still. | |
| L2 | Audio licenses | N/A | No music or sound effects. | |
| L3 | No Apple impersonation | PASS | Not an Apple-style icon or store. UI uses ordinary Unicode symbols. | |
| L4 | Third-party trademarks | N/A | No celebrity or sports marks. CC BY-SA credit for plank and side plank is the About `CREDIT_LINE`. | |
| L5 | No real personal data in shots | PASS | Same as C16. | |

Decision: **DO NOT SUBMIT** until the NEEDS DEVICE and NEEDS ASC rows have been done on a phone and in App Store Connect. B7, B8, D7, F1, H1, H2, and H3 now pass: the privacy, terms, and support URLs return HTTP 200.
