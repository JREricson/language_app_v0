import axios from "axios";
import { Headers } from "../../common/AxiosConfigUtil";
import { headersFromStoredToken } from "../../common/AxiosConfigUtil";
const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

const getProfiles = async (query_str: string) => {
  //:Promise< ProfilePublic[]>
  console.log("getting profiles");
  const headers: Headers = headersFromStoredToken();
  const response = await axios.get(
    //TODO add pagination, search params, etc

    `${REACT_APP_API_PATH}profile/all?${query_str}`,
    {
      headers,
    }
  );
  console.log("query is :" + query_str);
  console.log("attempted to get profiles");
  console.log("profiles res");
  console.log(response);
  return response.data;
};

const profileAPIService = { getProfiles };

export default profileAPIService;
