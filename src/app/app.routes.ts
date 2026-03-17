import { Routes } from '@angular/router';
import { MedicationOrder } from './components/medication-order/medication-order';
import { unsavedChangesGuard } from './guards/unsaved-changes-guard';

export const routes: Routes = [
    {
        path: '',
        component: MedicationOrder,
        canDeactivate: [unsavedChangesGuard]
    },
  
];