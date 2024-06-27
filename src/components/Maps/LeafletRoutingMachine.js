import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import pinUrl from "../../assets/icons/pin.png";
import locationUrl from "../../assets/icons/location.png";
import { ClosestLocationCount } from "../../shared/constants";

const LeafletRoutingMachine = ({
	coordinates,
	defaultLocation,
	updateClosestLocations,
	measureDistance,
	defaultMark,
}) => {
	let DefaultIcon = L.icon({
		iconUrl: pinUrl,
		iconSize: [38, 38],
	});

	let otherCoordinateIcon = L.icon({
		iconUrl: locationUrl,
		iconSize: [38, 38],
	});

	const map = useMap();
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		// Create markers for the defaultPoint
		const defaultMarker = L.marker([defaultLocation.lat, defaultLocation.lon], {
			icon: DefaultIcon,
		}).addTo(map);
		defaultMarker.bindPopup(
			`${defaultLocation.display_name} [${defaultLocation.lat} , ${defaultLocation.lon}]`
		);

		coordinates.forEach((coords) => {
			const router = L.Routing.control({
				waypoints: [
					L.latLng(parseFloat(defaultLocation.lat), parseFloat(defaultLocation.lon)),
					L.latLng(coords[0], coords[1]),
				],
				addWaypoints: false,
				draggableWaypoints: false,
				show: false,
				lineOptions: measureDistance && { styles: [] }, // Empty array to hide the line
				// units: "imperial",
				// routeWhileDragging: false,
				// geocoder: L.Control.Geocoder.nominatim(),
				// fitSelectedRoutes: false,
				// showAlternatives: false,
				// showGeocoders: false,

				createMarker: function () {
					return null;
				},
			});

			router.on("routesfound", function (e) {
				let routes = e.routes;
				let distance = routes[0].summary.totalDistance; // Total distance in meters
				let totalTime = routes[0].summary.totalTime; // Total time in seconds

				setLocations((prevLocation) => [...prevLocation, { routes: routes[0], coords }]);

				console.log(e);
				// Display the distance and total time
				console.log("Distance: " + distance + " meters");
				console.log("Total time: " + totalTime + " seconds");

				// Create markers for the coordinates
				const marker = L.marker(coords, { icon: otherCoordinateIcon }).addTo(map);
				if (!defaultMark && !measureDistance)
					marker.bindPopup(
						"Distance: " +
							(distance * 0.000621371192).toFixed(2) +
							" miles, " +
							"Extimated total time needed: " +
							Math.round((totalTime % 3600) / 60) +
							" minutes"
					);
			});

			router.on("routingerror", function (e) {
				console.log("Routes ERROR ");
				setLocations((prevLocation) => [...prevLocation, { routes: null, coords }]);
			});

			router.addTo(map);
		});

		// FIND THE CLOSEST ROUTES
		/* 		const sortedLocations = [...locations].sort(
			(a, b) => a.routes.summary.totalDistance - b.routes.summary.totalDistance
		);

		sortedLocations.slice(0, ClosestLocationCount).forEach((element) => {
			let polyline = L.polyline(element.routes.coordinates).addTo(map);
			// Fit the map bounds to the polyline
			map.fitBounds(polyline.getBounds());
		}); */

		return () => {
			map.eachLayer((layer) => {
				if (layer instanceof L.Routing.Control) {
					layer.removeFrom(map);
				}
			});
		};
	}, []);

	useEffect(() => {
		if (measureDistance && !defaultMark && locations.length === coordinates.length) {
			console.log("Locations >>>", locations);
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
			updateClosestLocations(sortedLocations.slice(0, ClosestLocationCount));
		}
	}, [locations]);

	return null;
};

export default LeafletRoutingMachine;
