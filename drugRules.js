import { DEFAULT_RULES, DRUG_RULE_OVERRIDES } from "./drugRulesConfig";

const AFTER_EXPIRATION_TYPES = ["multiplyBenefitChange", "setBenefit"];

// exporting just for testing purposes
export const validateRules = (drugName, rules) => {
  const hasCatchAllStep = rules.benefitSchedule.some(
    ({ whenExpiresInAtMost }) => whenExpiresInAtMost === Infinity,
  );
  if (!hasCatchAllStep) {
    throw new Error(
      `${drugName}: benefitSchedule needs a catch-all step (whenExpiresInAtMost: Infinity)`,
    );
  }

  const { type } = rules.afterExpiration;
  if (!AFTER_EXPIRATION_TYPES.includes(type)) {
    throw new Error(`${drugName}: unknown afterExpiration type "${type}"`);
  }
};

const buildRules = (drugName, overrides) => {
  const rules = { ...DEFAULT_RULES, ...overrides };
  validateRules(drugName, rules);

  return {
    ...rules,
    // Tightest threshold first, so the order in the config doesn't matter.
    benefitSchedule: rules.benefitSchedule.toSorted(
      (stepA, stepB) => stepA.whenExpiresInAtMost - stepB.whenExpiresInAtMost,
    ),
  };
};

const buildRulesByDrugName = () => {
  const rulesByDrugName = {};

  Object.entries(DRUG_RULE_OVERRIDES).forEach(([drugName, overrides]) => {
    rulesByDrugName[drugName] = buildRules(drugName, overrides);
  });

  return rulesByDrugName;
};

// Built once at load: each drug's rules are validated and sorted a single time.
const RULES_BY_DRUG_NAME = buildRulesByDrugName();
// Stryker disable next-line StringLiteral: the name only shows up in an error if DEFAULT_RULES itself is invalid
const NORMAL_DRUG_RULES = buildRules("normal drug", {});

const getDrugRules = (drugName) =>
  Object.hasOwn(RULES_BY_DRUG_NAME, drugName)
    ? RULES_BY_DRUG_NAME[drugName]
    : NORMAL_DRUG_RULES;

// Stryker disable EqualityOperator: at benefit === min (or max) both branches return the same value, so < vs <= mutants are equivalent
const clampBenefit = (benefit, { min, max }) => {
  if (benefit < min) {
    return min;
  }
  if (benefit > max) {
    return max;
  }

  return benefit;
};
// Stryker restore EqualityOperator

const calculateNextBenefit = ({ benefit, expiresIn }, rules) => {
  // First match is the tightest threshold (sorted at load).
  const { benefitChange } = rules.benefitSchedule.find(
    ({ whenExpiresInAtMost }) => expiresIn <= whenExpiresInAtMost,
  );

  const isExpired = expiresIn <= rules.expiration.expiredWhenExpiresInAtMost;
  if (!isExpired) {
    return clampBenefit(benefit + benefitChange, rules.benefitLimits);
  }

  // No default: afterExpiration types are validated at load.
  const { afterExpiration } = rules;
  switch (afterExpiration.type) {
    case "multiplyBenefitChange":
      return clampBenefit(
        benefit + benefitChange * afterExpiration.by,
        rules.benefitLimits,
      );
    case "setBenefit":
      return afterExpiration.to;
  }
};

// The drug's values after one day, according to its rules.
export const calculateNextDayValues = (drug) => {
  const rules = getDrugRules(drug.name);

  return {
    benefit: calculateNextBenefit(drug, rules),
    expiresIn: drug.expiresIn - rules.aging.decreaseExpiresInBy,
  };
};
