import { createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit";
import profileAPIService from "./profileAPIService";
import { isAxiosError } from 'axios';
import ProfilePublic from '../../type_interfaces/ProfilePublic';

const initialState = {
	profiles: []  as unknown,//ProfilePublic[],
	// profile: {} as ProfilePublic,
	isError: false,
	isLoading: false,
	isSuccess: false,
	message: "",  
	// TODO include error response?
};


export interface ErrorResponse {
	statusCode: number;
	error: string;
	message: string;
	request: any;

}


export interface ProfileState {
	profiles:unknown// ProfilePublic[],
	// profile: {} as ProfilePublic,
	isError: Boolean,
	isLoading: Boolean,
	isSuccess: Boolean,
	message: string,
	// TODO include error response?

}

// get all profiles
export const getProfiles = createAsyncThunk(
	"profiles/getAll", //TODO rename to all?
	async (_, thunkAPI) => {
		try {
			return await profileAPIService.getProfiles();
		} catch (error: unknown) {
			let msg: string = "";
			if (isAxiosError(error)) {
				// TODO make error an object and add default handler, ie handleAxiosError()
				msg += error.message;
				msg += "\n" + error.response?.status;
				msg += "\n" + error.response?.headers;



			} else {
				msg = "Unknown Error";
				//  TODO:  log errors
			}


			return thunkAPI.rejectWithValue(msg);
		}
	}
);

// }

export const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		reset: (state) => initialState,
	},
	extraReducers: (builder) => {
		
		//TODO export into reuseable method

		builder
			.addCase(getProfiles.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getProfiles.fulfilled, (state, action: PayloadAction<unknown>) => {//ProfilePublic[]
				state.isLoading = false;
				state.isSuccess = true;
				state.profiles = action.payload;
			})
			.addCase(getProfiles.rejected, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload as string; //TODO verify this is the correct way
			});
	},
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;