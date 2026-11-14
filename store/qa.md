# QA — abs45/launch — 14 November 2026

No EAS build and no App Store Connect session. The web column is this environment: `npx expo start --web`, headless Chrome, 430×932 CSS pixels at 3×. There is no Android emulator and no iOS simulator here.

The iOS column is the earlier macOS sim run recorded in `qa/sim-shots/run-43584645762/summary.md` (maestro exit 0). That flow waits for `home-screen`, scrolls to `progress-section`, taps `calendar-day-1`, waits for `workout-card`, taps `unlock-pro`, waits for `paywall-screen`, and closes it. The only images saved from that run are the home screen twice, both 1206×2622, and `store/screenshots/abs-1-home.png` was the same file. It is not listing-sized, so it is no longer in `store/screenshots/`. The sim copies remain in `qa/sim-shots/`.

`npx tsc --noEmit` passed. `npm run assert-workouts` passed (45 unique days, recovery on days 7, 14, 21, 28, 35, and 42, days 1-7 free). No lint script and no test suite.

| Item | Result | Source | Notes |
| --- | --- | --- | --- |
| Onboarding | Fail | Web | The first screen is the home plan. There is no onboarding flow. |
| Onboarding | Not covered | iOS sim 43584645762 | The flow starts on `home-screen`. It does not look for an onboarding step. |
| 45-day plan | Pass | Web | Four phases, a workout for the selected day, and 45 calendar cells. Days 8-45 show a lock. Cells are buttons. |
| 45-day plan | Pass | iOS sim 43584645762 | Maestro reached `home-screen`, `progress-section`, `calendar-day-1`, and `workout-card`. |
| Start and complete a workout | Pass, with limits | Web | Mark Complete on day 1 moved to day 2, streak 1, 2% complete, and 12 in Min this week. Reload kept that progress. There is no set-by-set player. `Alert.alert` does nothing on web, so the completion message was not visible. |
| Start and complete a workout | Not covered | iOS sim 43584645762 | The flow opened day 1 and did not mark it complete. |
| Timers | Pass, with limits | Web | The day 1 rest timer showed 44 seconds and Stop returned the idle button. The end-of-rest alert is not visible on web. Background timing was not tested. |
| Timers | Not covered | iOS sim 43584645762 | The sim flow does not start the rest timer. |
| Progress tracking | Pass, with limits | Web | Streak, percent, and the calendar update and persist. Min this week is the sum of planned minutes for recent completed day numbers, not a counted clock and not a calendar week. The streak increases on every completion in one sitting. |
| Progress tracking | Pass, section only | iOS sim 43584645762 | The flow scrolled until `progress-section` was visible. It did not complete a day. |
| Paywall prices | Pass | Web | Pro and locked day 8 both open the paywall. Each plan shows its length and the full price ($2.99 a month, $19.99 a year, $39.99 once) before Continue. These match `storekit/Abs45.storekit` and `src/products.ts`. Continue cannot charge on web. |
| Paywall prices | Pass, screen only | iOS sim 43584645762 | Maestro waited until `paywall-screen` was visible, then closed it. The flow does not read the prices. No paywall image was saved. |
| Auto-renew text | Pass | Web | Before Continue, the paywall says a subscription renews unless cancelled at least 24 hours before the trial or period ends, and that the charge goes to the Apple Account. |
| Auto-renew text | Not covered | iOS sim 43584645762 | The flow does not read the legal paragraph. |
| Restore Purchases | Partial | Web | The button is on the paywall. Tapping it does not restore anything here: the page reports `Cannot find native module 'ExpoIap'`, and Continue then says the store is not available on this device. |
| Restore Purchases | Not covered | iOS sim 43584645762 | The flow does not tap `paywall-restore`. |
| Terms and Privacy links | Partial | Web | Terms of Use and Privacy Policy are on the paywall and in About. They opened the GitHub Pages URLs. Privacy, Terms, and Support each returned HTTP 404. |
| Terms and Privacy links | Not covered | iOS sim 43584645762 | The flow does not tap `paywall-terms` or `paywall-privacy`. |
| Reminders and notifications | Fail | Web | No reminder control, no permission prompt, and no notification library. |
| Reminders and notifications | Not covered | iOS sim 43584645762 | The sim flow does not look for reminders. |

## Fixes checked on this branch

Side Plank already maps to its own still. `exerciseKeyFor` prefers the longer name. Opening day 3's second form button loaded `assets/exercise-media/side-plank/0.png`. No change was made for that.

The current day number in light mode now uses the accent color. Measured `rgb(59, 130, 246)` instead of white on a white cell.

Min this week now sums planned minutes. After day 1 it showed 12, that day's duration, instead of 16.

Nutrition tips no longer give a 300 to 500 kcal range or a 1.6 to 2.2 g/kg protein target. The section says the suggestions are not medical advice.

The rest timer no longer calls `Alert.alert` from inside the state updater. The countdown still ran.

## Still open

- No onboarding and no reminders.
- The streak is not tied to the calendar date.
- Min this week is still planned minutes over a window of day numbers.
- Completion and rest-finished messages need a device, because `Alert.alert` is empty on web.
- A purchase and a restore need StoreKit. They were not completed here, and the saved iOS sim images do not show them.
- The public privacy, terms, and support URLs 404.
