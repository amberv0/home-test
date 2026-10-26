import { calculateNextDayValues } from "./drugRules";

export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  updateBenefitValue() {
    for (const drug of this.drugs) {
      const { benefit, expiresIn } = calculateNextDayValues(drug);
      drug.benefit = benefit;
      drug.expiresIn = expiresIn;
    }

    return this.drugs;
  }
}
