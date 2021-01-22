import { AbstractControl } from '@angular/forms';

export const MustMatchValidator = (
  controlName: string | (string | number)[],
  matchingControlName: string | (string | number)[]
) => {
  return (abstractControl: AbstractControl) => {
    const control = abstractControl.get(controlName);
    const matchingControl = abstractControl.get(matchingControlName);

    if (control === null || matchingControl === null) {
      let error = control
        ? ''
        : `First control ("${controlName}") not found.\n`;
      error += matchingControl
        ? ''
        : `Second control ("${matchingControlName}") not found.\n`;
      console.error(error);

      return null;
    }

    if (matchingControl?.errors && !matchingControl?.errors?.mustMatch) {
      return;
    }
    const isMatch = control.value === matchingControl.value;

    matchingControl.setErrors(isMatch ? null : { mustMatch: true });
  };
};
