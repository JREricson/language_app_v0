import axios from "axios";

import ProfilePublic from '../../type_interfaces/ProfilePublic';

//get profiles
const getProfiles = async () => { //TODO go back to< ProfilePublic>
	const response = await axios.get<unknown>("/api/v0/profile/all/"); // TODO extract base url
	return response.data;
};

const profileAPIService = { getProfiles };

export default profileAPIService;  