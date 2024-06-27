/* Haversine formula, which is commonly used for calculating 
distances between two points on a sphere, such as the Earth. */

let EARTH_RADIUS = 6371;

function getDistance(origin, destination) {
	// return distance in meters
	let lon1 = toRadian(origin[1]),
		lat1 = toRadian(origin[0]),
		lon2 = toRadian(destination[1]),
		lat2 = toRadian(destination[0]);

	let deltaLat = lat2 - lat1;
	let deltaLon = lon2 - lon1;

	let a =
		Math.pow(Math.sin(deltaLat / 2), 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
	let c = 2 * Math.asin(Math.sqrt(a));
	return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
	return (degree * Math.PI) / 180;
}

export default getDistance;
