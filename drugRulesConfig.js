// General rules: every drug follows them unless it overrides a rule.
export const DEFAULT_RULES = {
  aging: { decreaseExpiresInBy: 1 },
  // expiresIn is checked before the day's update, so a drug is expired
  // on the update where it starts at 0 or less.
  expiration: { expiredWhenExpiresInAtMost: 0 },
  benefitLimits: { min: 0, max: 50 },
  // The daily benefit change, for the whole life of the drug (expired or not).
  benefitSchedule: [{ whenExpiresInAtMost: Infinity, benefitChange: -1 }],
  // How the daily benefit change is modified once the drug is expired.
  afterExpiration: { type: "multiplyBenefitChange", by: 2 },
};

// Only drugs that differ from the general rules are listed here;
// any other drug (e.g. Doliprane) follows DEFAULT_RULES.
export const DRUG_RULE_OVERRIDES = {
  "Herbal Tea": {
    benefitSchedule: [{ whenExpiresInAtMost: Infinity, benefitChange: +1 }],
  },
  Fervex: {
    benefitSchedule: [
      { whenExpiresInAtMost: Infinity, benefitChange: +1 },
      { whenExpiresInAtMost: 10, benefitChange: +2 },
      { whenExpiresInAtMost: 5, benefitChange: +3 },
    ],
    afterExpiration: { type: "setBenefit", to: 0 },
  },
  "Magic Pill": {
    aging: { decreaseExpiresInBy: 0 },
    benefitSchedule: [{ whenExpiresInAtMost: Infinity, benefitChange: 0 }],
  },
  Dafalgan: {
    benefitSchedule: [{ whenExpiresInAtMost: Infinity, benefitChange: -2 }],
  },
};
