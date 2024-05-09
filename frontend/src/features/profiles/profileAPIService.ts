import axios from "axios";

import ProfilePublic from "../../type_interfaces/ProfilePublic";
import { Headers } from "../../common/AxiosConfigUtil";

import { appJsonHeadersBasedOnTokenInLocStorage } from "../../common/AxiosConfigUtil";
const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

const getProfiles = async () => {
  //:Promise< ProfilePublic[]>
  console.log("getting profiles");
  const headers: Headers = appJsonHeadersBasedOnTokenInLocStorage();
  const response = await axios.get(
    //TODO add pagination, search params, etc
    `${REACT_APP_API_PATH}profile/all/`,
    {
      headers,
    }
  );
  console.log("attempted to get profiles");
  console.log("profiles res");
  console.log(response);
  return response.data;
};

const profileAPIService = { getProfiles };

export default profileAPIService;
