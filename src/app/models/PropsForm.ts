import { ValidatorFn } from "@angular/forms";

export interface Props {
  name: string;
  placeholder: string;
  formControlName: string;
  validators?: Array<validatorForm>;
}
interface validatorForm {
  validator: ValidatorFn;
  message: string;
  validatorName: string;
}
