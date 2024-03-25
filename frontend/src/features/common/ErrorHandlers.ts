import { isAxiosError } from 'axios';

export const handleAxiosErrorAndReturnErrMsgsAsStr = (error: unknown): string => {
  let msg: string = '';
  if (isAxiosError(error)) {
    msg += error.message;
    msg += '\n' + error.response?.status;
    msg += '\n' + JSON.stringify(error.response?.data, null, 2);
  } else {
    msg = 'Unknown Error';
    //  TODO:  log errors
  }
  return msg;
};
