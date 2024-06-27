import { getDistance } from "geolib";
import { config } from "../config";
import axios from "axios";

export const calculateDistance = (coord1, coord2) => {
	const distanceMeters = getDistance(
		{ latitude: coord1[0], longitude: coord1[1] },
		{ latitude: coord2[0], longitude: coord2[1] }
	);

	const distanceMiles = distanceMeters * 0.000621371;

	return distanceMiles.toFixed(2);
};

export const isValidCoordinate = (coord) => {
	const lat = coord[0];
	const lon = coord[1];
	return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
};

export const getBatchDistances = async (source, assets) => {
	const maxCoordinatesPerRequest = 10;
	let results = [];

	// Function to make a single API request
	async function fetchDistancesForChunk(source, chunk) {
		const coordinatesString = `${source[1]},${source[0]};${chunk
			.map((asset) => `${asset.geoCode[1]},${asset.geoCode[0]}`)
			.join(";")}`;

		const response = await axios.get(
			`https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic/${coordinatesString}`,
			{
				params: {
					sources: 0,
					annotations: "distance,duration",
					access_token: config.MAPBOX_TOKEN,
				},
			}
		);

		return chunk.map((asset, index) => ({
			...asset,
			distance: (response.data.distances[0][index + 1] / 1000) * 0.621371, // Converting meters to miles
			duration: response.data.durations[0][index + 1],
		}));
	}

	// Chunk assets and fetch data
	for (let i = 0; i < assets.length; i += maxCoordinatesPerRequest - 1) {
		// -1 because the source is also a coordinate
		const chunk = assets.slice(i, i + maxCoordinatesPerRequest - 1);
		const chunkResults = await fetchDistancesForChunk(source, chunk);
		results = results.concat(chunkResults);
	}

	// Sorting all results by distance
	results.sort((a, b) => a.distance - b.distance);

	return results;
};

export const formatDistance = (distanceInMiles) => {
	if (distanceInMiles === 0) {
		return "0 mi";
	}

	return distanceInMiles && typeof distanceInMiles === "number"
		? distanceInMiles.toFixed(1) + " mi"
		: "";
};

export const formatDuration = (durationInSeconds) => {
	const hours = Math.floor(durationInSeconds / 3600);
	const minutes = Math.floor((durationInSeconds % 3600) / 60);

	const formattedDuration = [];

	if (hours > 0) {
		formattedDuration.push(hours + " hr");
	}
	if (minutes > 0) {
		formattedDuration.push(minutes + " min");
	}

	return formattedDuration.join(", ");
};
