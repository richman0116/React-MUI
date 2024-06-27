export const handleError = (response) => {
	// Initialize a default error message
	let errorMessageToShow = "Something went wrong, please try again.";

	// Check if there's an explicit error object or use the response data directly
	const data = response.error ? response.error.data : response.data;

	if (data) {
		if (data.message) {
			// Handle potential nested message object
			errorMessageToShow =
				typeof data.message === "object" && data.message.message
					? data.message.message
					: data.message;
		} else if (data.error) {
			// Handle alternate error structure
			errorMessageToShow =
				typeof data.error === "object" && data.error.message ? data.error.message : data.error;
		}
	}

	return errorMessageToShow;
};
