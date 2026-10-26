import { validateRules } from "./drugRules";

const validRules = {
  benefitSchedule: [
    { whenExpiresInAtMost: Infinity, benefitChange: -1 },
    { whenExpiresInAtMost: 5, benefitChange: -2 },
  ],
  afterExpiration: { type: "multiplyBenefitChange", by: 2 },
};

describe("validateRules", () => {
  it("accepts rules with a catch-all step and a known afterExpiration type", () => {
    expect(() => validateRules("Doliprane", validRules)).not.toThrow();
  });

  it("rejects a benefitSchedule without a catch-all step", () => {
    const rules = {
      ...validRules,
      benefitSchedule: [{ whenExpiresInAtMost: 10, benefitChange: -1 }],
    };

    expect(() => validateRules("Doliprane", rules)).toThrow(
      new Error(
        "Doliprane: benefitSchedule needs a catch-all step (whenExpiresInAtMost: Infinity)",
      ),
    );
  });

  it("rejects an unknown afterExpiration type", () => {
    const rules = {
      ...validRules,
      afterExpiration: { type: "multiplyBenefit", by: 2 },
    };

    expect(() => validateRules("Doliprane", rules)).toThrow(
      new Error('Doliprane: unknown afterExpiration type "multiplyBenefit"'),
    );
  });
});
