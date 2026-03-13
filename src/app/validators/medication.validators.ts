import { AbstractControl, FormArray, ValidationErrors } from "@angular/forms";

export class MedicationValidators {

    static mustContainDrValidator(control: AbstractControl) {
        const value = control.value || '';

        if (value.includes('Dr.')) {
            return null;
        }

        return { mustContainDr: true };
    }


    static duplicateDrugValidator(
        formArray: AbstractControl
    ): ValidationErrors | null {

        const medications = formArray as FormArray;

        const drugNames = medications.controls
            .map(control => control.get('drugName')?.value)
            .filter(value => !!value);

        const duplicates = drugNames.filter(
            (drug, index) => drugNames.indexOf(drug) !== index
        );

        if (duplicates.length > 0) {
            return {
                duplicateDrug: { drugName: duplicates[0] }
            };
        }

        return null;
    }
}