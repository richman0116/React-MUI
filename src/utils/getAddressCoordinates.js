import axios from "axios";

export const getAddressCoordinates = async (address) => {
	try {
		const apiKey = "7ee288f571f44f2484da32d9b85e166c";
		const response = await axios.get(
			`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
		);

		if (response.data.results.length > 0) {
			const { lat, lng } = response.data.results[0].geometry;
			return { lat, lng };
		}
	} catch (error) {
		console.error("Error fetching coordinates:", error);
	}
};
