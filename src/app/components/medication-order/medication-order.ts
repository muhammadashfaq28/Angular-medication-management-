import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicationForm } from '../../services/medication-form';
import { availableDrugs, routes, therapyTypes, dosageUnits, frequencies, physicians, chemotherapyDiagnoses } from '../../constants/mock-data';
import { MedicationValidators } from '../../validators/medication.validators';

@Component({
  selector: 'app-medication-order',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './medication-order.html',
  styleUrl: './medication-order.css',
})
export class MedicationOrder implements OnInit {

  drugs = availableDrugs;
  routesList = routes
  therapyTypesList = therapyTypes
  units = dosageUnits
  frequencyList = frequencies
  physicianList = physicians
  diagnosisList = chemotherapyDiagnoses

  form!: FormGroup;

  constructor(private formService: MedicationForm) {
    this.form = this.formService.createMedicationOrderForm();
  }

  ngOnInit(): void {

    const prescribingGroup = this.form.get('prescribingInfo') as FormGroup;

    const therapyControl = prescribingGroup.get('therapyType');
    const diagnosisControl = prescribingGroup.get('diagnosis');
    const physicianControl = prescribingGroup.get('physician');

    therapyControl?.valueChanges.subscribe((value) => {

      if (value === 'Chemotherapy') {

 
        diagnosisControl?.setValidators([Validators.required]);

        physicianControl?.setValidators([
          Validators.required,
          MedicationValidators.mustContainDrValidator
        ]);

      } else {

     
        diagnosisControl?.clearValidators();

        physicianControl?.setValidators([Validators.required]);
      }

      diagnosisControl?.updateValueAndValidity();
      physicianControl?.updateValueAndValidity();
    });


    this.medications.controls.forEach((medGroup: any) => {

      const routeControl = medGroup.get('route');
      const dosageValueControl = medGroup.get('dosage.value');
      const instructionsControl = medGroup.get('instructions');

      routeControl?.valueChanges.subscribe((routeValue: string) => {

        if (routeValue === 'IV') {

          dosageValueControl?.setValidators([
            Validators.required,
            Validators.min(0.1)
          ]);

          instructionsControl?.setValidators([
            Validators.required,
            Validators.minLength(20)
          ]);

        } else {

          dosageValueControl?.setValidators([
            Validators.required,
            Validators.min(1)
          ]);

          instructionsControl?.clearValidators();
        }

        dosageValueControl?.updateValueAndValidity();
        instructionsControl?.updateValueAndValidity();
      });

    });

  }

  get medications(): FormArray {
    return this.form.get('medications') as FormArray;
  }

  addMedication() {
    this.medications.push(this.formService.createMedicationGroup());
  }

  removeMedication(index: number) {
    if (this.medications.length > 1) {
      this.medications.removeAt(index);
    }
  }

  onSubmit() {
    if (this.formService.validateForm(this.form)) {
      console.log(this.form.value);
    }
  }
}