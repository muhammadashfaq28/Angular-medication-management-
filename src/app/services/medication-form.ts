import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DosageGroup,
  MedicationGroup,
  MedicationOrderForm,
  PatientInfoGroup,
  PrescribingInfoGroup
} from '../models/medication.interface';

@Injectable({
  providedIn: 'root',
})
export class MedicationForm {

  createMedicationOrderForm(): FormGroup<MedicationOrderForm> {
    return new FormGroup<MedicationOrderForm>({
      patientInfo: this.createPatientInfoGroup(),
      prescribingInfo: this.createPrescribingInfoGroup(),
      medications: new FormArray([
        this.createMedicationGroup()
      ])
    });
  }

  private createPatientInfoGroup(): FormGroup<PatientInfoGroup> {
    return new FormGroup<PatientInfoGroup>({
      patientId: new FormControl(null, { validators: [Validators.required] }),
      orderDate: new FormControl(null, { validators: [Validators.required] })
    });
  }

  private createPrescribingInfoGroup(): FormGroup<PrescribingInfoGroup> {
    return new FormGroup<PrescribingInfoGroup>({
      physician: new FormControl(null, { validators: [Validators.required] }),
      diagnosis: new FormControl(null),
      therapyType: new FormControl(null, { validators: [Validators.required] })
    });
  }

  createMedicationGroup(): FormGroup<MedicationGroup> {
    return new FormGroup<MedicationGroup>({
      drugName: new FormControl(null, { validators: [Validators.required] }),
      dosage: this.createDosageGroup(),
      route: new FormControl(null, { validators: [Validators.required] }),
      frequency: new FormControl(null, { validators: [Validators.required] }),
      instructions: new FormControl(null)
    });
  }

  createDosageGroup(): FormGroup<DosageGroup> {
    return new FormGroup<DosageGroup>({
      value: new FormControl(null, { validators: [Validators.required] }),
      unit: new FormControl(null, { validators: [Validators.required] })
    });
  }

  populateFromExisting(form: FormGroup, data: any): void {
    form.patchValue(data);
  }

  validateForm(form: FormGroup): boolean {
    form.markAllAsTouched();
    return form.valid;
  }

}
