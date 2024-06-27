// Reference
// Dragable marker example: https://github.com/ultimateakash/react-leaflet-maps/tree/master

// TODO clean up code and make seperate components

import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Row, Col, Form, InputGroup, Card } from "@themesberg/react-bootstrap";

import L, { Icon, divIcon, point } from "leaflet";
import placeholderIconUrl from "../../assets/icons/placeholder.png";
import pinUrl from "../../assets/icons/pin.png";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import Location from "../../components/Maps/Location";
import LocationButton from "../../components/Maps/LocationButton";
import LeafletRoutingMachine from "../../components/Maps/LeafletRoutingMachine";
import { ClosestLocationCount } from "../../shared/constants";
import { useGetAssetsQuery } from "../../services/assets";

let DefaultIcon = L.icon({
	iconUrl: placeholderIconUrl,
	iconSize: [38, 38],
	// iconAnchor: [10, 41],
	// popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapContent = ({ onClick }) => {
	const map = useMapEvents({
		click: (event) => onClick(event),
	});
	return null;
};

// create custom icon
const customIcon = new Icon({
	// iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
	// eslint-disable-next-line no-undef
	iconUrl: pinUrl,
	iconSize: [38, 38], // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
	return new divIcon({
		html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
		className: "custom-marker-cluster",
		iconSize: point(33, 33, true),
	});
};

// markers
const markers = [
	{
		geocode: [29.749907, -95.358421],
		popUp: "Hello, I am pop up 1",
	},
	{
		geocode: [30.2672, -97.7431],
		popUp: "Hello, I am pop up 2",
	},
	{
		geocode: [29.4241, -98.4936],
		popUp: "Hello, I am pop up 3",
	},
];

const mapClicked = async (event) => {
	console.log("lat:", event.latlng.lat, "lng:", event.latlng.lng);
};

const AssetsMap = () => {
	const mapRef = useRef(null);
	const [map, setMap] = useState(null);
	const [defaultLocation] = useState([29.749907, -95.358421]); // Houston, Texas
	const [sidebarSearchValue, setSidebarSearchValue] = useState("");
	const [floatingSearchValue, setFloatingSearchValue] = useState("");
	const [floatingSearchResult, setFloatingSearchResult] = useState(null);
	const [isFloatingView, setIsFloatingView] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [closestLocations, setClosestLocations] = useState(null);
	const [closestCoordinates, setClosestCoordinates] = useState(null);
	const [searchLoading, setSearchLoading] = useState(false);

	useEffect(() => {
		if (mapRef.current && floatingSearchResult?.length) {
			const markers = [];
			if (floatingSearchResult?.length) markers.push(floatingSearchResult);

			const bounds = markers.reduce((acc, marker) => acc.extend(marker), L.latLngBounds());

			mapRef.current.fitBounds(bounds);
		}
	}, [floatingSearchResult]);

	const handleFloatingInputChange = (event) => {
		if (!event.target.value) {
			onFloatingInputReset();
			return;
		}
		setFloatingSearchValue(event.target.value);
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			if (floatingSearchValue.length) getSearchResult(floatingSearchValue);
		}
	};

	const onFloatingInputReset = () => {
		setFloatingSearchValue("");
		setFloatingSearchResult(null);
		setIsFloatingView(false);
		// setClosestLocations(null);
		// setClosestCoordinates(null);
		// flyToDefaultLocation();
	};

	// const flyToDefaultLocation = () => {
	// 	if (mapRef.current) {
	// 		mapRef.current.initMap();
	// 		const map = mapRef.current.leafletElement;
	// 		const bounds = new L.latLngBounds(defaultLocation);
	// 		map.flyToBounds(bounds, {
	// 			duration: 1,
	// 			padding: [50, 50],
	// 		});
	// 	}
	// };

	const getSearchResult = async (searchValue) => {
		try {
			setSearchLoading(true);
			const searchResponse = await axios.get(
				`https://nominatim.openstreetmap.org/search.php?q=${searchValue}&polygon_geojson=1&format=jsonv2`
			);
			const searchData = searchResponse.data;
			console.log("searchData", searchData);

			setFloatingSearchResult(searchData);
			setIsFloatingView(true);
			setSearchLoading(false);
		} catch (error) {
			console.error("Error occurred during search:", error);
			setFloatingSearchResult(null);
		}
	};

	const handleSidebarInputChange = (event) => {
		const { value } = event.target;
		setSidebarSearchValue(value);
		console.log(value);
	};

	// const onSidebarinputReset = () => {
	// 	setSidebarSearchValue("");
	// };

	const handleReset = () => {
		window.location.reload();
	};

	const handleLocationSelect = (location) => {
		console.log("selected location: ", location);
		// setFloatingSearchValue(location.display_name);
		setFloatingSearchValue("");
		setIsFloatingView(false);
		setSelectedLocation(location);
	};

	const { data: assetsData, isSuccess, isLoading, isError, refetch } = useGetAssetsQuery();

	const [coordinates, setCoordinates] = useState([]);

	useEffect(() => {
		console.log("-------coordinates: ", coordinates);
	}, [coordinates]);

	useEffect(() => {
		if (assetsData) {
			console.log("ASSETS DATA: ", assetsData);
			const geoCodes = assetsData.assets.map((item) => item.geoCode);
			setCoordinates(geoCodes);
		}
	}, [assetsData]);

	/* 	const coordinates = [
		[22.9236007, 89.66514873233909],
		[24.3715513, 88.5921038],
		[23.86685199521768, 89.98942565289326],
		[22.956882005444356, 91.3875731918961],
		[21.39956616828009, 92.0467528793961],
	]; */

	useEffect(() => {
		if (assetsData) {
			assetsData.assets.forEach((el) => {
				coordinates.push(el.geoCode);
			});
		}
	}, [assetsData]);

	const [closestAssets, setClosestAssets] = useState(null);

	const updateClosestLocations = (newClosestLocations) => {
		setClosestLocations(newClosestLocations);
	};

	useEffect(() => {
		console.log("closestLocations", closestLocations);
		if (closestLocations)
			if (closestLocations.length === ClosestLocationCount) {
				const aCoords = closestLocations.map((item) => item.coords);
				setClosestCoordinates(aCoords);

				const assets = assetsData.assets.filter((item) =>
					closestLocations.some(
						(location) => JSON.stringify(location.coords) === JSON.stringify(item.geoCode)
					)
				);
				setClosestAssets(assets);
			}
	}, [closestLocations]);

	useEffect(() => {
		console.log("------------------", closestAssets);
	}, [closestAssets]);

	const getAssetCardUi = (el, index, selected) => (
		<Card key={el._id} className="shadow-sm mt-2 mx-2" style={{ padding: "6px 8px" }}>
			<Card.Body style={{ padding: 0 }}>
				<div style={{ fontSize: "14px" }}>Unit No: {el.assetId}</div>
				<div style={{ fontSize: "14px" }}>Location: {el.location}</div>
				<div style={{ fontSize: "14px" }}>Driver: {el.assignedDrivers}</div>
				<div style={{ fontSize: "14px" }}>Phone: {el.contactNumber}</div>
				{selected && (
					<div style={{ fontSize: "14px", color: "red" }}>
						Distance:{" "}
						{closestLocations[index].routes.summary.totalDistance
							? (closestLocations[index].routes.summary.totalDistance * 0.000621371192).toFixed(2) +
							  "mi"
							: "Not Measured"}
					</div>
				)}
			</Card.Body>
		</Card>
	);

	return (
		<div>
			<div className="floating">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						gap: "10px",
					}}
					className="floating-card bg-white shadow-sm"
				>
					<input
						className="floating-search"
						type="text"
						placeholder="Search to get the closest units"
						value={floatingSearchValue}
						onChange={handleFloatingInputChange}
						onKeyDown={handleKeyPress}
					/>
					<button className="floating-reset-button" onClick={handleReset}>
						Reset
					</button>
				</div>
				{isFloatingView && searchLoading && <div style={{ color: "black" }}>Loading...</div>}
				{isFloatingView && !!floatingSearchResult?.length && (
					<div
						style={{
							position: "absolute",
							background: "white",
							width: "100%",
							padding: "4px 4px 4px 10px",
							borderRadius: "4px",
							marginTop: "2px",
						}}
					>
						{floatingSearchResult?.map((location) => (
							<div
								key={location.place_id}
								style={{
									display: "flex",
									gap: "10px",
									alignItems: "baseline",
								}}
							>
								<div style={{ marginTop: "2px" }}>
									<FontAwesomeIcon icon={faMapMarkerAlt} />
								</div>
								<div
									style={{ borderBottom: "1px solid #eaedf2", padding: "4px 0", cursor: "pointer" }}
									onClick={() => handleLocationSelect(location)}
								>
									{location.display_name}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			<Row style={{ padding: 0, margin: 0 }}>
				{/* TODO in mobile sidebar is hidden now; add a hambarger */}
				<Col sm={3} md={2} style={{ padding: 0 }}>
					{/* Sidebar Content */}
					<div style={{ marginTop: "10px" }} className="mb-4">
						<div className="d-flex align-items-center">
							<Form className="w-100 px-2">
								<Form.Group>
									<InputGroup>
										<InputGroup.Text>
											<FontAwesomeIcon icon={faSearch} />
										</InputGroup.Text>
										<Form.Control
											type="text"
											placeholder="Search"
											value={sidebarSearchValue}
											onChange={handleSidebarInputChange}
											style={{ height: "38px" }}
										/>
										{/* {sidebarSearchValue && (
											<div style={{ cursor: "pointer" }}>
												<FontAwesomeIcon onClick={onSidebarinputReset} icon={faTimes} />
											</div>
										)} */}
									</InputGroup>
								</Form.Group>
							</Form>
						</div>
					</div>

					{selectedLocation && (
						<>
							<Card className="shadow-sm mb-2 mx-2" style={{ padding: "6px 8px" }}>
								<Card.Body style={{ padding: 0 }}>
									<div style={{ fontSize: "14px" }}>
										{selectedLocation.display_name}{" "}
										<span style={{ color: "grey" }}>{selectedLocation.type}</span>
									</div>
									<div style={{ fontSize: "10px" }}>
										[{selectedLocation.lat} , {selectedLocation.lon}]
									</div>
								</Card.Body>
							</Card>
						</>
					)}

					{selectedLocation && <div style={{ margin: "0 8px" }}>Closest</div>}
					<div style={{ height: selectedLocation ? "76vh" : "90vh", overflowY: "scroll" }}>
						{selectedLocation && closestAssets?.map((el, index) => getAssetCardUi(el, index, true))}

						{!selectedLocation &&
							assetsData &&
							assetsData.assets.map((el, index) => getAssetCardUi(el, index, false))}
					</div>
				</Col>
				<Col sm={9} md={10} style={{ padding: 0 }}>
					<MapContainer
						center={defaultLocation}
						zoom={13}
						scrollWheelZoom={true}
						ref={mapRef}
						whenCreated={setMap}
					>
						{/* OPEN STREEN MAPS TILES */}
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						{/* WATERCOLOR CUSTOM TILES */}
						{/* <TileLayer
									attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
								/> */}
						{/* GOOGLE MAPS TILES */}
						{/* <TileLayer
									attribution="Google Maps"
									// url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
									// url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
									url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
									maxZoom={20}
									subdomains={["mt0", "mt1", "mt2", "mt3"]}
								/> */}

						{/* <LeafletGeocoder /> */}
						{/* {selectedLocation && <LeafletRoutingMachine selectedLocation={selectedLocation} />} */}
						<MapContent onClick={mapClicked} />

						{selectedLocation && (
							<LeafletRoutingMachine
								coordinates={coordinates}
								defaultLocation={selectedLocation}
								updateClosestLocations={updateClosestLocations}
								measureDistance={true}
							/>
						)}

						{coordinates.length && (
							<LeafletRoutingMachine
								coordinates={coordinates}
								defaultLocation={{
									lat: coordinates[0][0],
									lon: coordinates[0][1],
									display_name: "",
								}}
								updateClosestLocations={updateClosestLocations}
								measureDistance={true}
								defaultMark
							/>
						)}

						{closestCoordinates && (
							<LeafletRoutingMachine
								coordinates={closestCoordinates}
								defaultLocation={selectedLocation}
								measureDistance={false}
							/>
						)}

						{/* {selectedLocation && (
							<MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
								<Marker position={[selectedLocation.lat, selectedLocation.lon]} icon={customIcon}>
									<Popup>{selectedLocation.display_name}</Popup>
								</Marker>
							</MarkerClusterGroup>
						)} */}

						{/* {floatingSearchResult && (
							<MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
								{floatingSearchResult?.map((location) => {
									return (
										<Marker
											key={location.place_id}
											position={[Number(location.lat), Number(location.lon)]}
											icon={customIcon}
										>
											<Popup>{location.display_name}</Popup>
										</Marker>
									);
								})}
							</MarkerClusterGroup>
						)} */}
						{/* <Location /> */}

						{/* <LocationButton map={map} /> */}

						{/* <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
							{markers.map((marker) => (
								<Marker key={marker.geocode} position={marker.geocode} icon={customIcon}>
									<Popup>{marker.popUp}</Popup>
								</Marker>
							))}
						</MarkerClusterGroup> */}
					</MapContainer>
				</Col>
			</Row>
		</div>
	);
};

export default AssetsMap;
