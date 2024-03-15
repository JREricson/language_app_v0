import { RegisterFormField } from './interfaces/RegisterFormField';

export type UserNew = Omit<RegisterFormField, 're_password'>;
