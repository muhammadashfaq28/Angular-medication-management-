import { CanActivateFn, CanDeactivateFn } from '@angular/router';



  export interface CanComponentDeactivate {
    hasUnsavedChanges: boolean;
  }
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if(component.hasUnsavedChanges){
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
  return true;
};
