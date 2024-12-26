export const requestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export interface Headers {
  [key: string]: string;
}

export function headersFromStoredToken(): Headers {
  /**
   * header has "Content-Type": "application/json"
   * If a jwt_access token is present in local storage it will be added to the header
   * "Authorization" = `Bearer ${accessToken}`
   *
   */
  const accessToken: string | null = localStorage.getItem("jwt_access");
  if (accessToken !== null) {
    const headers: Headers = requestConfig.headers;
    headers["Authorization"] = `Bearer ${accessToken}`;
    return headers;
  } else {
    return requestConfig.headers;
  }
}
