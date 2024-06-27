import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import pinUrl from "../../assets/icons/pin.png";
import { useEffect } from "react";

let DefaultIcon = L.icon({
	iconUrl: pinUrl,
	iconSize: [38, 38],
});

const createRoutineMachineLayer = ({ selected, data, mapRef }) => {
	const map = mapRef.current;

	useEffect(() => {
		const defaultMarker = L.marker([selected.lat, selected.lon], {
			icon: DefaultIcon,
		}).addTo(map);
		defaultMarker.bindPopup(`${selected.address}`);
	}, []);

	const instance = L.Routing.control({
		waypoints: [L.latLng(selected.lat, selected.lon), L.latLng(data.geoCode[0], data.geoCode[1])],
		lineOptions: {
			styles: [{ color: "#6FA1EC", weight: 4 }],
		},
		addWaypoints: false,
		draggableWaypoints: false,
		show: false,
		createMarker: function () {
			return null;
		},
	});

	console.log(instance);

	return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
