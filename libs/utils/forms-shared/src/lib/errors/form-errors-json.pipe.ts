import { Pipe, PipeTransform } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

@Pipe({
  name: 'formErrorsJson',
  pure: false,
})
export class FormErrorsJsonPipe implements PipeTransform {
  transform(abstractControl: AbstractControl): ValidationErrors | null {
    if (abstractControl instanceof FormControl) {
      return abstractControl.errors;
    } else if (abstractControl instanceof FormGroup) {
      const forChildrenErrors: Record<string, unknown> = {};
      for (const [key, control] of Object.entries(abstractControl.controls)) {
        const errors = this.transform(control);
        forChildrenErrors[key] = errors;
      }
      return forChildrenErrors;
    } else if (abstractControl instanceof FormArray) {
      const forChildrenErrors = [];
      for (const [key, control] of Object.entries(abstractControl.controls)) {
        const errors = this.transform(control);
        forChildrenErrors[(key as unknown) as number] = errors;
      }
      return forChildrenErrors;
    }
    return null;
  }
}
