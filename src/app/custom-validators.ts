import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            const valid = regex.test(control.value);
            return valid ? null : error;
        };
    }
}

// Regex details

// Note that the pattern changes I suggest are merely those related to the principle of contrast:

// ^ - start of string (implicit in string regex pattern)
// (?=\D*\d) - there must be 1 digit
// (?=[^a-z]*[a-z]) - there must be 1 lowercase ASCII letter
// (?=[^A-Z]*[A-Z]) - there must be 1 uppercase ASCII letter
// .{8,30} - any 8 to 30 chars other than line break chars
// $ - end of string (implicit in string regex pattern).
