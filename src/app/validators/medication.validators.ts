import { AbstractControl } from "@angular/forms";

export class MedicationValidators {

  static mustContainDrValidator(control: AbstractControl) {
    const value = control.value || '';

    if (value.includes('Dr.')) {
      return null;
    }

    return { mustContainDr: true };
  }
}