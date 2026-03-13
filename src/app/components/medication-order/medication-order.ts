import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicationForm } from '../../services/medication-form';
import { availableDrugs, routes, therapyTypes, dosageUnits, frequencies, physicians, chemotherapyDiagnoses } from '../../constants/mock-data';
import { MedicationValidators } from '../../validators/medication.validators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medication-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDividerModule],
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

    this.medications.controls.forEach((med: any) => {
      this.applyRouteValidation(med);
    });


  }

  private applyRouteValidation(medGroup: FormGroup) {

    const routeControl = medGroup.get('route');
    const dosageValueControl = medGroup.get('dosage.value');
    const instructionsControl = medGroup.get('instructions');

    routeControl?.valueChanges.subscribe(routeValue => {

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
  }

  get medications(): FormArray {
    return this.form.get('medications') as FormArray;
  }

  addMedication() {

    const newMed = this.formService.createMedicationGroup();
    this.medications.push(newMed);
    this.medications.updateValueAndValidity()
    this.applyRouteValidation(newMed);

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