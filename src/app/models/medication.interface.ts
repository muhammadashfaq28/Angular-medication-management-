import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface DosageGroup {
  value: FormControl<number | null>;
  unit: FormControl<string | null>;
}

export interface MedicationGroup {
  drugName: FormControl<string | null>;
  drugSearch: FormControl<string | null>;
  dosage: FormGroup<DosageGroup>;
  route: FormControl<string | null>;
  frequency: FormControl<string | null>;
  instructions: FormControl<string | null>;
}

export interface PatientInfoGroup {
  patientId: FormControl<string | null>;
  orderDate: FormControl<string | null>;
}

export interface PrescribingInfoGroup {
  physician: FormControl<string | null>;
  diagnosis: FormControl<string | null>;
  therapyType: FormControl<string | null>;
}

export interface MedicationOrderForm {
  patientInfo: FormGroup<PatientInfoGroup>;
  prescribingInfo: FormGroup<PrescribingInfoGroup>;
  medications: FormArray<FormGroup<MedicationGroup>>;
}