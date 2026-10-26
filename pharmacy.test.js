import { Drug, Pharmacy } from "./pharmacy";
import expectedSimulation from "./output.json";

const cases = [
  {
    scope: "normal drug",
    testName: "decreases benefit and expiresIn by 1",
    input: { name: "Doliprane", expiresIn: 2, benefit: 3 },
    output: { name: "Doliprane", expiresIn: 1, benefit: 2 },
  },
  {
    scope: "normal drug",
    testName: "still degrades by 1 on its last day",
    input: { name: "Doliprane", expiresIn: 1, benefit: 10 },
    output: { name: "Doliprane", expiresIn: 0, benefit: 9 },
  },
  {
    scope: "normal drug",
    testName: "degrades benefit twice as fast once expired",
    input: { name: "Doliprane", expiresIn: 0, benefit: 10 },
    output: { name: "Doliprane", expiresIn: -1, benefit: 8 },
  },
  {
    scope: "normal drug",
    testName: "keeps degrading twice as fast long after expiration",
    input: { name: "Doliprane", expiresIn: -500, benefit: 10 },
    output: { name: "Doliprane", expiresIn: -501, benefit: 8 },
  },
  {
    scope: "normal drug",
    testName: "never lowers benefit below 0",
    input: { name: "Doliprane", expiresIn: 5, benefit: 0 },
    output: { name: "Doliprane", expiresIn: 4, benefit: 0 },
  },
  {
    scope: "normal drug",
    testName: "still lowers benefit when it lands exactly on 0",
    input: { name: "Doliprane", expiresIn: 5, benefit: 1 },
    output: { name: "Doliprane", expiresIn: 4, benefit: 0 },
  },
  {
    scope: "normal drug",
    testName: "clamps the doubled post-expiration decrease at 0",
    input: { name: "Doliprane", expiresIn: 0, benefit: 1 },
    output: { name: "Doliprane", expiresIn: -1, benefit: 0 },
  },
  {
    scope: "normal drug",
    testName: "never lowers benefit below 0 after expiration",
    input: { name: "Doliprane", expiresIn: 0, benefit: 0 },
    output: { name: "Doliprane", expiresIn: -1, benefit: 0 },
  },
  {
    scope: "Herbal Tea",
    testName: "increases benefit by 1 as it gets older",
    input: { name: "Herbal Tea", expiresIn: 10, benefit: 5 },
    output: { name: "Herbal Tea", expiresIn: 9, benefit: 6 },
  },
  {
    scope: "Herbal Tea",
    testName: "still increases by 1 on its last day",
    input: { name: "Herbal Tea", expiresIn: 1, benefit: 5 },
    output: { name: "Herbal Tea", expiresIn: 0, benefit: 6 },
  },
  {
    scope: "Herbal Tea",
    testName: "increases benefit twice as fast once expired",
    input: { name: "Herbal Tea", expiresIn: 0, benefit: 5 },
    output: { name: "Herbal Tea", expiresIn: -1, benefit: 7 },
  },
  {
    scope: "Herbal Tea",
    testName: "never raises benefit above 50",
    input: { name: "Herbal Tea", expiresIn: 10, benefit: 50 },
    output: { name: "Herbal Tea", expiresIn: 9, benefit: 50 },
  },
  {
    scope: "Herbal Tea",
    testName: "never raises benefit above 50 after expiration",
    input: { name: "Herbal Tea", expiresIn: 0, benefit: 50 },
    output: { name: "Herbal Tea", expiresIn: -1, benefit: 50 },
  },
  {
    scope: "Herbal Tea",
    testName: "caps the doubled post-expiration increase at 50",
    input: { name: "Herbal Tea", expiresIn: 0, benefit: 49 },
    output: { name: "Herbal Tea", expiresIn: -1, benefit: 50 },
  },
  {
    scope: "Herbal Tea",
    testName:
      "still applies the full double increase when it lands exactly on 50",
    input: { name: "Herbal Tea", expiresIn: 0, benefit: 48 },
    output: { name: "Herbal Tea", expiresIn: -1, benefit: 50 },
  },
  {
    scope: "Herbal Tea",
    testName: "keeps increasing twice as fast long after expiration",
    input: { name: "Herbal Tea", expiresIn: -500, benefit: 10 },
    output: { name: "Herbal Tea", expiresIn: -501, benefit: 12 },
  },
  {
    scope: "Fervex",
    testName: "increases benefit by 1 when more than 10 days are left",
    input: { name: "Fervex", expiresIn: 12, benefit: 35 },
    output: { name: "Fervex", expiresIn: 11, benefit: 36 },
  },
  {
    scope: "Fervex",
    testName: "still increases by 1 the day before the 10-day threshold",
    input: { name: "Fervex", expiresIn: 11, benefit: 35 },
    output: { name: "Fervex", expiresIn: 10, benefit: 36 },
  },
  {
    scope: "Fervex",
    testName: "starts increasing by 2 when exactly 10 days are left",
    input: { name: "Fervex", expiresIn: 10, benefit: 35 },
    output: { name: "Fervex", expiresIn: 9, benefit: 37 },
  },
  {
    scope: "Fervex",
    testName: "still increases by 2 the day before the 5-day threshold",
    input: { name: "Fervex", expiresIn: 6, benefit: 35 },
    output: { name: "Fervex", expiresIn: 5, benefit: 37 },
  },
  {
    scope: "Fervex",
    testName: "starts increasing by 3 when exactly 5 days are left",
    input: { name: "Fervex", expiresIn: 5, benefit: 35 },
    output: { name: "Fervex", expiresIn: 4, benefit: 38 },
  },
  {
    scope: "Fervex",
    testName: "keeps increasing by 3 until the expiration date",
    input: { name: "Fervex", expiresIn: 1, benefit: 35 },
    output: { name: "Fervex", expiresIn: 0, benefit: 38 },
  },
  {
    scope: "Fervex",
    testName: "never raises benefit above 50",
    input: { name: "Fervex", expiresIn: 15, benefit: 50 },
    output: { name: "Fervex", expiresIn: 14, benefit: 50 },
  },
  {
    scope: "Fervex",
    testName: "caps the +2 increase at 50",
    input: { name: "Fervex", expiresIn: 10, benefit: 49 },
    output: { name: "Fervex", expiresIn: 9, benefit: 50 },
  },
  {
    scope: "Fervex",
    testName: "still applies the full +2 increase when it lands exactly on 50",
    input: { name: "Fervex", expiresIn: 10, benefit: 48 },
    output: { name: "Fervex", expiresIn: 9, benefit: 50 },
  },
  {
    scope: "Fervex",
    testName: "caps the +3 increase at 50",
    input: { name: "Fervex", expiresIn: 5, benefit: 48 },
    output: { name: "Fervex", expiresIn: 4, benefit: 50 },
  },
  {
    scope: "Fervex",
    testName: "drops benefit to 0 once expired",
    input: { name: "Fervex", expiresIn: 0, benefit: 30 },
    output: { name: "Fervex", expiresIn: -1, benefit: 0 },
  },
  {
    scope: "Fervex",
    testName: "drops benefit to 0 long after expiration",
    input: { name: "Fervex", expiresIn: -500, benefit: 20 },
    output: { name: "Fervex", expiresIn: -501, benefit: 0 },
  },
  {
    scope: "Magic Pill",
    testName: "never expires nor decreases in benefit",
    input: { name: "Magic Pill", expiresIn: 15, benefit: 40 },
    output: { name: "Magic Pill", expiresIn: 15, benefit: 40 },
  },
  {
    scope: "Magic Pill",
    testName: "does not decrease in benefit even with a past expiration",
    input: { name: "Magic Pill", expiresIn: -1, benefit: 40 },
    output: { name: "Magic Pill", expiresIn: -1, benefit: 40 },
  },
];

describe("Pharmacy", () => {
  it.each(cases)("$scope: $testName", ({ input, output }) => {
    const drug = new Drug(input.name, input.expiresIn, input.benefit);

    expect(new Pharmacy([drug]).updateBenefitValue()).toEqual([output]);
  });

  it("defaults to an empty list of drugs", () => {
    expect(new Pharmacy().updateBenefitValue()).toEqual([]);
  });

  it("updates every drug and returns the pharmacy's drugs", () => {
    const pharmacy = new Pharmacy([
      new Drug("Doliprane", 20, 30),
      new Drug("Herbal Tea", 10, 5),
    ]);

    const drugs = pharmacy.updateBenefitValue();

    expect(drugs).toBe(pharmacy.drugs);
    expect(drugs).toEqual([
      new Drug("Doliprane", 19, 29),
      new Drug("Herbal Tea", 9, 6),
    ]);
  });

  it("matches the 30-day simulation in output.json", () => {
    const pharmacy = new Pharmacy([
      new Drug("Doliprane", 20, 30),
      new Drug("Herbal Tea", 10, 5),
      new Drug("Fervex", 12, 35),
      new Drug("Magic Pill", 15, 40),
    ]);

    const dailySnapshots = [];
    for (let elapsedDays = 0; elapsedDays < 30; elapsedDays++) {
      // Copy: the drugs are updated in place every day.
      dailySnapshots.push(
        JSON.parse(JSON.stringify(pharmacy.updateBenefitValue())),
      );
    }

    expect(dailySnapshots).toEqual(expectedSimulation.result);
  });
});
