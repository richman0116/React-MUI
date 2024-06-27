/* project-osrm distance api:  https://router.project-osrm.org/route/v1/driving/33.532005,131.3496745;33.532006,131.3496746?overview=false&alternatives=true&steps=true */

/* TODO Just use rtk query for this distance measure. Don;t need the leaflet routing machine.
routing machine is for visualization in maps */

import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

const LeafletRoutingDistance = ({
	locationData,
	defaultLocation,
	getSortedLocationsByDistance,
}) => {
	const map = useMap();
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		locationData.forEach((loc) => {
			const router = L.Routing.control({
				waypoints: [
					L.latLng(parseFloat(defaultLocation.lat), parseFloat(defaultLocation.lon)),
					L.latLng(loc.geoCode[0], loc.geoCode[1]),
				],
				addWaypoints: false,
				draggableWaypoints: false,
				show: false,
				lineOptions: { styles: [] }, // Empty array to hide the line

				createMarker: function () {
					return null;
				},
			});

			router.on("routesfound", function (e) {
				let routes = e.routes;
				/* let distance = routes[0].summary.totalDistance; // Total distance in meters
				let totalTime = routes[0].summary.totalTime; // Total time in seconds */

				setLocations((prevLocation) => [...prevLocation, { routes: routes[0], location: loc }]);

				// Display the distance and total time
				/* console.log("Distance: " + distance + " meters");
				console.log("Total time: " + totalTime + " seconds"); */
			});

			router.on("routingerror", function (e) {
				console.log("Routes ERROR ");
				setLocations((prevLocation) => [...prevLocation, { routes: null, location: loc }]);
			});

			router.addTo(map);
		});
	}, []);

	useEffect(() => {
		if (locations.length === locationData.length) {
			console.log("Unsorted Locations ____", locations);
			const sortedLocations = [...locations].sort((a, b) => {
				const distanceA = a.routes ? a.routes.summary.totalDistance : null;
				const distanceB = b.routes ? b.routes.summary.totalDistance : null;

				if (distanceA === null && distanceB === null) {
					return 0; // equivalent for the purpose of sorting
				} else if (distanceA === null) {
					return 1; // Place `a` at the end
				} else if (distanceB === null) {
					return -1; // Place `b` at the end
				} else {
					return distanceA - distanceB;
				}
			});
			getSortedLocationsByDistance(sortedLocations);
		}
	}, [locations]);

	return null;
};

export default LeafletRoutingDistance;
