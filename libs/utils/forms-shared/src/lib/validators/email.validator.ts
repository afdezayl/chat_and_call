import { AbstractControl, ValidatorFn } from '@angular/forms';
import { isEmail } from 'class-validator';

export const emailValidator: ValidatorFn = (
  control: AbstractControl
): { [key: string]: any } | null => {
  const isValidEmail = isEmail(control?.value);
  //console.log(isValidEmail);
  return isValidEmail ? null : { email: true };
};
