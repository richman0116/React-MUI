import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import {
	GoogleMap,
	useLoadScript,
	Marker,
	MarkerClusterer,
	DirectionsRenderer,
	InfoWindow,
	Circle,
} from "@react-google-maps/api";
import { ClosestLocationCount } from "../../shared/constants";
import { Autocomplete, TextField } from "@mui/material";
import "./style.css";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Row, Col, Form, InputGroup, Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSearch, faBus, faL } from "@fortawesome/free-solid-svg-icons";
import { useGetAssetsQuery } from "../../services/assets";
import globalUtils from "../../utils/globalUtils";
import selectedPinUrl from "../../assets/icons/rsz_pin.png";
import { config } from "../../config";

const defaultCircleOptions = {
	strokeOpacity: 0.5,
	strokeWeight: 2,
	clickable: false,
	draggable: false,
	editable: false,
	visible: true,
};

const closeCircleOptions = {
	...defaultCircleOptions,
	zIndex: 3,
	fillOpacity: 0.05,
	strokeColor: "#8BC34A",
	fillColor: "#8BC34A",
};

const getAssetCardUi = (asset, selected) => (
	<Card key={asset._id} className="shadow-sm mt-1 mx-1" style={{ padding: "6px 8px" }}>
		<Card.Body style={{ padding: 0 }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					paddingBottom: "4px",
					fontSize: "16px",
				}}
			>
				<div style={{ fontWeight: "700" }}>{asset.assetId}</div>
				<div>
					<span className={globalUtils.getAssetStatusColor(asset.status)}>
						{globalUtils.snakeCaseToCapitalize(asset.status)}
					</span>
				</div>
			</div>
			<span style={{ fontSize: "14px" }}>
				<div>
					<span style={{ fontWeight: "700" }}>Driver: </span>
					<span>{asset.assignedDrivers}</span>
				</div>
				<div>
					<span style={{ fontWeight: "700" }}>Ph: </span>
					<span>{asset.contactNumber}</span>
				</div>
				<div>
					<span style={{ fontWeight: "700" }}>Address:</span>
					<span>{asset.location}</span>
				</div>
				<div>
					<span style={{ fontWeight: "700" }}>Dims:</span>
					<span>{asset.dimension}</span>
				</div>
				<div>
					<span style={{ fontWeight: "700" }}>Weight:</span>
					<span>{asset.weight}</span>
				</div>
			</span>
			{selected && (
				<div style={{ fontSize: "14px" }}>
					<div>
						<span style={{ fontWeight: "700" }}>Distance: </span>
						<span>{asset.directionResult.routes[0].legs[0].distance.text || "Not Measured"}</span>
					</div>
					<div>
						<span style={{ fontWeight: "700" }}>Duration: </span>
						<span>{asset.directionResult.routes[0].legs[0].duration.text || "Not Measured"}</span>
					</div>
				</div>
			)}
		</Card.Body>
	</Card>
);

function AsesetsMapExtend() {
	const [libraries] = useState(["places"]);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: config.googleMapApiKey,
		libraries,
	});

	if (!isLoaded) return <div>Loading...</div>;
	return <Map />;
}

export default AsesetsMapExtend;

function Map() {
	const mapRef = useRef();
	const center = useMemo(() => ({ lat: 29.7604267, lng: -95.3698028 }), []);
	const [sidebarSearchValue, setSidebarSearchValue] = useState("");
	const options = useMemo(
		() => ({
			disableDefaultUI: true,
			clickableIcon: false,
		}),
		[]
	);

	const [selected, setSelected] = useState(null);

	const onLoad = useCallback((map) => (mapRef.current = map), []);

	const { data: assetsData } = useGetAssetsQuery();

	const handleSidebarInputChange = (event) => {
		const { value } = event.target;
		setSidebarSearchValue(value);
		console.log(value);
	};

	// DIRECTIONS
	const [directions, setdirections] = useState(null);
	const [closestAssets, setclosestAssets] = useState(null);

	const sortAssetDataByDistanceAsc = (results) => {
		const assestsDataWithDirection = assetsData.assets.map((asset, index) => ({
			...asset,
			directionResult: results[index],
		}));
		console.log("assestsDataWithDirection", assestsDataWithDirection);

		const sortedAssestsDataByDistance = [...assestsDataWithDirection].sort((a, b) => {
			const distanceA = a.directionResult
				? a.directionResult.routes[0].legs[0].distance.value
				: null;
			const distanceB = b.directionResult
				? b.directionResult.routes[0].legs[0].distance.value
				: null;

			if (distanceA === null && distanceB === null) {
				return 0; // equivalent
			} else if (distanceA === null) {
				return 1; // place `a` at the end
			} else if (distanceB === null) {
				return -1; // place `b` at the end
			} else {
				return distanceA - distanceB;
			}
		});
		console.log("sortedAssestsDataByDistance", sortedAssestsDataByDistance);

		const filtered250mileDistance = sortedAssestsDataByDistance.filter(
			(item) => item.directionResult.routes[0].legs[0].distance.value <= 402336
		);

		const extractedDirectionsResults = filtered250mileDistance.map((item) => item.directionResult);

		setdirections(extractedDirectionsResults.slice(0, ClosestLocationCount));
		setclosestAssets(filtered250mileDistance.slice(0, ClosestLocationCount));
	};

	const fetchDirections = () => {
		if (!selected) return;

		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService();
		const requests =
			assetsData &&
			assetsData.assets?.map((asset) => {
				return {
					origin: selected,
					destination: { lat: asset.geoCode[0], lng: asset.geoCode[1] },
					// eslint-disable-next-line no-undef
					travelMode: google.maps.TravelMode.DRIVING,
				};
			});
		const directionsRequests = requests.map(
			(request) =>
				new Promise((resolve, reject) => {
					directionsService.route(request, (result, status) => {
						// eslint-disable-next-line no-undef
						if (status === google.maps.DirectionsStatus.OK) {
							resolve(result);
						} else {
							reject(status);
						}
					});
				})
		);

		Promise.all(directionsRequests)
			.then((results) => {
				if (results.length === assetsData.assets.length) sortAssetDataByDistanceAsc(results);
			})
			.catch((error) => {
				console.error("Directions request failed:", error);
			});
	};

	useEffect(() => {
		console.log("SELECTED: ", selected);
		if (selected) fetchDirections();
	}, [selected]);

	// SELECTED MARKER
	const [selectedMarker, setSelectedMarker] = useState(null);
	const originMarkerIcon = useMemo(
		() => ({
			url: selectedPinUrl, // Replace with the URL of your custom icon
			scaledSize: new window.google.maps.Size(30, 30), // Adjust the size as needed
			origin: new window.google.maps.Point(0, 0),
			anchor: new window.google.maps.Point(15, 15),
		}),
		[]
	);

	return (
		<>
			<div className="floating">
				<PlacesAutocompleteFunction
					setSelected={(position) => {
						setSelected(position);
						if (position) mapRef.current?.panTo(position);
						else setdirections(null);
					}}
				/>
			</div>
			<Row style={{ padding: 0, margin: 0 }}>
				<Col sm={3} md={2} style={{ padding: 0 }}>
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

					{/* {selected && (
						<>
							<Card className="shadow-sm mb-2 mx-2" style={{ padding: "6px 8px" }}>
								<Card.Body style={{ padding: 0 }}>
									<div style={{ fontSize: "14px" }}>
										{selected.description} <span style={{ color: "grey" }}>{selected.type}</span>
									</div>
									<div style={{ fontSize: "10px" }}>
										[{selected.lat} , {selected.lng}]
									</div>
								</Card.Body>
							</Card>
						</>
					)} */}

					{selected && (
						<div
							style={{ margin: "0 8px", fontWeight: "600", borderBottom: "1px solid #ededed" }}
							className="text-primary"
						>
							Closest Units (250 mi)
						</div>
					)}
					<div style={{ height: selected ? "87vh" : "90vh", overflowY: "scroll" }}>
						{selected && closestAssets?.map((asset) => getAssetCardUi(asset, true))}

						{!selected &&
							assetsData &&
							assetsData.assets.map((asset) => getAssetCardUi(asset, false))}
					</div>
				</Col>
				<Col sm={9} md={10} style={{ padding: 0 }}>
					<GoogleMap
						zoom={4}
						center={center}
						mapContainerStyle={{ height: "100vh" }}
						options={options}
						onClick={() => setSelectedMarker(null)}
						onLoad={onLoad}
					>
						{assetsData && (
							<MarkerClusterer>
								{(clusterer) =>
									assetsData.assets.map((asset) => (
										<Marker
											key={asset.geoCode[0]}
											position={{ lat: asset.geoCode[0], lng: asset.geoCode[1] }}
											clusterer={clusterer}
											onClick={() => setSelectedMarker(asset)}
										>
											{selectedMarker?.assetId === asset?.assetId && (
												<InfoWindow
													position={{
														lat: selectedMarker.geoCode[0],
														lng: selectedMarker.geoCode[1],
													}}
													onCloseClick={() => setSelectedMarker(null)}
												>
													{/* Customize the content of the popover */}
													{/* <div>
														<h3>Custom Popover Content</h3>
														<p>This is a custom popover that appears when the marker is clicked.</p>
													</div> */}
													{getAssetCardUi(selectedMarker, false)}
												</InfoWindow>
											)}
										</Marker>
									))
								}
							</MarkerClusterer>
						)}

						{selected && !directions?.length && (
							<Marker position={selected} icon={selectedPinUrl} scaledSize={(38, 38)} />
						)}

						{/* default radius 250miles/ into meters */}
						{selected && <Circle center={selected} radius={402336} options={closeCircleOptions} />}

						{directions?.map((direction, index) => (
							<>
								<DirectionsRenderer
									key={index}
									directions={direction}
									options={{
										suppressMarkers: true,
										polylineOptions: {
											// zIndex: 50,
											strokeColor: "#1976D2",
											strokeWeight: 5,
										},
									}}
								/>
								{/* if it's origin; then show different marker */}
								{direction?.routes[0]?.legs[0] && (
									<Marker
										position={{
											lat: direction.routes[0].legs[0].start_location.lat(),
											lng: direction.routes[0].legs[0].start_location.lng(),
										}}
										icon={originMarkerIcon}
									/>
								)}
							</>
						))}
					</GoogleMap>
				</Col>
			</Row>
		</>
	);
}

const PlacesAutocompleteFunction = ({ setSelected }) => {
	const {
		suggestions: { data },
		setValue,
	} = usePlacesAutocomplete();

	const handleInput = (e) => {
		setValue(e.target.value);
	};

	const handleSelect = async (address) => {
		console.log("selected address: ", address);
		if (address) {
			setValue(address, false);
			try {
				const results = await getGeocode({ address });
				const { lat, lng } = await getLatLng(results[0]);
				console.log("lat lng", lat, lng);
				setSelected({ lat, lng });
			} catch (error) {
				console.log("Error:", error);
			}
		} else {
			setSelected(null);
		}
	};

	return (
		<>
			<Autocomplete
				className="floating-card"
				size="small"
				options={data.map((suggestion) => suggestion.description)}
				onChange={(e, value) => handleSelect(value)}
				onInputChange={handleInput}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Search to get the closest units"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</>
	);
};
