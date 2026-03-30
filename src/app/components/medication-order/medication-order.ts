import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-medication-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDividerModule, MatDatepickerModule, MatNativeDateModule],
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
  
  // yee constructure ma main form service inject kar raha hu aur form create kar raha hu jo medication order form return karta h
  constructor(private formService: MedicationForm) {
    this.form = this.formService.createMedicationOrderForm();
  }

  // yee har medication k har index par full list show karwata h or Route validation apply karta h or drug search setup karta h
  ngOnInit(): void {
    this.medications.controls.forEach((med, index) => {
      this.filteredDrugsPerIndex[index] = this.drugs;
      this.applyRouteValidation(med as FormGroup);
      this.setupDrugSearch(med as FormGroup, index);
    });

    // yee theorapy type k hisab se diagnosis aur physician k validation set karta h
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


    // this.medications.controls.forEach((medGroup: any) => {
    //   const routeControl = medGroup.get('route');
    //   const dosageValueControl = medGroup.get('dosage.value');
    //   const instructionsControl = medGroup.get('instructions');
    //   routeControl?.valueChanges.subscribe((routeValue: string) => {

    //     if (routeValue === 'IV') {
    //       dosageValueControl?.setValidators([
    //         Validators.required,
    //         Validators.min(0.1)
    //       ]);
    //       instructionsControl?.setValidators([
    //         Validators.required,
    //         Validators.minLength(20)
    //       ]);
    //     } else {
    //       dosageValueControl?.setValidators([
    //         Validators.required,
    //         Validators.min(1)
    //       ]);
    //       instructionsControl?.clearValidators();
    //     }
    //     dosageValueControl?.updateValueAndValidity();
    //     instructionsControl?.updateValueAndValidity();
    //   });
    // });

    // this.medications.controls.forEach((med: any) => {
    //   this.applyRouteValidation(med);
    // });

  }

  

  // yee 2 dimentional array h matlab har medication index par sari list show ho medicines ki aur jab search
  //  karega to us index par filter hoga baki index par sari list show hogi
  filteredDrugsPerIndex: string[][] = [];

  private setupDrugSearch(medGroup: FormGroup, index: number) {

    const drugControl = medGroup.get('drugName') as FormControl;
    const searchControl = medGroup.get('drugSearch') as FormControl;


    this.filteredDrugsPerIndex[index] = this.drugs;

    searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((value: string | null) => {

      const term = (value || '').toLowerCase().trim();

      this.filteredDrugsPerIndex[index] = this.drugs.filter(drug =>
        drug.toLowerCase().includes(term)
      );

      // Custome Duplicate Drug Error Clear on Search
      setTimeout(() => {
        if(value === 'Aspirin'){
          drugControl.setErrors({ 
            drugExists: {name: 'Aspirin', id:101}
          });
        }
      }, 0);

    });

    /*  Track form changes to set unsaved changes flag */

    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this.hasUnsaveChanges = true
      }
    })


    /*  Auto-save draft to localStorage after 5 seconds of inactivity*/

    this.form.valueChanges.pipe(
      debounceTime(5000)
    ).subscribe(() => {

      if (this.form.dirty && this.form.valid) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('medication-draft',
            JSON.stringify(this.form.getRawValue()));
          console.log('Draft Saved');
        }
      }

    });

    // ye draft saved ko console ma show karega jab bhi form ma changes karenge aur 5 second
    //  ke baad jab form valid hoga tabhi localStorage ma save karega
    // typeof window check karta h k browser environment ma h ya server side rendering ma h 
    // taki localStorage access kar sake without error

    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem('medication-draft');
      if (typeof window !== 'undefined')
        if (savedDraft) {

          const data = JSON.parse(savedDraft);
          this.form.patchValue(data);
        }
    }
  }

  

  //unsaveChanges 
  hasUnsaveChanges: boolean = false
  // yee hostlistner jb b ham refresh karenge ya page close karenge to ye function call hoga aur check karega
  //  k kya unsaved changes h agar h to user se confirm karega k kya wo sure h refresh ya close karne k liye
@HostListener('window:beforeunload', ['$event'])
handleBeforeUnload(event: BeforeUnloadEvent) {

  if (this.hasUnsaveChanges) {

    event.preventDefault();

    event.returnValue = '';

  }

}
  submitted = false;

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

    const index = this.medications.length - 1;
    this.filteredDrugsPerIndex[index] = this.drugs
    this.applyRouteValidation(newMed);
    this.setupDrugSearch(newMed, index);
  }

  removeMedication(index: number) {
    if (this.medications.length > 1) {
      this.medications.removeAt(index);
    }
  }

  onSubmit() {
    this.submitted = true;
    //show all error requirement on submit
    this.form.markAllAsTouched();
    if(this.form.invalid){
      return;
    }
    // yaha confirm kar raha h submit karny sy phly
    const confirmSubmit = confirm('Are you sure you want to submit the medication order?');
    if(!confirmSubmit){
      return;
    }


    if (this.formService.validateForm(this.form)) {
      alert('✅  Medication Order Submitted Successfully!');
      console.log(this.form.getRawValue());
      this.hasUnsaveChanges = false;
    }
  }


  // yee agr ham apnt draft ko restore karna chahte h to localStorage se item get karega
  //  aur form ma patchValue k through data fill kar dega
  restoreDraft() {

    if (typeof window !== 'undefined') { }

    const savedDraft = localStorage.getItem('medication-draft')
    if (savedDraft) {

      const data = JSON.parse(savedDraft)
      this.form.patchValue(data)
      console.log('Draft Restored');
    } else {
      console.log('No Draft Found');
    }
  }
  // yee draft cler karne k liye h localStorage se item remove kar dega aur console ma message show karega
  clearDraft() {
    if (typeof window !== 'undefined')
      localStorage.removeItem('medication-draft')
    console.log('Draft Cleared');
  }

  // clearall form fields
  clearAll() {
    const patientInfo = this.form.get('patientInfo')?.value
    this.form.reset()

    // patientinfo wapis set kar raha h 
    this.form.patchValue({
      patientInfo: patientInfo
    })
  }

  // yee last save draft par jata h dirty state reset kar deta h aur form ko wapis pristine bana deta h 

  discardChanges() {
    if (typeof window !== 'undefined') {
      const saveddraft = localStorage.getItem('medication-draft')
      if (saveddraft) {
        const data = JSON.parse(saveddraft)
        this.form.patchValue(data)
        this.form.markAsPristine()
        this.hasUnsaveChanges = false
        console.log('Changes Discarded, Reverted to Last Saved Draft');
      }
    }
  }

  //  loadPartialData() {
  //   const partial = {
  //     patientInfo: {
  //       patientId: 123
  //     }
  // }
  // this.form.patchValue(partial)
  // console.log('Partial Data Loaded', partial);
  //  }

   logValues(){
     console.log('Form Value:', this.form.value);
    console.log('Form Values Raw Value:', this.form.getRawValue());
   }

   isViewOnly: boolean = false;

toggleViewMode() {


  if (this.isViewOnly) {
    this.form.enable();
    this.isViewOnly = false; 
    console.log('Switched to Edit Mode');
  } 
  else {
    this.form.disable();
    this.isViewOnly = true;
    console.log('Switched to View-Only Mode');
  }
}
saveDraftManually() {
  if(typeof window !== 'undefined'){
    const data = this.form.getRawValue();
    localStorage.setItem('medication-draft', JSON.stringify(data))
    console.log('Draft Saved Manually');
  }
}



}