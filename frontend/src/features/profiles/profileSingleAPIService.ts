import axios from "axios";
import { Headers } from "../../common/AxiosConfigUtil";
import { headersFromStoredToken } from "../../common/AxiosConfigUtil";

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

const getProfileSingle = async (profile_id: string) => {
  const headers: Headers = headersFromStoredToken();
  const response = await axios.get(
    `${REACT_APP_API_PATH}profile/${profile_id}/`,
    {
      headers,
    }
  );
  console.log(response);
  return response.data;
};

const profileSingleAPIService = { getProfileSingle };

export default profileSingleAPIService;
