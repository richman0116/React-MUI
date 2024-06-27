import React, { useEffect, useState } from "react";
import L from "leaflet";
import RoutingMachine from "./RoutingMachine";
import { useMap } from "react-leaflet";

const MapZoom = ({ selected, radiusValue, mapRef, closestAssestData, setZoomLevel }) => {
	const map = useMap();
	const [doneCal, setDoneCal] = useState(false);
	const setMapBounds = (center, radius) => {
		if (mapRef && mapRef.current) {
			if (map && center && radius) {
				setDoneCal(false);
				const markerCoordinates = closestAssestData.map((marker) =>
					L.latLng(marker.geoCode[0], marker.geoCode[1])
				);
				markerCoordinates.push(L.latLng(selected.lat, selected.lon));
				const bounds = L.latLngBounds(markerCoordinates).pad(0.1);
				map.fitBounds(bounds);
				const zoomLevel = map.getBoundsZoom(bounds);
				map.setZoom(zoomLevel);
				setZoomLevel(zoomLevel);
				setDoneCal(true);
			} else {
				console.error("Leaflet map object, center, or radius is not available.");
			}
		} else {
			console.error("mapRef is not available.");
		}
	};

	useEffect(() => {
		if (selected && radiusValue) {
			setMapBounds(selected, radiusValue);
		}
	}, [selected, radiusValue, mapRef]);

	return (
		doneCal &&
		selected &&
		closestAssestData &&
		closestAssestData.length &&
		closestAssestData?.map((asset) => (
			<RoutingMachine key={asset.geoCode[0]} selected={selected} data={asset} mapRef={mapRef} />
		))
	);
};

export default MapZoom;
