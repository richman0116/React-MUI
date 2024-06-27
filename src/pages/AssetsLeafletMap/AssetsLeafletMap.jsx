import React, { useEffect, useRef, useState } from "react";
import {
	Grid,
	Card,
	TextField,
	FormControl,
	InputAdornment,
	CardContent,
	Typography,
	Tooltip,
	Box,
	CircularProgress,
	IconButton,
	ButtonGroup,
	Button,
	Grow,
	Paper,
	ClickAwayListener,
	MenuList,
	MenuItem,
	Popper,
} from "@mui/material";
import "./style.css";
import "leaflet/dist/leaflet.css";
import SearchIcon from "@mui/icons-material/Search";
import { useGetAssetsQuery } from "../../services/assets";
import globalUtils from "../../utils/globalUtils";
import PlacesAutocomplete from "../../components/PlacesAutocomplete";
import { AssetStatus, StandardRadiusMiles } from "../../shared/constants";
import dateUtils from "../../utils/dateUtils";
import { getAddressCoordinates } from "../../utils/getAddressCoordinates";
import {
	calculateDistance,
	formatDistance,
	formatDuration,
	getBatchDistances,
} from "../../utils/distanceDuration";
import MapGL, { Layer, Marker, NavigationControl, Popup, Source } from "react-map-gl";
import availableIcon from "../../assets/icons/available.svg";
import availableLocallyIcon from "../../assets/icons/available_locally.svg";
import notAvailableIcon from "../../assets/icons/not_available.svg";
import onHoldIcon from "../../assets/icons/on_hold.svg";
import outOfServiceIcon from "../../assets/icons/out_of_service.svg";
import availableOnIcon from "../../assets/icons/available_on.svg";
import locationIcon from "../../assets/icons/location.png";
import onOurLoad from "../../assets/icons/on_our_load.svg";
import { config } from "../../config";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import bbox from "@turf/bbox";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import { setBackDropOpen, setMapTheme } from "../../store/slice/globalSlice";
import Loader from "../../components/Loader/Loader";
import ProgressLoader from "../../components/ProgressLoader/ProgressLoader";
import { Refresh } from "@mui/icons-material";

const getCustomIcon = (status) => {
	switch (status) {
		case "available":
			return availableIcon;
		case "available_locally":
			return availableLocallyIcon;
		case "not_available":
			return notAvailableIcon;
		case "on_hold":
			return onHoldIcon;
		case "out_of_service":
			return outOfServiceIcon;
		case "available_on":
			return availableOnIcon;
		case "location":
			return locationIcon;
		case "on_our_load":
			return onOurLoad;
		default:
			return null; // Handle unknown status
	}
};

const initialPoint = {
	longitude: -95.7129,
	latitude: 39.0902,
	zoom: 3.7,
};

const AssetsLeafletMap = () => {
	const [sidebarSearchValue, setSidebarSearchValue] = useState("");
	const [selected, setSelected] = useState(null);
	const selectedIndex = useSelector((state) => state.global.mapTheme);
	const [radiusValue] = useState(StandardRadiusMiles);
	const [closestAssestData, setClosestAssetData] = useState([]);
	const mapRef = useRef();

	const [viewState, setViewState] = React.useState(initialPoint);

	const [popupInfo, setPopupInfo] = useState(null);

	const { data: assetsData, isFetching, refetch } = useGetAssetsQuery();

	const handleSidebarInputChange = (event) => {
		const { value } = event.target;
		setSidebarSearchValue(value);

		// Create a regular expression with the search value, ignoring case
		const regex = new RegExp(value, "i");

		// Filter assetsData based on the sidebarSearchValue
		const filteredData = assetsData.assets.filter((asset) => {
			// Check if asset status is NOT_AVAILABLE or OUT_OF_SERVICE
			if (
				asset.status === AssetStatus.NOT_AVAILABLE ||
				asset.status === AssetStatus.OUT_OF_SERVICE
			) {
				return false; // Skip assets with these statuses
			}

			// Check if any string property of the asset matches the regular expression
			return Object.values(asset).some((prop) => {
				if (typeof prop === "string") {
					return regex.test(prop);
				}
				return false;
			});
		});

		// Set the filtered data to closestAssetData
		setClosestAssetData(filteredData);
	};

	const [routes, setRoutes] = useState([]);

	useEffect(() => {
		if (selected && closestAssestData.length > 0) {
			const fetchRoutes = async () => {
				const routePromises = closestAssestData.map((asset) =>
					fetch(
						`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${selected.lon},${selected.lat};${asset.geoCode[1]},${asset.geoCode[0]}?steps=true&geometries=geojson&access_token=${config.MAPBOX_TOKEN}`
					).then((response) => response.json())
				);

				const routesData = await Promise.all(routePromises);
				setRoutes(routesData);
			};

			fetchRoutes();
		}
	}, [selected, closestAssestData]);

	useEffect(() => {
		if (assetsData && assetsData.assets) {
			setClosestAssetData(
				assetsData.assets.filter(
					(assetFil) =>
						assetFil.status !== AssetStatus.NOT_AVAILABLE &&
						assetFil.status !== AssetStatus.OUT_OF_SERVICE
				)
			);
		}
	}, [assetsData]);

	const getSortedAssetsByDistance = async (currentLocation, maxValue) => {
		const assetsWithinRadius = assetsData?.assets
			.filter(
				(ass) =>
					ass.status !== AssetStatus.NOT_AVAILABLE && ass.status !== AssetStatus.OUT_OF_SERVICE
			)
			.map((asset) => {
				const distance = calculateDistance(asset.geoCode, [
					currentLocation.lat,
					currentLocation.lon,
				]);
				return { ...asset, distance };
			})
			.filter((asset) => asset.distance <= Number(maxValue));

		const allUpdatedAsset = await (assetsWithinRadius.length
			? getBatchDistances(
					[currentLocation.lat, currentLocation.lon],
					assetsWithinRadius.slice(0, 15)
			  )
			: []);
		const finalAsset = allUpdatedAsset.filter((asset) => asset.distance <= Number(maxValue));

		const area = finalAsset.map((asset) => [asset.geoCode[1], asset.geoCode[0]]);

		area.push([currentLocation.lon, currentLocation.lat]);

		const longitudes = area.map((point) => point[0]);
		const latitudes = area.map((point) => point[1]);

		// Calculating the bounding box
		const minLng = Math.min(...longitudes);
		const maxLng = Math.max(...longitudes);
		const minLat = Math.min(...latitudes);
		const maxLat = Math.max(...latitudes);

		// Calling fitBounds with the bounding box and padding
		mapRef.current.fitBounds(
			[
				[minLng, minLat],
				[maxLng, maxLat],
			],
			{ padding: 300, duration: 1000 }
		);

		setClosestAssetData([...finalAsset]);
	};

	const [pins, setPins] = useState([]);

	useEffect(() => {
		const markers = closestAssestData.map((asset, index) => (
			<Marker
				key={`marker-${index}`}
				longitude={asset.geoCode[1]}
				latitude={asset.geoCode[0]}
				onClick={(e) => {
					e.originalEvent.stopPropagation();
					setPopupInfo(asset);
				}}
				offset={[0, -13]}
			>
				<img
					src={getCustomIcon(asset.status)}
					alt={asset.status}
					style={{ width: 38, height: asset.status === "on_our_load" ? 31 : 38, cursor: "pointer" }}
				/>
			</Marker>
		));

		if (selected) {
			markers.push(
				<Marker
					key={"selected-location"}
					longitude={selected.lon}
					latitude={selected.lat}
					offset={[0, -13]}
					onClick={(e) => {
						e.originalEvent.stopPropagation();
						setPopupInfo(selected);
					}}
				>
					<img
						src={getCustomIcon("location")}
						alt={"location"}
						style={{ width: 38, height: 38, cursor: "pointer" }}
					/>
				</Marker>
			);
		}

		setPins(markers);
	}, [closestAssestData, selected]);

	const [loading, setLoading] = useState(true);
	const [mapLoading, setMapLoading] = useState(true);

	useEffect(() => {
		if (assetsData) {
			setLoading(false);
		}
	}, [assetsData]);
	const dispatch = useDispatch();

	useEffect(() => {
		const timer = setInterval(() => {
			if (!loading && mapRef) {
				dispatch(setMapTheme(0));
				setMapLoading(false);
				clearTimeout(timer);
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [loading, mapRef]);

	if (loading) return <Loader />;

	return (
		<>
			<div className="floating">
				<PlacesAutocompleteFunction
					setSelected={setSelected}
					getSortedAssetsByDistance={getSortedAssetsByDistance}
					radiusValue={radiusValue}
					setClosestAssetData={setClosestAssetData}
					assetsData={assetsData}
					mapRef={mapRef}
					setPopupInfo={setPopupInfo}
					refetch={refetch}
					isFetching={isFetching}
				/>
			</div>
			<Grid container>
				<Grid item xs={3} md={2} style={{ backgroundColor: "#f5f8fb", zIndex: 1000 }}>
					{!selected && (
						<div style={{ marginTop: "20px", marginBottom: "20px" }}>
							<div className="flex-container">
								<div className="width-100" style={{ padding: "0 8px" }}>
									{/* TODO Search and get the units / also mark in maps */}
									<FormControl>
										<TextField
											size="small"
											variant="outlined"
											onChange={handleSidebarInputChange}
											// onKeyUp={handleSearch}
											placeholder="Search"
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<SearchIcon />
													</InputAdornment>
												),
											}}
										/>
									</FormControl>
								</div>
							</div>
						</div>
					)}

					{selected && (
						<Typography variant="button">
							<div style={{ margin: "0 8px" }}>
								{closestAssestData && closestAssestData.length
									? `Closest Units(${StandardRadiusMiles} miles)`
									: `No closest units found between ${StandardRadiusMiles} miles`}
							</div>
						</Typography>
					)}
					<div
						style={{
							height: selected ? "87vh" : "90vh",
							overflowY: "scroll",
							paddingBottom: "20px",
						}}
					>
						{closestAssestData?.map((asset) =>
							getAssetCardUi(asset, selected ? true : false, mapRef, setPopupInfo, true)
						)}
					</div>
				</Grid>
				<Grid item xs={9} md={10}>
					<MapGL
						id={selectedIndex === 0 ? "light-map" : "dark-map"}
						ref={mapRef}
						mapLib={import("mapbox-gl")}
						mapboxAccessToken={config.MAPBOX_TOKEN}
						{...viewState}
						onMove={(evt) => setViewState(evt.viewState)}
						style={
							mapLoading
								? { width: "100%", height: "100vh", visibility: "hidden" }
								: { width: "100%", height: "100vh" }
						}
						mapStyle={
							selectedIndex === 1
								? "mapbox://styles/alexbbbeff/cltzxnw9j009m01pr8jnx5bph"
								: "mapbox://styles/alexbbbeff/cltzvomvx00jp01qs9rh71bp0"
						}
					>
						{pins}

						{selected &&
							routes.map((route, index) => (
								<Source key={`route-${index}`} type="geojson" data={route.routes[0].geometry}>
									<Layer
										type="line"
										paint={{
											"line-color": "#77a8e3",
											"line-width": 5,
										}}
									/>
								</Source>
							))}

						{popupInfo && (
							<>
								<Popup
									longitude={Number(popupInfo.address ? popupInfo.lon : popupInfo.geoCode[1])}
									latitude={Number(popupInfo.address ? popupInfo.lat : popupInfo.geoCode[0])}
									closeButton={false}
									tipSize={0}
									offset={[1.3, -19]}
									onClose={() => setPopupInfo(null)}
								>
									{getAssetCardUi(popupInfo, true, mapRef, setPopupInfo, false)}
								</Popup>
							</>
						)}

						{/* Navigation Control */}
						<div style={{ position: "absolute", top: 10, right: 10 }}>
							<NavigationControl />
						</div>
					</MapGL>
					{mapLoading && (
						<div>
							<ProgressLoader />
						</div>
					)}
				</Grid>
			</Grid>
		</>
	);
};

export default AssetsLeafletMap;

const PlacesAutocompleteFunction = ({
	setSelected,
	getSortedAssetsByDistance,
	radiusValue,
	setClosestAssetData,
	assetsData,
	mapRef,
	setPopupInfo,
	isFetching,
	refetch,
}) => {
	const setInitial = () => {
		setClosestAssetData(
			assetsData.assets.filter(
				(assetFil) =>
					assetFil.status !== AssetStatus.NOT_AVAILABLE &&
					assetFil.status !== AssetStatus.OUT_OF_SERVICE
			)
		);
		setSelected(null);
		if (mapRef && mapRef.current) {
			mapRef.current.flyTo({
				center: [initialPoint.longitude, initialPoint.latitude],
				zoom: initialPoint.zoom,
			});
		}
	};

	const handleSelect = async (event, value) => {
		setPopupInfo(null);
		if (value) {
			dispatch(setBackDropOpen(true));
			setClosestAssetData([]);
			let lat = value.lat;
			let lon = value.lon;
			if (!lat || !lon) {
				const cord = await getAddressCoordinates(value.display_name);
				lat = cord.lat;
				lon = cord.lng;
			}
			setSelected({ lat, lon, address: value.display_name });
			await getSortedAssetsByDistance({ lat, lon, address: value.display_name }, radiusValue);
			dispatch(setBackDropOpen(false));
		} else {
			setInitial();
		}
	};

	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);
	const selectedIndex = useSelector((state) => state.global.mapTheme);
	const options = ["Light", "Dark"];

	const dispatch = useDispatch();

	const handleClick = () => {
		// console.info(`You clicked ${options}`);
	};

	const handleMenuItemClick = (event, index) => {
		dispatch(setMapTheme(index));
		setOpen(false);
	};

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	return (
		<div className="floating-card">
			<div></div>
			<Box sx={{ width: "400px", margin: "0 auto", backgroundColor: "white", borderRadius: "3px" }}>
				<PlacesAutocomplete
					handleAutocompleteChange={handleSelect}
					placeholder="Search to get the closest units"
					theme={selectedIndex === 1 ? "dark" : "light"}
				/>
			</Box>
			<div style={{ marginLeft: "57%", width: "fit-content" }}>
				<Tooltip title="Reload Data" placement="left">
					<IconButton
						onClick={() => {
							refetch();
							setInitial();
						}}
						color="primary"
						size="small"
						sx={{ marginRight: "8px", backgroundColor: "#FFF", borderRadius: "4px" }}
					>
						{isFetching ? (
							<CircularProgress size={20} color="primary" />
						) : (
							<Refresh fontSize="medium" />
						)}
					</IconButton>
				</Tooltip>
				<ButtonGroup
					variant="contained"
					ref={anchorRef}
					aria-label="Button group with a nested menu"
					sx={{ backgroundColor: "#FFFFFF", color: "#000000" }}
					className="grp-map-btn"
				>
					<Button
						className="map-btn"
						sx={{ backgroundColor: "#FFFFFF", color: "#000000" }}
						onClick={handleClick}
					>
						{options[selectedIndex]}
					</Button>
					<Button
						className="map-btn"
						sx={{ backgroundColor: "#FFFFFF", color: "#000000" }}
						size="small"
						aria-controls={open ? "split-button-menu" : undefined}
						aria-expanded={open ? "true" : undefined}
						aria-label="select merge strategy"
						aria-haspopup="menu"
						onClick={handleToggle}
					>
						<ArrowDropDownIcon />
					</Button>
				</ButtonGroup>

				<Popper
					sx={{
						zIndex: 1,
						backgroundColor: "#FFFFFF",
						color: "#000000",
					}}
					open={open}
					anchorEl={anchorRef.current}
					role={undefined}
					transition
					disablePortal
					className="map-btn"
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin: placement === "bottom" ? "center top" : "center bottom",
							}}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList id="split-button-menu" autoFocusItem>
										{options.map((option, index) => (
											<MenuItem
												key={option}
												disabled={index === 2}
												selected={index === selectedIndex}
												onClick={(event) => handleMenuItemClick(event, index)}
											>
												{option}
											</MenuItem>
										))}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</div>
		</div>
	);
};

const getAssetCardUi = (asset, selected, mapRef, setPopupInfo, side) => (
	<Card
		key={asset._id ? asset._id : asset.address}
		style={{
			margin: "4px 4px 0 4px",
			border: ".0625rem solid rgba(55,65,81,.125)",
			boxShadow: "0 2px 18px rgba(0,0,0,.02)!important",
		}}
		elevation={0}
	>
		{asset._id ? (
			<CardContent style={{ padding: "6px 8px" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						paddingBottom: "4px",
						alignItems: "center",
					}}
				>
					<div
						style={{
							fontSize: "16px",
							fontWeight: "600",
							// color: `${globalUtils.getAssetStatusColor(asset.status)}`,
						}}
					>
						{asset.assetId}
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "5px",
						}}
					>
						<span
							style={{
								background: `${globalUtils.getAssetStatusColor(asset.status)}`,
								color: "white",
								borderRadius: 4,
								padding: "2px 4px",
								fontSize: "13px",
							}}
						>
							{globalUtils.snakeCaseToCapitalize(asset.status)}
						</span>
						<span>
							{side && (
								<Tooltip title="Explore">
									<KeyboardDoubleArrowRightIcon
										style={{
											cursor: "pointer",
											fontSize: "32px",
											opacity: "0.5",
											marginTop: "3px",
										}}
										className="go-to-loc"
										onClick={() => {
											if (mapRef.current && asset.geoCode) {
												setPopupInfo(asset);
												const [minLng, minLat, maxLng, maxLat] = bbox({
													type: "Point",
													coordinates: [asset.geoCode[1], asset.geoCode[0]], // [lng, lat] format
												});

												mapRef.current.fitBounds(
													[
														[minLng, minLat],
														[maxLng, maxLat],
													],
													{
														padding: 20,
														maxZoom: 7,
													}
												);
											}
										}}
									/>
								</Tooltip>
							)}
						</span>
					</div>
				</div>
				{asset.status === AssetStatus.AVAILABLE_ON && (
					<div style={{ fontSize: "14px" }}>
						<span>Available on: </span>
						<span style={{ fontWeight: "700" }}>{dateUtils.defaultDate(asset.availableDate)}</span>
					</div>
				)}
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
						<span style={{ fontWeight: "700" }}>Address: </span>
						<a
							href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
								asset.location
							)}`}
							style={{ textDecoration: "none", display: "inline" }}
							target="_blank"
							rel="noopener noreferrer"
						>
							<div style={{ color: "mediumblue", fontWeight: "500", display: "inline" }}>
								{asset.location}
							</div>
						</a>
					</div>
					<div>
						<span style={{ fontWeight: "700" }}>Dims: </span>
						<span>{asset.dimension}</span>
					</div>
					<div>
						<span style={{ fontWeight: "700" }}>Weight: </span>
						<span>{asset.weight}</span>
					</div>
				</span>
				{selected && (
					<>
						<div style={{ fontSize: "14px" }}>
							<div>
								<span style={{ fontWeight: "700" }}>Distance: </span>
								<span>{formatDistance(asset.distance)}</span>
							</div>
						</div>
						<div style={{ fontSize: "14px" }}>
							<div>
								<span style={{ fontWeight: "700" }}>Duration: </span>
								<span>{formatDuration(asset.duration)}</span>
							</div>
						</div>
					</>
				)}
				{asset.notes && asset.notes.length && (
					<div>
						<span style={{ fontWeight: "700" }}>Notes: </span>
						<span style={{ fontSize: "12px" }}>{asset?.notes}</span>
					</div>
				)}
			</CardContent>
		) : (
			<CardContent style={{ padding: "6px 8px" }}>
				<p>{asset.address}</p>
			</CardContent>
		)}
	</Card>
);
