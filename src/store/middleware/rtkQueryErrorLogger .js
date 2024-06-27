import { isRejectedWithValue } from "@reduxjs/toolkit";

export const rtkQueryErrorLogger = () => (next) => (action) => {
	// RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
	if (isRejectedWithValue(action)) {
		console.warn("We got a rejected action!");
		console.log("ERROR: ", action);
		// notification({
		// 	type: "error",
		// 	title: "Error occurred",
		// 	description: formatHTTPErrorMessage(action.payload),
		// });
	}

	return next(action);
};
