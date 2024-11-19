import { Validable } from './other_models';

export interface AuthFormValues {
  email: Validable<string>;
  username: Validable<string>;
  password: Validable<string>;
}
