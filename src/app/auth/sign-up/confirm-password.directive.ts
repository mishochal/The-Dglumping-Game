import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appConfirmPassword]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ConfirmPasswordDirective,
    multi: true
  }]
})
export class ConfirmPasswordDirective implements Validator {
  @Input("appConfirmPassword") password = "";

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== this.password) {
      return { "passwordNotMatching": true };
    }
    return null;
  }
}
