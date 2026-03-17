#  Medication Order Management System

##  Implementation Overview

This project is a comprehensive Medication Order Management System built using Angular Reactive Forms. It allows users to create, manage, and validate complex medication orders with dynamic behavior, ensuring a realistic healthcare application experience.

###  Technologies Used

- Angular (Standalone Components)
- Reactive Forms
- RxJS
- Angular Material UI
- TypeScript
- LocalStorage (for draft saving)

---

##  Reactive Forms Concepts Implemented

### ✔ Nested FormGroups
The form is divided into structured sections:
- Patient Information
- Prescribing Information
- Medications (dynamic)

### ✔ FormArray
Used to dynamically manage multiple medications.

### ✔ Custom Validators
- Duplicate Drug Validation
- Physician Name Validation (must include "Dr.")

### ✔ Dynamic Validation
Validators are updated in real-time based on user input.

---

##  FormArray Explanation

FormArray is used to manage multiple medications dynamically.

### Features:
- Add new medication
- Remove medication
- Each medication has its own FormGroup

### Example Code:

```ts
addMedication() {
  const newMed = this.formService.createMedicationGroup();
  this.medications.push(newMed);
}