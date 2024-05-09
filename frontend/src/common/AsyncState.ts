import { ReducerStatus } from "./ReducerStatus";

export interface AsyncState {
  status: ReducerStatus;
  hasError: boolean; // TODO -  is this needed- if no, delete
  err_message: string;
}
