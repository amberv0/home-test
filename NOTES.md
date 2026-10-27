# Solution notes

## Approach
My main goal was to express the drug rules as data: general rules plus per-drug overrides, so adding a drug means adding a config entry rather than another branch in `updateBenefitValue`.

The process (one commit per step):
1. Cover the existing logic and rules with tests (coverage and mutation score at 100%), so the refactor is safe.
2. Refactor the logic to read the rules from data, keeping `output.json` identical.
3. Add Dafalgan, which turned out to be a 3-line config entry.

## Decisions and known limitations
- Any drug without its own overrides (Doliprane, or a name the config doesn't know) follows the general rules, like the original code. Throwing on unknown names would break other code that creates `Drug`s. Meaning that we don't catch incorrect name spellings.
- No benefit validation in the `Drug` constructor, so a drug can be created outside the 0–50 range from the README. Throwing there would break other code that creates `Drug`s, and the fields are public anyway, so anybody can set any value after creation (adding setters seemed out of scope). Instead, `updateBenefitValue` brings the benefit back within 0–50 on every update, so "never more than 50" and "never negative" hold after each day. The original code didn't do this. A side effect: an out-of-range drug moves to the limit in one update, even Magic Pill (80 becomes 50), which otherwise never changes.
- No TS, as it doesn't seem to be part of the exercise. Which is sad, it could have made things much nicer.
- No full validation of my rules objects structure. Could have used zod, but with TS we wouldn't have a problem anyway
- Pharmacy doesn't validate its drugs, nor we validate expiresIn. It is assumed to be a whole number of days: a fractional value can land on the other side of a threshold than in the original code. A non-numeric value (`NaN`, `undefined`) makes `updateBenefitValue` throw midway, so the drugs before it in the list are already updated and the ones after it are not.
- Days left are counted at the start of the day. Fervex gets +2 when `expiresIn` is 10 or less before the daily update, and a drug counts as expired on the update where `expiresIn` is 0 or less. The README wording is ambiguous; this matches the original code and `output.json`.
- Magic Pill with a negative `expiresIn` goes through the "after expiration" rule.** Its change is 0, so doubling it has no effect. There is no separate "can never expire" rule.
- About Dafalgan. I decided to interpret the rate as "Dafalgan degrades by 2 before expiration and by 4 after." The README only says it "degrades in Benefit twice as fast as normal drugs", which could also mean 2 after expiration too. I read it as twice the normal rate at every stage, so Dafalgan only overrides `benefitSchedule` and keeps the general "doubles after expiration" rule.
- Dafalgan is not added to the `index.js` simulation, so `yarn start` still produces the original `output.json`; it is covered by unit tests.
- Throwing plain errors for simplicity. 
- Kept both classes in a single file as they are now, and didn't attempt to split files into folders/etc

## Tests
- **Tests follow the README rules of each drug, not every scenario for every drug.** A rule that cannot be broken by a drug's own logic is not tested for that drug (e.g. "benefit is never negative" for Herbal Tea, which only increases; the 0–50 limits for Magic Pill, which never changes). Stryker at a 100% threshold guards that every line of code is pinned by a test.
- **The order independence of `benefitSchedule` is not tested.** The rules are module-private; it was checked manually by reordering the Fervex schedule.
- **The 30-day simulation test repeats the loop from `index.js`** instead of extracting a shared `simulate()` helper, to leave `index.js` untouched.
- **The simulation test compares against `output.json`, which `yarn start` regenerates.** Breaking the rules and running `yarn start` would update the expected values too; the change would only show up in `git diff output.json`.
