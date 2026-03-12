import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MedicationForm } from '../../services/medication-form';
import { availableDrugs, routes,therapyTypes, dosageUnits, frequencies, physicians } from '../../constants/mock-data';

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

  form!: FormGroup;

  constructor(private formService: MedicationForm) {
    this.form = this.formService.createMedicationOrderForm();
  }

  ngOnInit(): void {}

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