import {
	Box,
	Step,
	StepButton,
	Stepper,
	StepConnector,
	stepConnectorClasses,
	StepLabel,
	Grid,
	Card,
	CardContent,
	FormControlLabel,
	Switch,
	TextField,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	Typography,
	Stack,
	FormHelperText,
	Chip,
	CircularProgress,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
	DirectionsCarFilledOutlined,
	DirectionsBusFilledOutlined,
	LocalShippingOutlined,
	LocationOnOutlined,
	LocationOffOutlined,
	FlightOutlined,
	HotelOutlined,
	LocalShipping,
	SendTimeExtension,
	AccessTimeFilled,
	Send,
	Delete,
	Download,
	Verified,
} from "@mui/icons-material";
import styled from "styled-components";
import PropTypes from "prop-types";
import { config } from "../../config";

import PlacesAutocomplete from "../../components/PlacesAutocomplete";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { Controller, useForm } from "react-hook-form";
import { getAddressCoordinates } from "../../utils/getAddressCoordinates";
import dayjs from "dayjs";
import { generatedHtmlCustomer } from "./generateHtmlCustomer";
import {
	useDeleteFilesMutation,
	useLazyGetQuotesQuery,
	useSendCustomerMailMutation,
	useUpdateHistoryLoadMutation,
	useUpdateLoadGoodToGoMutation,
	useUpdateOrderMutation,
} from "../../services/load";
import { useGetMeQuery } from "../../services/user";
import polyline from "@mapbox/polyline";
import ProgressLoader from "../../components/ProgressLoader/ProgressLoader";
import { toast } from "react-toastify";
import { LoadStatusTracking } from "../../shared/constants";
import { useSelector } from "react-redux";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { generateUniqueId } from "../../utils/unique";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistance, formatDuration } from "../../utils/distanceDuration";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

function createData(note, time, key) {
	return { note, time, key };
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 22,
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			backgroundImage:
				"linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			backgroundImage:
				"linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		height: 3,
		border: 0,
		backgroundColor: "#eaeaf0",
		borderRadius: 1,
	},
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
	backgroundColor: "#ccc",
	zIndex: 1,
	color: "#fff",
	width: 50,
	height: 50,
	display: "flex",
	borderRadius: "50%",
	justifyContent: "center",
	alignItems: "center",
	...(ownerState.active && {
		backgroundImage:
			"linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
		boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
	}),
	...(ownerState.completed && {
		backgroundImage:
			"linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
	}),
}));

function ColorlibStepIcon(props) {
	const { active, completed, className } = props;

	const icons = {
		1: <DirectionsCarFilledOutlined />,
		2: <DirectionsBusFilledOutlined />,
		3: <LocalShippingOutlined />,
		4: <LocationOnOutlined />,
		5: <LocationOffOutlined />,
		6: <FlightOutlined />,
		7: <HotelOutlined />,
	};

	return (
		<ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
			{icons[String(props.icon)]}
		</ColorlibStepIconRoot>
	);
}

ColorlibStepIcon.propTypes = {
	/**
	 * Whether this step is active.
	 * @default false
	 */
	active: PropTypes.bool,
	className: PropTypes.string,
	/**
	 * Mark the step as completed. Is passed to child components.
	 * @default false
	 */
	completed: PropTypes.bool,
	/**
	 * The label displayed in the step icon.
	 */
	icon: PropTypes.node,
};

const steps = LoadStatusTracking;
// { currentData, setValue, errors, setIsDirty }
const TrackModal = ({ currentData, setCurrentData }) => {
	const { data: me } = useGetMeQuery();
	const [activeStep, setActiveStep] = React.useState(0);
	const [completed, setCompleted] = React.useState({});

	const [sentCustomer, { isLoading: isLoadingCustomerSent }] = useSendCustomerMailMutation();
	const [currentCode, setCurrentCode] = useState(null);
	const [mapSrc, setMapSrc] = useState(null);
	const [mapSrcLoading, setMapSrcLoading] = useState(false);
	const [updateOrder, { isLoading: isLoadingUpdate }] = useUpdateHistoryLoadMutation();
	const [triggerLoads] = useLazyGetQuotesQuery();
	const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQuery);
	const { data: currentUser } = useGetMeQuery();
	const [deleteFiles] = useDeleteFilesMutation();
	const [updateLoadData, { isLoading: isLoadingRealLoadUpdate }] = useUpdateOrderMutation();
	const [updateIsGoodToGo, { isFetching: isFetchingGoodToGo }] = useUpdateLoadGoodToGoMutation();

	const {
		register: registerST,
		handleSubmit: handleSubmitST,
		reset: resetST,
		setValue: setValueST,
		formState: { errors: errorsST },
		watch: watchST,
		control: controlST,
	} = useForm({
		defaultValues: {
			type: "location",
		},
	});

	const [statusHistory, setStatusHistory] = useState(
		currentData.statusHistory && currentData.statusHistory.length
			? currentData.statusHistory
			: [
					{
						note: "Load created at",
						time: `${formatDate(currentData.createdAt)} ${formatTime(currentData.createdAt)}`,
						type: "creation",
					},
			  ]
	);

	// const fetchRoutes = async (from, to) => {	 // 	try {
	// 		const response = await axios.get(
	// 			`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${from.lon},${from.lat};${to.lon},${to.lat}?steps=true&geometries=geojson&access_token=${config.MAPBOX_TOKEN}`
	// 		);
	// 		return response;
	// 	} catch (error) {
	// 		throw new Error(`Error fetching routes: ${error.message}`);
	// 	}
	// };

	const updateLoad = async (data) => {
		try {
			let res = await updateOrder({ id: currentData._id, payload: data }).unwrap();
			console.log(res);
			if (res.load) {
				setCurrentData((prevData) => ({
					...prevData,
					status: res.load.status,
					statusHistory: res.load.statusHistory,
				}));

				if (res.load.statusHistory) setStatusHistory(res.load.statusHistory);
			}
			toast("Tracking updated successfully!");
		} catch (error) {
			console.log(error);
		} finally {
			if (data.note || data.currentLocationCode) resetST();
			triggerLoads(lastLoadsQuery);
		}
	};

	const resetNote = () => {
		resetST({
			currentLocationText: "",
			note: "",
			type: "location",
			currentLocationCode: "",
		});
		setCurrentLocation(true);
	};

	const [rows, setRows] = useState([]);

	useEffect(() => {
		const crows = statusHistory.map((history) => {
			return createData(
				history.type === "location"
					? `Location Updated: ${history.currentLocationText}`
					: history.note,
				history.time,
				history.key
			);
		});

		setRows(crows);
	}, [statusHistory]);

	const [estOpt, setEstOpt] = useState({ duration: 0, distance: 0 });
	const [leftOpt, setLeftOpt] = useState({ duration: 0, distance: 0 });

	const [isLoadingFileUpload, setIsLoadingFileUpload] = useState(false);

	// const [currentStatus, setCurrentStatus] = React.useState(currentData.status);

	const handleSentCustomer = async () => {
		const html = generatedHtmlCustomer(currentData, me.user, mapSrc);
		let email = "";
		if (currentData.customer) {
			if (currentData.customer.representatives && currentData.customer.representatives.length) {
				email = currentData.customer.representatives[0].email;
			} else if (currentData.customer.customerEmail && currentData.customer.customerEmail.length) {
				email = currentData.customer.customerEmail;
			}
		}
		try {
			if (email.length > 0) {
				const response = await sentCustomer({ id: currentData._id, body: { html, email } });
				console.log("Email sent successfully:", response.data);
				toast("Email sent successfully!");
			} else {
				toast("Customer email not found!");
			}
		} catch (error) {
			console.error("Error sending email:", error);
		}
	};

	const fetchDistanceToCurrentCode = async (currentCode, lon2, lat2) => {
		if (!currentCode) return 0;
		const response = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${currentCode[1]},${currentCode[0]};${lon2},${lat2}?geometries=geojson&access_token=${config.MAPBOX_TOKEN}`
		);
		const data = await response.json();
		if (data.routes && data.routes.length > 0) {
			const route = data.routes[0];
			setLeftOpt({ distance: route.distance, duration: route.duration });
		}
	};

	const fetchRoute = async () => {
		setMapSrcLoading(true);
		const { username, style_id, lon1, lat1, lon2, lat2, width, height } = {
			username: "alexbbbeff",
			style_id: "cltzvomvx00jp01qs9rh71bp0",
			lon1: currentData.pickUpList[0].geoCodePick[1],
			lat1: currentData.pickUpList[0].geoCodePick[0],
			lon2: currentData.destinationList[0].geoCodeDes[1],
			lat2: currentData.destinationList[0].geoCodeDes[0],
			width: 800,
			height: 400,
		};
		let waypoints;
		if (currentCode) {
			await fetchDistanceToCurrentCode(currentCode, lon2, lat2);
			waypoints = `${lon1},${lat1};${currentCode[1]},${currentCode[0]};${lon2},${lat2}`;
		} else {
			waypoints = `${lon1},${lat1};${lon2},${lat2}`;
		}

		const response = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?steps=true&geometries=geojson&access_token=${config.MAPBOX_TOKEN}`
		);
		const data = await response.json();

		if (data.routes && data.routes.length > 0) {
			const route = data.routes[0];
			setEstOpt({ distance: route.distance, duration: route.duration });
			if (!currentCode) setLeftOpt({ distance: route.distance, duration: route.duration });
			const coordinates = route.geometry.coordinates.map((coord) => [coord[1], coord[0]]);
			const encodedPolyline = polyline.encode(coordinates);
			const mapSrc = `https://api.mapbox.com/styles/v1/${username}/${style_id}/static/pin-l-p+fd7e14(${lon1},${lat1}),pin-l-d+6f42c1(${lon2},${lat2})${
				currentCode ? `,pin-l-c+28a745(${currentCode[1]},${currentCode[0]})` : ""
			},path-5+1D85E1-0.5(${encodeURIComponent(
				encodedPolyline
			)})/auto/${width}x${height}?padding=50,20,20&access_token=${config.MAPBOX_TOKEN}`;
			setMapSrc(mapSrc);
			setMapSrcLoading(false);
		} else {
			setMapSrcLoading(false);
		}
	};

	useEffect(() => {
		fetchRoute();
	}, [currentCode]);

	const generateStepObject = (step) => {
		const stepObject = {};
		for (let i = 0; i <= step; i++) {
			stepObject[i] = true;
		}
		return stepObject;
	};

	const handleStep = (step) => {
		const stepObject = generateStepObject(step);
		setCompleted(stepObject);
		setActiveStep(step);
		// setCurrentStatus(LoadStatusTracking[step]);
		const formattedTime = dayjs.tz(dayjs(), "America/New_York").format("MM/DD/YYYY, hh:mm A");
		const dt = {
			type: "status",
			time: formattedTime,
			status: LoadStatusTracking[step],
			note: `Status Updated: ${LoadStatusTracking[step]}`,
			key: generateUniqueId(),
			createdBy: {
				id: currentUser.user._id,
				name: currentUser.user.name,
			},
		};
		updateLoad({ status: LoadStatusTracking[step], statusHistory: [dt, ...statusHistory] });
	};

	const handleStepInit = (step) => {
		const stepObject = generateStepObject(step);
		setCompleted(stepObject);
		setActiveStep(step);
		// setCurrentStatus(LoadStatusTracking[step]);
	};

	const [currentLocation, setCurrentLocation] = useState(true);

	const handleSwitchChange = () => {
		setValueST("type", !currentLocation ? "location" : "note");
		setCurrentLocation(!currentLocation);
	};

	const handleAutocompleteChange = async (event, newValue) => {
		let lat = newValue.lat;
		let lon = newValue.lon;
		if (!lat || !lon) {
			const cord = await getAddressCoordinates(newValue.display_name);
			lat = cord.lat;
			lon = cord.lng;
		}
		setValueST("currentLocationCode", [lat, lon]);
		setValueST("currentLocationText", newValue.display_name, {
			shouldValidate: true,
		});

		// setValueST("note", `Location Updated: ${newValue.display_name}`, {
		// 	shouldValidate: true,
		// });
	};

	const updateHistory = async (data) => {
		const formattedTime = dayjs.tz(dayjs(), "America/New_York").format("MM/DD/YYYY, hh:mm A");
		data.time = formattedTime;
		data.key = generateUniqueId();
		if (data.type === "location") {
			data.note =
				!data.note || (data.note && data.note.length === 0)
					? `Location Updated: ${data.currentLocationText}`
					: data.note;
		}
		data.createdBy = {
			id: currentUser.user._id,
			name: currentUser.user.name,
		};
		const finalData = [data, ...statusHistory];
		await updateLoad({ statusHistory: finalData });
		resetNote();
	};

	useEffect(() => {
		handleStepInit(LoadStatusTracking.indexOf(currentData.status));
	}, [currentData]);

	useEffect(() => {
		if (currentData.statusHistory) {
			const latestLocation = currentData.statusHistory
				.filter((status) => status.type === "location")
				.sort((a, b) => new Date(b.time) - new Date(a.time))[0];
			setCurrentCode(latestLocation ? latestLocation.currentLocationCode : null);
		}
	}, [currentData.statusHistory]);

	// useEffect(() => {
	// 	if (leftOpt.distance > 0) {
	// 		console.log(leftOpt.distance, leftOpt.duration);
	// 	}
	// }, [leftOpt]);

	const fileUpload = async (id, formData) => {
		try {
			const accessToken = localStorage.getItem(config.accessTokenName);
			const headers = {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "multipart/form-data",
			};

			const res = await axios.put(`${config.apiBaseUrl}/load/upload/${id}`, formData, { headers });
			const resData = res.data.data;
			setCurrentData({
				...currentData,
				BOLFiles: resData.BOLFiles,
				PODFiles: resData.PODFiles,
				status: resData.status,
			});
			triggerLoads(lastLoadsQuery);
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
	};

	const handleFileChangeBol = async (event) => {
		const files = event.target.files;
		const formData = new FormData();

		if (files.length > 0 && currentData) {
			setIsLoadingFileUpload(true);
			for (let i = 0; i < files.length; i++) {
				formData.append("BOLFiles", files[i]);
			}
			await fileUpload(currentData._id, formData);
			setIsLoadingFileUpload(false);
		}
	};

	const handleFileChangePod = async (event) => {
		const files = event.target.files;
		const formData = new FormData();

		if (files.length > 0 && currentData) {
			setIsLoadingFileUpload(true);
			for (let i = 0; i < files.length; i++) {
				formData.append("PODFiles", files[i]);
			}
			await fileUpload(currentData._id, formData);
			setIsLoadingFileUpload(false);
		}
	};

	const handleDeleteFiles = async (fieldName, key) => {
		const filteredFiles = currentData[fieldName].filter((item) => {
			return item.key !== key;
		});
		const data = {};
		data[fieldName] = filteredFiles;
		const res = await updateLoadData({ id: currentData._id, payload: data });
		if (res.data && res.data.load) {
			setCurrentData((prevState) => ({
				...prevState,
				[fieldName]: res.data.load[fieldName],
			}));
			triggerLoads(lastLoadsQuery);
		}

		deleteFiles([key]);
	};

	const googleMapsLinkDes = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		currentData.destinationList[0].destination
	)}`;

	const googleMapsLinkPick = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		currentData.pickUpList[0].pickUpLocation
	)}`;

	const goodToGo = async (data = { isBol: true }) => {
		const res = await updateIsGoodToGo({
			id: currentData._id,
			payload: data,
		}).unwrap();
		const resData = res.data;
		setCurrentData((prevData) => ({
			...prevData,
			BOLFiles: resData.BOLFiles,
			PODFiles: resData.PODFiles,
			status: resData.status,
			statusHistory: resData.statusHistory,
			goodToGoEnRoute: resData.goodToGoEnRoute,
			goodToGoDelivered: resData.goodToGoDelivered,
		}));

		if (resData.statusHistory) {
			setStatusHistory(resData.statusHistory);
		}
	};

	// return (
	// 	<div
	// 		dangerouslySetInnerHTML={{ __html: generatedHtmlCustomer(currentData, me.user, mapSrc) }}
	// 	/>
	// );

	return (
		<Box sx={{ width: "100%" }}>
			<Box
				sx={{
					marginBottom: "24px",
					ml: "8px",
					color: "slateblue",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<b>REF: {currentData.referenceNumber}</b>
				<Box>
					<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
						{(isLoadingUpdate ||
							isLoadingCustomerSent ||
							isLoadingFileUpload ||
							isLoadingRealLoadUpdate) && <ProgressLoader />}
					</Box>
				</Box>
			</Box>
			<Box sx={{ marginBottom: "40px" }}>
				<Stepper nonLinear connector={<ColorlibConnector />} activeStep={activeStep}>
					{steps.map((label, index) => (
						<Step disabled={isLoadingUpdate} key={label} completed={completed[index]}>
							{index > 2 && (!currentData.BOLFiles || currentData.BOLFiles.length === 0) ? (
								<Tooltip title="You must need to upload BOL to go further">
									<span>
										<StepButton disabled={true} color="inherit" onClick={() => handleStep(index)}>
											<StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
										</StepButton>
									</span>
								</Tooltip>
							) : index > 4 && (!currentData.PODFiles || currentData.PODFiles.length === 0) ? (
								<Tooltip title="You must need to upload POD to go further">
									<span>
										<StepButton disabled={true} color="inherit" onClick={() => handleStep(index)}>
											<StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
										</StepButton>
									</span>
								</Tooltip>
							) : (
								<StepButton color="inherit" onClick={() => handleStep(index)}>
									<StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
								</StepButton>
							)}
						</Step>
					))}
				</Stepper>
				<div></div>
			</Box>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Grid container spacing={1} sx={{ mb: 1 }}>
						<Grid item xs={6}>
							<Card sx={{ position: "relative", minHeight: "130px" }}>
								<CardContent>
									<a
										href={googleMapsLinkPick}
										style={{ textDecoration: "none" }}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Typography sx={{ display: "flex", gap: "10px", fontSize: "14px" }}>
											<LocalShipping color="primary" />
											{currentData?.pickUpList[0].pickUpLocation}
										</Typography>
									</a>

									<Typography
										sx={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}
									>
										<AccessTimeFilled color="primary" />{" "}
										{currentData?.pickUpList[0].pickUpOpeningDateTime}
									</Typography>

									<Stack
										sx={{
											position: "absolute",
											right: "5px",
											bottom: "5px",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											width: "100%",
										}}
										direction="row"
										spacing={1}
									>
										<Button
											component="label"
											variant="contained"
											endIcon={isLoadingFileUpload ? <CircularProgress size={14} /> : false}
											tabIndex={-1}
											sx={{
												bgcolor: "cornflowerblue",
												marginLeft: "18px !important",
												visibility: currentData.status === "At PU" ? "visible" : "hidden",
											}}
											size="small"
											startIcon={<CloudUploadIcon />}
										>
											UPLOAD BOL
											<VisuallyHiddenInput
												type="file"
												onChange={handleFileChangeBol}
												accept=".pdf, .doc, .docx"
											/>
										</Button>
										<Box>
											<Chip
												size="small"
												label={`PLT: ${currentData?.pickUpList[0]?.pPallets || "N/A"}`}
											/>
											<Chip
												size="small"
												label={`WT: ${currentData?.pickUpList[0]?.pWeight || "N/A"}`}
											/>
										</Box>
									</Stack>
								</CardContent>
							</Card>
							<List>
								{currentData &&
									currentData.BOLFiles &&
									currentData.BOLFiles.map((file, index) => {
										return (
											<ListItem
												key={index}
												sx={{ bgcolor: "gainsboro", borderRadius: "4px", marginBottom: "2px" }}
												secondaryAction={
													<Box>
														<IconButton
															onClick={() => {
																const newTab = window.open(file.location, "_blank");
																if (!newTab) {
																	alert("Popup blocked. Please allow popups for file preview.");
																}
															}}
															size="small"
															edge="end"
															aria-label="delete"
														>
															<Download />
														</IconButton>
														<IconButton
															onClick={() => handleDeleteFiles("BOLFiles", file.key)}
															size="small"
															edge="end"
															aria-label="delete"
														>
															<DeleteIcon />
														</IconButton>
													</Box>
												}
											>
												<ListItemAvatar sx={{ minWidth: "38px" }}>
													<Avatar
														sx={{ width: "30px", height: "30px", fontSize: "10px" }}
														sizes="small"
													>
														<FolderIcon sx={{ fontSize: "16px" }} />
													</Avatar>
												</ListItemAvatar>
												<ListItemText secondary={file.originalname} />
											</ListItem>
										);
									})}
							</List>
						</Grid>
						<Grid item xs={6}>
							<Card sx={{ position: "relative", minHeight: "130px" }}>
								<CardContent>
									<a
										href={googleMapsLinkDes}
										style={{ textDecoration: "none" }}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Typography sx={{ display: "flex", gap: "10px", fontSize: "14px" }}>
											<SendTimeExtension color="primary" />

											{currentData?.destinationList[0].destination}
										</Typography>
									</a>

									<Typography
										sx={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}
									>
										<AccessTimeFilled color="primary" />
										{currentData?.destinationList[0].dropOpeningDateTime}
									</Typography>

									<Stack
										sx={{
											position: "absolute",
											right: "5px",
											bottom: "5px",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											width: "100%",
										}}
										direction="row"
										spacing={1}
									>
										<Button
											component="label"
											role={undefined}
											variant="contained"
											endIcon={isLoadingFileUpload ? <CircularProgress size={14} /> : false}
											tabIndex={-1}
											sx={{
												bgcolor: "cornflowerblue",
												marginLeft: "18px !important",
												visibility: currentData.status === "At DO" ? "visible" : "hidden",
											}}
											size="small"
											startIcon={<CloudUploadIcon />}
										>
											UPLOAD POD
											<VisuallyHiddenInput
												type="file"
												onChange={handleFileChangePod}
												accept=".pdf, .doc, .docx"
											/>
										</Button>
										<Box>
											<Chip
												size="small"
												label={`PLT: ${currentData?.destinationList[0]?.dPallets || "N/A"}`}
											/>
											<Chip
												size="small"
												label={`WT: ${currentData?.destinationList[0]?.dWeight || "N/A"}`}
											/>
										</Box>
									</Stack>
								</CardContent>
							</Card>
							<List>
								{currentData &&
									currentData.PODFiles &&
									currentData.PODFiles.map((file, index) => {
										return (
											<ListItem
												key={index}
												sx={{ bgcolor: "gainsboro", borderRadius: "4px", marginBottom: "2px" }}
												secondaryAction={
													<Box>
														<IconButton
															onClick={() => {
																const newTab = window.open(file.location, "_blank");
																if (!newTab) {
																	alert("Popup blocked. Please allow popups for file preview.");
																}
															}}
															size="small"
															edge="end"
															aria-label="download"
														>
															<Download />
														</IconButton>
														<IconButton
															onClick={() => handleDeleteFiles("PODFiles", file.key)}
															size="small"
															edge="end"
															aria-label="delete"
														>
															<DeleteIcon />
														</IconButton>
													</Box>
												}
											>
												<ListItemAvatar>
													<Avatar sx={{ width: "30px", height: "30px" }} sizes="small">
														<FolderIcon sx={{ fontSize: "16px" }} />
													</Avatar>
												</ListItemAvatar>
												<ListItemText secondary={file.originalname} />
											</ListItem>
										);
									})}
							</List>
						</Grid>
					</Grid>
					<Box sx={{ position: "relative", opacity: mapSrcLoading ? "0.5" : "1" }}>
						<img
							style={{
								width: "100%",
								height: "auto",
								borderRadius: "7px",
								border: "1px solid cornflowerblue",
							}}
							src={mapSrc}
							alt="tracking"
						/>
						{mapSrcLoading && (
							<Box
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<ProgressLoader />
							</Box>
						)}
					</Box>
				</Grid>
				<Grid item xs={12} md={6}>
					<Stack
						direction="row"
						sx={{ mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}
						spacing={2}
					>
						{me && (
							<Button
								onClick={handleSentCustomer}
								sx={{ marginLeft: "auto" }}
								variant="contained"
								endIcon={<Send />}
								disabled={isLoadingCustomerSent}
							>
								{isLoadingCustomerSent ? (
									<CircularProgress size={20} style={{ marginRight: "4px" }} />
								) : null}
								UPDATE CUSTOMER
							</Button>
						)}
						{currentData.BOLFiles &&
							currentData.BOLFiles.length &&
							currentData.status === "At PU" &&
							!currentData.goodToGoEnRoute && (
								<Button
									onClick={() => goodToGo({ isBol: true })}
									color="success"
									variant="contained"
									endIcon={<Verified />}
									disabled={isFetchingGoodToGo}
								>
									{isLoadingCustomerSent ? (
										<CircularProgress size={20} style={{ marginRight: "4px" }} />
									) : null}
									Good To Go
								</Button>
							)}

						{currentData.PODFiles &&
							currentData.PODFiles.length &&
							currentData.status === "At DO" &&
							!currentData.goodToGoEnDelivered && (
								<Button
									onClick={() => goodToGo({ isPod: true })}
									color="success"
									variant="contained"
									endIcon={<Verified />}
									disabled={isFetchingGoodToGo}
								>
									{isLoadingCustomerSent ? (
										<CircularProgress size={20} style={{ marginRight: "4px" }} />
									) : null}
									Good To Go
								</Button>
							)}
					</Stack>
					<Card sx={{ minWidth: 275 }}>
						<CardContent>
							<Paper
								sx={{
									mb: 2,
									p: 1,
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								elevation={1}
							>
								<Box
									sx={{
										"& > div": {
											marginBottom: "5px",
											"& span": {
												fontWeight: "bold",
												marginRight: "5px",
											},
										},
										"& > div:nth-of-type(1)": {
											color: "#3366ff", // Est. Distance and Est. Duration text color
										},
										"& > div:nth-of-type(2)": {
											color: "#ff6600", // Distance Left and Time Left text color
										},
									}}
								>
									<div>
										<span>Est. Distance:</span> {formatDistance(estOpt.distance * 0.000621371)}
									</div>
									<div>
										<span>Est. Duration:</span> {formatDuration(estOpt.duration)}
									</div>
								</Box>
								<Box
									sx={{
										"& > div": {
											marginBottom: "5px",
											"& span": {
												fontWeight: "bold",
												marginRight: "5px",
											},
										},
										"& > div:nth-of-type(1)": {
											color: "#3366ff", // Distance Left and Time Left text color
										},
										"& > div:nth-of-type(2)": {
											color: "#ff6600", // Distance Left and Time Left text color
										},
									}}
								>
									<div>
										<span>Distance Left:</span> {formatDistance(leftOpt.distance * 0.000621371)}
									</div>
									<div>
										<span>Time Left:</span> {formatDuration(leftOpt.duration) || "0 min"}
									</div>
								</Box>
							</Paper>
							<form onSubmit={handleSubmitST(updateHistory)}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<FormControlLabel
											control={
												<Switch
													size="small"
													checked={currentLocation}
													onChange={handleSwitchChange}
												/>
											}
											label="Current Location"
											sx={{ float: "right" }}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Controller
											name="note"
											{...registerST("note", {
												required: {
													value: currentLocation ? false : true,
													message: "please provide a valid datetime.",
												},
											})}
											control={controlST}
											render={({ field }) => (
												<TextField
													{...field}
													fullWidth
													label="Notes"
													variant="outlined"
													size="small"
													style={{ borderBottom: "none" }}
													onBlur={(e) => setValueST("note", e.target.value)}
												/>
											)}
										/>
										{errorsST.note && (
											<FormHelperText sx={{ color: "#D32F2F" }}>
												Please, add some notes!
											</FormHelperText>
										)}
									</Grid>
									{currentLocation ? (
										<Grid item xs={12} sm={6}>
											<PlacesAutocomplete
												handleAutocompleteChange={handleAutocompleteChange}
												register={registerST}
												autocompleteName="currentLocationText"
												locationVal={watchST("currentLocationText")}
												placeholder="Current Location"
												required={currentLocation ? true : false}
											/>

											{errorsST.currentLocationText && (
												<FormHelperText sx={{ color: "#D32F2F" }}>
													Please select current location
												</FormHelperText>
											)}
										</Grid>
									) : (
										<Grid item xs={12} sm={6}></Grid>
									)}
									<Grid item xs={4} sm={2}>
										<Button
											sx={{ width: "100%" }}
											variant="contained"
											color="primary"
											onClick={handleSubmitST(updateHistory)}
										>
											Add
										</Button>
									</Grid>
									<Grid item xs={12} sm={12}>
										<TableContainer component={Paper}>
											<Table size="small" aria-label="a dense table">
												<TableHead>
													<TableRow>
														<TableCell>CHECK CALLS</TableCell>
														<TableCell align="right">TIME OF UPDATE</TableCell>
														<TableCell align="right"></TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{rows.map((row) => (
														<TableRow
															key={row.time}
															sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
														>
															<TableCell sx={{ fontSize: "13px" }} component="th" scope="row">
																{row.note}
															</TableCell>
															<TableCell sx={{ fontSize: "13px" }} align="right">
																{row.time}
															</TableCell>
															<TableCell sx={{ fontSize: "13px" }} align="right">
																{row.note !== "Load created at" && (
																	<IconButton
																		onClick={async () => {
																			const history = statusHistory.filter(
																				(his) => row.key !== his.key
																			);
																			await updateLoad({ statusHistory: history });
																		}}
																		disabled={isLoadingUpdate}
																		size="small"
																	>
																		<Delete />
																	</IconButton>
																)}
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</Grid>
								</Grid>
							</form>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default TrackModal;
