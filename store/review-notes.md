# App Review notes — Guideline 2.1

These notes match the `abs45/launch` source reviewed on 14 November 2026. They were not pasted into App Store Connect. TestFlight build 1.0.0 (2) was not installed from this environment.

## What the app does

45 Days Abs Challenge is a self-guided core training plan. The home screen shows a streak, four phases, a 45-day calendar, and the current day's exercises. Days 1 to 7 are free. Days 8 to 45 require Pro. Each exercise can open a still illustration of the form. A rest timer counts down between sets. Marking the day complete updates the streak and the calendar. Progress stays on the device.

The app is not medical advice and does not promise a particular result.

## Sign-in

No login is required. There is no account, no demo password, and no guest button. The app opens on the home screen. There is no onboarding step and no reminder setting.

## How to reach the main features

1. Launch the app. The home screen is the plan, the streak, and the calendar. Days 8 to 45 show a lock until Pro is unlocked.
2. Scroll to Today's Workout. Form opens a still for that exercise. Start rest begins the countdown. Stop ends it. Mark Complete records the current day and moves to the next one.
3. Tap Pro in the header, or tap any locked day, to open the Pro screen.
4. The Pro screen lists Monthly (1 month, $2.99 after a 7-day free trial), Yearly (1 year, $19.99 after a 7-day free trial), and Lifetime ($39.99 once, no trial). The renewal terms, Terms of Use, Apple's standard EULA, and Privacy Policy are on that screen above Continue. Restore Purchases and Manage Subscriptions are below Continue. Manage Subscriptions opens Apple's subscription page.
5. About, at the bottom of the home scroll, repeats Privacy Policy, Terms of Use, Support, and Manage Subscriptions.

## Subscriptions and Restore

Product IDs in the app and in `storekit/Abs45.storekit`:

- `com.momentum.abs45.monthly` — $2.99 per month, 7-day free trial, auto-renewing
- `com.momentum.abs45.yearly` — $19.99 per year, 7-day free trial, auto-renewing
- `com.momentum.abs45.lifetime` — $39.99 once, no trial

Restore Purchases is on the Pro screen. It asks StoreKit for the current account's purchases and unlocks Pro on this device when one of those products is active. A purchase or restore needs the App Store. On the web build used for this check, StoreKit is not present, so Continue reports that the store is not available and no charge is made.

Cancel at least 24 hours before the trial or period ends to avoid renewal. Manage Subscriptions in the app opens https://apps.apple.com/account/subscriptions.

There is no app account, so there is no demo password and no expired-subscription login. Use a sandbox Apple ID to buy or restore.

## What was tested for these notes

Web, Chrome, 430 by 932 CSS pixels, on 14 November 2026. An earlier iOS simulator run (maestro exit 0, `qa/sim-shots/run-43584645762/summary.md`) reached the home screen, a workout, and the paywall. No physical iPhone was used for this packet.

The only external service the reviewer will hit is StoreKit, for Pro. The plan itself stays on the device.

## How this app differs from the other workout apps on the account

45 Days Abs Challenge is a fixed 45-day core plan in four phases, with days 1 to 7 free and days 8 to 45 sold as Pro. Its bundle is `com.momentum.abs45`. Its products are `com.momentum.abs45.monthly`, `.yearly`, and `.lifetime`. It is not a reskin of Momentum for men, Momentum for women, or CoreForge: those are separate codebases, separate bundle IDs, and separate product IDs, with broader strength or gym libraries rather than this 45-day core sequence.

## Advertised features

The plan, the free first seven days, the rest timer, the form stills, on-device progress, and the three Pro prices are in this source. The app does not include onboarding or reminders, and the listing does not advertise them.

Privacy, Terms, and Support links open the URLs in `store/listing.md`. Those URLs returned HTTP 404 on 14 November 2026 because the pages in `docs/` are not published yet.
