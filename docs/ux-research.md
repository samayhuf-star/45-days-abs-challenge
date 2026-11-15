# UX research: abs and 30-day workout apps

Date: 15 November 2026.

Purpose: Samay’s note is that 45 Days Abs Challenge lacks a UI and a questionnaire. This note records how popular abs and 30-day workout apps introduce a plan, play a session, and ask for payment, so a redesign can meet that standard with original layout, art, and wording.

Method: public App Store and Google Play listings, publisher pages, and one published screen-by-screen teardown. Listings were read for structure (which questions, where the paywall sits, what the player and progress screens contain). Marketing sentences, body illustrations, and screen layouts were not copied. Store pages change; this is a snapshot.

## Apps reviewed

| App | Publisher pattern | What was used |
| --- | --- | --- |
| 30 Day Ab Workout Challenge | Home core plan, level chosen from body stats | [App Store](https://apps.apple.com/us/app/30-day-ab-workout-challenge/id1368434056) |
| Six Pack in 30 Days: Core, Abs | Leap Fitness 30-day abs plan | [App Store](https://apps.apple.com/us/app/six-pack-in-30-days-core-abs/id1338655056), [screen index](https://screensdesign.com/apps/six-pack-in-30-days-6-pack/), [showcase](https://screensdesign.com/showcase/six-pack-in-30-days-6-pack) |
| Lose Belly Fat - Abs Workout, and Lose Belly Fat at Home | 30-day home abs challenge, several store listings in this family | [Abs Workout on the App Store](https://apps.apple.com/us/app/lose-belly-fat-abs-workout/id1352797646), [Lose Belly Fat at Home on the App Store](https://apps.apple.com/us/app/lose-belly-fat-at-home/id1401094894), [Play listing used for the 10-minute / 3-level pattern](https://play.google.com/store/apps/details?id=losebellyfat.flatstomach.absworkout.fatburning) |
| Core30: Ab & Core Workout | Short daily core plan built from goal and level | [App Store](https://apps.apple.com/us/app/core30-ab-core-workout/id6745766720), [publisher](https://www.sgwni.com/core30) |
| 30 Day Fitness Challenge (web quiz) | Gender, goal, and target-area quiz before a plan | [Get started](https://30dayfitness.app/get-started/) |
| Muscle Booster | Long intake: goal, areas, body stats, schedule, reminder | [Play](https://play.google.com/store/apps/details?id=musclebooster.workout.home.gym.abs.loseweight) |
| Abs workout - Flat belly | Timed sessions, rest, charts, reminders, weight log | [Play](https://play.google.com/store/apps/details?id=melstudio.mpress) |

A 2026 write-up of Six Pack in 30 Days also describes the player as timed sets with a voice count, a preview of the move, a morning reminder, and a calendar of check marks ([review](https://appviewable.com/apps/app-six-pack-in-30-days/)).

## What this app is today

45 Days Abs Challenge already has the piece these apps often fake: 45 distinct days, four phases, recovery days, and a closable paywall with Restore. The shell around that library is one scrolling page. There is no questionnaire, no “your plan” step, no tab bar, no exercise-by-exercise player, and no reminder. Days 1–7 are playable; days 8–45 open Pro. That gating should stay. The missing layer is the questionnaire, the session player, and a small set of primary screens.

## Onboarding questionnaire

The shared pattern is a linear quiz of large tappable cards, one question per screen, with a progress indicator. Back is always available. Skip is common and must still leave a usable plan.

Questions that show up again and again:

| Question | Where it showed up | Use in our plan |
| --- | --- | --- |
| Main goal | Six Pack teardown (early), 30 Day Fitness, Core30, Muscle Booster | Yes. Four original goals. Changes rest slightly. |
| Gender | 30 Day Fitness (first question), Six Pack (before the goal), Muscle Booster | Yes, as a saved label only. It does not change exercises, rounds, or rest. |
| Current level | Core30, Lose Belly Fat (beginner / intermediate / advanced), 30 Day Ab (six levels) | Yes. Sets the difficulty name, base rounds, and base rest. |
| Target areas | 30 Day Fitness (multi-select), Muscle Booster, Lose Belly Fat (upper, lower, obliques) | Yes, multi-select. Reorders exercises. Does not change the dose. |
| Minutes per day | Core30 (most sessions 5–10), Lose Belly Fat (about 10), 30 Day Ab (about 4–15 by level) | Yes. Four fixed lengths. Changes round count and how many moves are kept. |
| Days per week | Muscle Booster, Lose Belly Fat weekly goal, Six Pack frequency step | Yes. 3, 4, 5, or 6. Picks which days in each week are training days. |
| Reminder time | All of the listings above advertise a daily reminder | Yes. Preset times. Permission is asked only after a time is chosen. |
| Height and weight | 30 Day Ab (to set a start level), Six Pack teardown (height, weight, target weight), Muscle Booster | No, not in the quiz. A weight log can live on Progress as an optional note. No BMI, no target weight, no “plan from your body stats.” |
| Body shape, before/after, diet, testimonials | Six Pack teardown has a long chain of these after the goal | No. That funnel is long, and several of those screens sell a result we will not promise. |

Six Pack’s published flow is about 25 onboarding steps: value, coach, gender, goal, current and desired body, motivation, birth year, height, weight, target weight, a before/after picture, speed, benefits, level, activity, frequency, diet, reward, feeling, testimonials, a “building your plan” wait, the plan summary, then the paywall. Core30 is the opposite: goal and level, then a plan. Our quiz should stay in the short range, about 7 steps, closer to Core30 than to the 25-step funnel.

30 Day Fitness asks gender first, then a goal list that differs for women and men, then a multi-select of target areas. We can ask gender and goal without changing the goal list by gender and without tying the plan to a body ideal.

30 Day Ab asks for height and weight and describes a starting level derived from BMI categories. That is a medical-style calculation. We will not do it. Level is a direct question.

## How answers become a plan

The store pattern is: last question, a short “building your plan” moment, a summary screen (“your plan is ready”), then the paywall.

What the summary usually shows:

- A named level (beginner, intermediate, advanced, or a branded equivalent).
- How long a day is.
- How many days a week, or “one session a day.”
- Sometimes a week-by-week or day-by-day preview.

What we should not imply:

- Six Pack, Lose Belly Fat, and Muscle Booster describe the plan as personalized, scientific, or produced by a coach or an algorithm. Muscle Booster’s listing also describes an AI fitness test. Our summary must say the plan is a fixed rule applied to the answers. No AI, no coach, no predicted body change.
- 30 Day Ab ties reps to BMI. Our rounds and rest come only from level, minutes, and goal, in a table a reviewer can recompute by hand.

The summary is the right place for the paywall, not the first screen. People should see the plan they are being asked to continue.

## Paywall placement

| App | Where money appears | What stays free |
| --- | --- | --- |
| Six Pack teardown | Soft paywall immediately after the plan summary. 7-day trial. Three prices. The annual plan is also shown as a weekly amount. | The teardown calls it a soft paywall, so the sheet can be dismissed. |
| 30 Day Ab | Membership for levels beyond the first, plus diet tools | Beginner Level 1, a full 30-day plan |
| Core30 | Pro is required to start workouts. Prices and any trial are shown in the app. | Browsing workouts and exercise guides |
| Lose Belly Fat family | Subscription after the plan, typical of this category | A short or beginner slice, varying by version |

Implications for this app:

- Keep the paywall after the plan summary. It stays closable. Restore stays on the sheet.
- Keep days 1–7 free and playable, including the player, not only a preview. That is a clearer free tier than “browse, but paying is required to press Start.”
- Days 8–45, and Start on those days, open the same paywall.
- Do not add a second price style. The current sheet already shows the full billed price as the large number, the length, the trial, and what Pro unlocks. A weekly breakdown of the yearly price, which the Six Pack teardown highlights as a sales tactic, would fight the requirement that the full price is the prominent one.
- Do not ask for a rating to unlock anything. The Six Pack teardown places a rating prompt after the first workout. We will not.

## Main screens

These apps converge on a few destinations after onboarding:

1. **Today.** The current session, the streak, and one Start button. Core30’s 2026 redesign is explicit about this: today’s session, the week, and the streak on the home screen. Six Pack’s release notes mention home-screen widgets for the streak; widgets are out of scope here.
2. **Challenge calendar.** A grid of the plan. Completed days are checked. The current day is marked. Premium or future days are locked. Rest days are visible. Weekly milestones or badges sit on the week boundary (30 Day Ab advertises streak badges; we only need a marker on each 7th day).
3. **Player.** One move at a time, not a list with a separate rest button. See below.
4. **Progress.** Streak, time, completed sessions, a simple chart, and often a weight or waist log. Waist-loss framing is common in the listings and is not something we should repeat.
5. **Settings / profile.** Reminder time, a way to redo the quiz, subscription management, restore, and the legal links.

Four tabs (Today, Calendar, Progress, Settings) cover that set. The player and the finish screen are pushed over the tabs, not extra tabs. The paywall is a sheet, not a tab.

## Exercise player

Across Core30, Six Pack, Lose Belly Fat, and Flat belly, a session is the same machine:

- The move name is large.
- A demo sits above the timer: video, animation, or a looping illustration. Core30 describes an animated demonstration and a timer ring. Listings for Six Pack and Lose Belly Fat describe animation or video plus a voice that counts.
- Timed holds count down. Rep moves are either counted or given a short work interval while the rep target stays on screen.
- When the interval ends, a rest screen counts down and names the next move, often with a small preview.
- Pause and skip are always available. Skip during work should land on rest (so the rest screen is a real step). Skip during rest should start the next move. The last move should finish, not open another rest.
- A finish screen states the day, the minutes, and the streak, with one button back to Today.

We will not ship a voice coach in this pass. Several competitors advertise one. Announcing it without building it would be a false feature. The demo will be original geometric figures drawn in the app, not their videos and not a new stock pack. The CC stills already in this repo can stay on disk; the new player should not depend on them.

Form cues should be one original sentence per move. No copied coaching scripts.

## Progress and reminders

Progress listings line up as:

- Streak (Six Pack has even added streak repair inside a week; we will not copy that rule).
- Minutes and workouts completed (Core30 charts these by week, month, and year; a single week chart is enough).
- A calendar with checks.
- An optional weight log (Lose Belly Fat, Six Pack, Flat belly). Ours stays on device, with no goal weight and no comment on whether the number went “the right way.”

Reminders are a daily local notification at a time the person picked. Core30 says its reminder skips a day already trained. That is a reasonable later refinement; the first version can schedule the chosen clock time every day and let Today show “already done” if they open the app. Permission must not appear at launch. The Six Pack teardown asks for notification permission after the first workout, which is another valid moment. Our constraint is stricter and simpler: ask only after a time is chosen, on that button press. Skip on the reminder step does not ask. Denial does not block the plan.

## Wording and claims to avoid

The listings above often promise fat loss, a flat stomach, or a visible result on a deadline, and several tell people to check with a doctor. We keep the caution and drop the promise.

- No diagnosis, treatment, or cure language.
- No “lose belly fat,” spot-reduction, or guaranteed look.
- No AI, algorithm-as-coach, or “scientifically proven” line. The plan is a published rule.
- One short line, in our own words, on the first questionnaire step, the plan summary, and Settings: consult a doctor before starting any exercise program. Stop if you feel pain.
- Gender is not a reason to change the workout.

## What is worth taking, in our own form

- Seven-step quiz, large cards, progress, back, and skip.
- A plan summary that shows difficulty, rounds, rest, minutes, days per week, and focus, computed from a fixed table.
- Paywall after that summary, still closable, with Restore. Soft gates on locked days.
- Today, a 45-day calendar, a real player (work, pause, rest with next-up, finish), Progress, and Settings.
- A daily reminder scheduled only after a time is chosen.
- Days 1–7 remain free and include the player.

## What we will not take

- Their sentences, color systems, mascots, or screen geometry.
- A 25-step funnel, body-shape pickers, before/after art, diet plans, or testimonials.
- Height, weight, or BMI as an input to difficulty.
- A voice coach, Apple Health, widgets, or streak repair in this pass.
- A paywall that blocks Start on day 1.
- Any price other than the three already in the app.
