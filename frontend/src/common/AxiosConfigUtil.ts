export const appJsonAxiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export interface Headers {
  [key: string]: string;
}

export function appJsonHeadersBasedOnTokenInLocStorage(): Headers {
  /**
   * header has "Content-Type": "application/json"
   * If a jwt_access token is present in local storage it will be added to the header
   * "Authorization" = `Bearer ${accessToken}`
   *
   */
  const accessToken: string | null = localStorage.getItem("jwt_access");
  if (accessToken !== null) {
    let headers: Headers = appJsonAxiosConfig.headers;
    headers["Authorization"] = `Bearer ${accessToken}`;
    return headers;
  } else {
    return appJsonAxiosConfig.headers;
  }
}
