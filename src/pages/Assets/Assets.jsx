/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import {
	useAddAssetMutation,
	useDeleteAssetMutation,
	useGetHighestAssetIdQuery,
	useHoldAssetMutation,
	useLazyGetAssetsLzQuery,
	useUnHoldAssetMutation,
	useUpdateAssetMutation,
} from "../../services/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import styles from "./Assets.module.scss";
import { useForm } from "react-hook-form";
import AddAssetModal from "./AddAssetModal";
import ROUTES from "../../routes";
import { toast } from "react-toastify";
import CrmTable from "../../components/CrmTable";
import dateUtils from "../../utils/dateUtils";
import globalUtils from "../../utils/globalUtils";
import AssetAnalyticCard from "./AssetAnalyticCard";
import { AssetStatus, StandardRadiusMiles } from "../../shared/constants";
import PlacesAutocomplete from "../../components/PlacesAutocomplete";
import {
	Button,
	Chip,
	CircularProgress,
	Divider,
	FormControl,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Tooltip,
} from "@mui/material";
import Countdown from "react-countdown";
import MUIModal from "../../components/MUIModal";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Clear, Delete, Edit, Refresh } from "@mui/icons-material";
import Confirmation from "../../components/Confirmation/Confirmation.jsx";
import { COLORS } from "../../shared/colors";
import { config } from "../../config";
import { useDeleteFilesMutation } from "../../services/load";
import Typography from "@mui/material/Typography";
import {
	calculateDistance,
	formatDistance,
	formatDuration,
	getBatchDistances,
} from "../../utils/distanceDuration";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../../services/user";
import { setBackDropOpen } from "../../store/slice/globalSlice";
import { MenuItem, Checkbox, ListItemText, InputLabel, Select } from "@mui/material";

const TooltipControllerCard = ({ updatedHistories }) => {
	return updatedHistories.slice(-3).map((history, index) => (
		<>
			<Typography key={index} sx={{ fontSize: "12px" }}>
				<span style={{ fontWeight: 600, opacity: 1 }}>LUB: </span>
				<span style={{ opacity: 0.7, fontWeight: 500 }}>
					{`${history.updatedBy.name} on ${history.updatedAt}`}
				</span>
			</Typography>
			<Divider />
		</>
	));
};

const Assets = () => {
	const { loggedInUser } = useSelector((state) => state.global);
	const [showModal, setShowModal] = useState(false);
	const [disableSubmit, setDisableSubmit] = useState(false);
	const [currentData, setCurrentData] = useState(null);
	const [open, setOpen] = useState(false);
	const { data: userData } = useGetMeQuery();
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
		control,
		unregister,
		watch,
	} = useForm();
	const handleViewMap = () => {
		window.open(ROUTES.PATHS.ASSETS_LEAFLET_MAP, "_blank");
	};
	const [addAsset] = useAddAssetMutation();

	const { data: highestAssetId, refetch: refetchMaxId } = useGetHighestAssetIdQuery();

	const [updateAsset] = useUpdateAssetMutation();

	const [holdAsset] = useHoldAssetMutation();
	const [unHoldAsset] = useUnHoldAssetMutation();

	const [triggerAssets, { data: assetsData, isFetching, isLoading, isError }] =
		useLazyGetAssetsLzQuery();

	const [radiusValue, setRadiusValue] = useState(StandardRadiusMiles);
	const [showConfirm, setShowConfirm] = useState(false);

	const [delFiles, setDelFiles] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const ROWS_PER_PAGE = 50;
	const initialStatus = "available,available_locally,available_on,on_our_load,on_hold";
	const [hasMore, setHasMore] = useState(true);

	const [selectedLocation, setSelectedLocation] = useState(null);

	const dispatch = useDispatch();

	const [assetFiles, setAssetFiles] = useState({
		identityDoc: [],
		insuranceDoc: [],
		drivingLicense: [],
		vanPictures: [],
	});

	const handleFileSelected = (files, fileName) => {
		unregister(fileName);
		setAssetFiles((prevLoadFiles) => ({
			...prevLoadFiles,
			[fileName]: files,
		}));
	};

	const deleteFileHandler = (fileName, file) => {
		if (file !== false)
			setDelFiles((prevDelFiles) => [...prevDelFiles, { fileName: fileName, key: file.key }]);
		setAssetFiles((prevLoadFiles) => ({
			...prevLoadFiles,
			[fileName]: null,
		}));
	};

	const fileUpload = async (id, formData) => {
		try {
			const accessToken = localStorage.getItem(config.accessTokenName);
			const headers = {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "multipart/form-data",
			};

			await axios.put(`${config.apiBaseUrl}/asset/upload/${id}`, formData, { headers });
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
	};

	const [deleteFiles] = useDeleteFilesMutation();

	const [currentStatus, setCurrentStatus] = useState(initialStatus);

	const fetchAssets = async ({
		page = 1,
		rowsPerPage = ROWS_PER_PAGE,
		orderBy = "assetId",
		order = "desc",
		search = false,
		cache = true,
		ins = currentStatus,
	} = {}) => {
		const queryString = `?page=${page}&rowsPerPage=${rowsPerPage}&orderBy=${orderBy}&order=${order}&ins=${ins}`;
		try {
			const assets = await triggerAssets(queryString, cache);
			if (assets && assets.data) {
				if (!search) {
					setTableAssetData((prevData) => [...prevData, ...assets.data.assets]);
				} else {
					setTableAssetData(assets.data.assets);
				}

				if (assets.data.assets.length < rowsPerPage) setHasMore(false);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const onSubmit = async (data) => {
		let isError = false;
		setDisableSubmit(true);
		try {
			const formData = new FormData();

			// Iterate over each field in assetFiles
			Object.entries(assetFiles).forEach(([fieldName, files]) => {
				if (files && files.length) {
					files.forEach((file) => {
						formData.append(fieldName, file);
					});
				}
			});

			let uploadPromise;
			let res;

			if (currentData) {
				delFiles.forEach((file) => {
					const filteredFiles = currentData[file.fileName].filter((item) => {
						return !delFiles.some((delFile) => delFile.key === item.key);
					});
					data[file.fileName] = filteredFiles;
				});

				if (currentData.status !== data.status || currentData.location !== data.location) {
					const existHistories = currentData.updatedHistories ? currentData.updatedHistories : [];
					data.updatedHistories = [
						...existHistories,
						{
							updatedBy: {
								_id: loggedInUser?.user?._id,
								name: loggedInUser?.user?.name,
							},
							updatedAt: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
						},
					];
				}

				res = await updateAsset({ id: currentData._id, payload: data });
			} else {
				data.updatedHistories = [
					{
						updatedBy: {
							_id: loggedInUser?.user?._id,
							name: loggedInUser?.user?.name,
						},
						updatedAt: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
					},
				];
				res = await addAsset(data);
			}

			console.log(res);

			// Proceed only if no error occurred
			if (res && res.data.success) {
				if (!formData.keys().next().done) {
					uploadPromise = fileUpload(res.data.asset._id, formData);
				}
			} else {
				isError = true;
				toast("Something wrong!", { type: "error" });
				// Handle error from updateOrder or addOrder
				throw new Error(res.error.message);
			}

			// Wait for the fileUpload promise to resolve before moving on
			if (uploadPromise) {
				await uploadPromise;
			}
		} catch (error) {
			console.log(error);
			isError = true;
		} finally {
			if (!isError) {
				setSelectedLocation("");
				if (delFiles.length) deleteFiles({ paths: delFiles.map((file) => file.key) });
				setHasMore(true);
				await fetchAssets({ cache: false, search: true });
				toast(currentData ? "Asset updated successfully!" : "Asset added successfully!");
				setShowModal(false);
				reset();
				setAssetFiles({
					identityDoc: null,
					insuranceDoc: null,
					drivingLicense: null,
					vanPictures: [],
				});
				setDelFiles([]);
				setSelectedLocation(null);
			}
			isError = false;
			setDisableSubmit(false);
		}
	};

	const handleEdit = (data) => {
		setDelFiles([]);
		setAssetFiles({
			identityDoc: null,
			insuranceDoc: null,
			drivingLicense: null,
			vanPictures: [],
		});
		reset();
		setCurrentData(data);
		setShowModal(true);
	};

	const [tableAssestData, setTableAssetData] = useState([]);

	const [showClearIcon, setShowClearIcon] = useState("none");

	const handleSearch = async (event, key = false) => {
		if ((key && event.keyCode === 13) || key === false) {
			try {
				dispatch(setBackDropOpen(true));
				setCurrentStatus(initialStatus);
				const accessToken = localStorage.getItem(config.accessTokenName);
				const headers = {
					Authorization: `Bearer ${accessToken}`,
				};

				if (searchQuery.length > 0) {
					const response = await axios.get(`${config.apiBaseUrl}/assets/search?q=${searchQuery}`, {
						headers,
					});
					setTableAssetData(response.data.assets);
				}
				dispatch(setBackDropOpen(false));
			} catch (error) {
				console.log(error);
			}
		}
	};

	const onScrollBottom = async (page) => {
		await fetchAssets({ page: page, ins: currentStatus });
	};

	useEffect(() => {
		fetchAssets();
	}, []);

	const handleClear = () => {
		setShowClearIcon("none");
		setSearchQuery("");
		setHasMore(true);
		fetchAssets({ page: 1, search: true });
	};

	const onHoldStatusClick = async (asset) => {
		if (!asset.isHold)
			await holdAsset({
				holdTime: dateUtils.currentTime(),
				assetId: asset.assetId,
				status: asset.status,
				userId: loggedInUser?.user?._id,
			});
		else
			unHoldAsset({
				assetId: asset.assetId,
				userId: loggedInUser?.user?._id,
				status: asset.status,
			});
	};

	const getHoldText = (asset) => {
		if (!asset.isHold) return "Hold";
		else {
			if (loggedInUser && loggedInUser.user._id !== asset.isHold.userId) return "Hold";
			else return "Release";
		}
	};

	const [timestamp] = useState(900000);

	const onCountdownStop = (asset) => {
		console.log("onCountdownStop", asset, timestamp);
		onHoldStatusClick(asset);
	};

	const [deletePost, response] = useDeleteAssetMutation();

	const [assetColumn, setColumn] = useState([
		{
			id: "assetId",
			label: "Unit No.",
			canBeSorted: true,
			render: (asset) => {
				return <div style={{ width: 100 }}>{asset.assetId}</div>;
			},
		},
		{
			id: "status",
			label: "Unit Status",
			canBeSorted: true,
			render: (asset) => {
				return (
					<div>
						<Chip
							label={globalUtils.snakeCaseToCapitalize(asset.status)}
							style={{
								padding: "0 12px",
								backgroundColor: `${globalUtils.getAssetStatusColor(asset.status)}`,
								color: "white",
							}}
							size="small"
						/>
						{asset.status === AssetStatus.AVAILABLE_ON && (
							<div style={{ fontSize: "12px", paddingTop: "2px" }}>{asset.availableDate}</div>
						)}

						{asset.status === AssetStatus.ON_OUR_LOAD && (
							<div style={{ fontSize: "12px", paddingTop: "2px" }}>{asset.deliveryDate}</div>
						)}
					</div>
				);
			},
		},
		{
			id: "assignedDrivers",
			label: "Driver",
			canBeSorted: true,
			render: (asset) => {
				return (
					<>
						<div>
							<span>
								{asset.assignedDrivers}
								<span style={{ fontWeight: "bold", color: "darkgrey", fontSize: "13px" }}>
									[{asset.loadTotal}]
								</span>{" "}
								/{" "}
							</span>
							<span style={{ fontSize: "11px" }}>{asset.driverHomeState}</span>
						</div>
						{(asset.isHold && loggedInUser && loggedInUser?.user?._id !== asset.isHold.userId) || (
							<div style={{ color: COLORS.ZERO_CRAYOLA }}>
								<div style={{ fontSize: "13px" }}>{asset.contactNumber}</div>
								<div style={{ fontSize: "11px" }}>{asset.email} </div>
							</div>
						)}
						{asset.companyName && asset.companyName.length > 0 && (
							<div style={{ fontSize: "11px", color: "darkslateblue" }}>{asset.companyName}</div>
						)}
						{asset.driverCirtifications && asset.driverCirtifications.length && (
							<p style={{ color: "#959292", fontWeight: "bold" }}>{asset.driverCirtifications}</p>
						)}
					</>
				);
			},
		},
		{
			id: "type",
			label: "Equipment Info.",
			canBeSorted: true,
			render: (asset) => {
				return (
					<>
						<div style={{ fontSize: 14 }}>{asset.dimension}</div>
						<div style={{ color: "gray" }}>
							<div style={{ fontSize: "13px" }}>{asset.weight && `(${asset.weight})`}</div>
							<div>{globalUtils.snakeCaseToCapitalize(asset.type)}</div>
							<div>
								{asset.model}, {asset.year}
							</div>
						</div>
					</>
				);
			},
		},
		{
			id: "location",
			label: "City",
			canBeSorted: true,
			render: (asset) => {
				const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
					asset.location
				)}`;
				return (
					<Tooltip
						title={
							!asset.updatedHistories || !asset.updatedHistories.length ? null : (
								<TooltipControllerCard
									updatedHistories={asset?.updatedHistories ? asset.updatedHistories : []}
								/>
							)
						}
					>
						<a
							href={googleMapsLink}
							style={{ textDecoration: "none" }}
							target="_blank"
							rel="noopener noreferrer"
						>
							<div style={{ color: "mediumblue", fontWeight: "500" }}>{asset.location}</div>
						</a>
					</Tooltip>
				);
			},
		},

		{
			id: "notes",
			label: "Notes",
			render: (asset) => {
				return <div>{asset.notes}</div>;
			},
		},
		{
			id: "Action",
			label: "Hold",
			canBeSorted: true,
			render: (asset) => {
				return (
					<div>
						{![AssetStatus.NOT_AVAILABLE, AssetStatus.OUT_OF_SERVICE].includes(asset.status) && (
							<Button
								style={{
									color: getHoldText(asset) === "Release" && COLORS.RAJAH,
								}}
								onClick={() => onHoldStatusClick(asset)}
								disabled={
									asset.isHold && loggedInUser && loggedInUser?.user?._id !== asset.isHold.userId
								}
							>
								{getHoldText(asset)}
							</Button>
						)}
						{asset.isHold && (
							<>
								<div className="text-gray-700">On Hold by</div>
								<div style={{ color: COLORS.ZERO_CRAYOLA }}>{asset.isHold.userName}</div>
								<div>
									<Countdown
										date={new Date(asset.isHold.holdTime).getTime() + timestamp}
										renderer={({ minutes, seconds, completed }) => (
											<span>
												{completed ? (
													<span> for 00:00 minutes</span>
												) : (
													<>
														<span>for </span>
														<span style={{ fontWeight: "600" }}>
															{minutes}:{seconds < 10 ? "0" : ""}
															{seconds}
														</span>
														<span> minutes </span>
													</>
												)}
											</span>
										)}
										onComplete={() => onCountdownStop(asset)}
									/>
									{/* {asset.isHold.holdTime} */}
								</div>
							</>
						)}
					</div>
				);
			},
		},
		{
			id: "action",
			label: "Action",
			render: (asset) => {
				return (
					<div className={styles.actionRow}>
						<IconButton
							size="small"
							onClick={() => handleEdit(asset)}
							aria-label="edit"
							style={{ color: COLORS.CRAYOLA }}
						>
							<Edit />
						</IconButton>
						{userData &&
							userData.user.accessFeatures &&
							userData.user.accessFeatures["Asset"] &&
							userData.user.accessFeatures["Asset"]["Delete"] && (
								<div>
									<IconButton
										size="small"
										onClick={() => {
											setCurrentData(asset);
											setShowConfirm(true);
										}}
										aria-label="delete"
									>
										<Delete style={{ color: COLORS.INTERNATIONAL_ORANGE }} />
									</IconButton>
								</div>
							)}
					</div>
				);
			},
		},
	]);

	if (isError) {
		return <div>Error occurred while fetching assets.</div>;
	}

	const [dLoading, setDLoading] = useState(false);

	const handleAutocompleteChange = async (event, value) => {
		if (value) {
			dispatch(setBackDropOpen(true));
			let lat = value.lat;
			let lon = value.lon;
			const selectedLoc = { lat: lat, lon: lon };
			setSelectedLocation(selectedLoc);

			setTableAssetData([]);
			setDLoading(true);
			await getSortedAssetsByDistance({ ...selectedLoc }, radiusValue);
		} else {
			handleClosestReset();
		}
	};

	const getSortedAssetsByDistance = async (currentLocation, currentRadius) => {
		setHasMore(false);
		setCurrentStatus(initialStatus);
		const queryString = `?page=${1}&rowsPerPage=${5000}&orderBy=${"assetId"}&order=${"desc"}&ins=${initialStatus}`;
		let assetsWithinRadius = await triggerAssets(queryString, false);
		assetsWithinRadius = assetsWithinRadius.data.assets
			.map((asset) => {
				const distance = calculateDistance(asset.geoCode, [
					currentLocation.lat,
					currentLocation.lon,
				]);
				return { ...asset, distance };
			})
			.filter((asset) => asset.distance <= Number(currentRadius));

		const allUpdatedAsset = await (assetsWithinRadius.length
			? getBatchDistances(
					[currentLocation.lat, currentLocation.lon],
					assetsWithinRadius.slice(0, 15)
			  )
			: []);

		const finalAsset = allUpdatedAsset.filter((asset) => asset.distance <= Number(currentRadius));

		// Sort assets by distance
		finalAsset.sort((a, b) => a.distance - b.distance);
		setCurrentStatus(initialStatus);
		if (finalAsset.length) {
			setTableAssetData([...finalAsset]);
			const newCol = {
				id: "distance",
				label: "Distance/ETA",
				canBeSorted: true,
				render: (asset) => {
					return (
						<>
							<div style={{ fontWeight: "600" }}>{formatDistance(asset.distance) || ""}</div>
							<div>{formatDuration(asset?.duration) || ""}</div>
						</>
					);
				},
			};

			const equpInfoPosition = assetColumn.findIndex((item) => item.id === "type");

			if (equpInfoPosition !== -1) {
				const updatedCampaignColumn = assetColumn.filter((item) => item.id !== "distance");
				updatedCampaignColumn.splice(equpInfoPosition + 1, 0, newCol);
				setColumn(updatedCampaignColumn);
			} else {
				setColumn([...assetColumn, newCol]);
			}
			setDLoading(false);
			dispatch(setBackDropOpen(false));
		} else {
			setDLoading(false);
			dispatch(setBackDropOpen(false));
		}
	};

	const onRadiusChange = async (e) => {
		setRadiusValue(e.target.value);
		if (selectedLocation) {
			setTableAssetData([]);
			setDLoading(true);
			await getSortedAssetsByDistance({ ...selectedLocation }, e.target.value);
		}
	};

	const handleClosestReset = () => {
		setDLoading(false);
		setTableAssetData(assetsData.assets);
		const newColumns = assetColumn.filter((item) => item.id !== "distance");
		setColumn(newColumns);
		setRadiusValue(StandardRadiusMiles);
		setSelectedLocation(null);
	};

	const handleChangeSearch = (event) => {
		if (event.target.value.length < 1) {
			setHasMore(true);
			fetchAssets({ page: 1, search: true });
		}
		setSearchQuery(event.target.value);
		setShowClearIcon(event.target.value === "" ? "none" : "flex");
	};

	const [dynamicAssetId, setDynamicAssetId] = useState("");

	const handleSelectChange = async (event) => {
		dispatch(setBackDropOpen(true));
		const {
			target: { value },
		} = event;
		setOpen(false);
		setHasMore(true);
		const queryStatus = value.includes("all")
			? `all,${Object.values(AssetStatus).join(",")}`
			: value.join(",");
		setCurrentStatus(queryStatus);
		await fetchAssets({ page: 1, cache: false, search: true, ins: queryStatus });
		dispatch(setBackDropOpen(false));
	};

	useEffect(() => {
		if (highestAssetId && currentData) {
			const dyasset = currentData.assetId;
			setDynamicAssetId(dyasset);
			setValue("assetId", dyasset);
		} else if (highestAssetId) {
			setDynamicAssetId(highestAssetId.highestAssetId);
			setValue("assetId", highestAssetId.highestAssetId);
		}
	}, [highestAssetId, currentData]);

	return (
		<div className={styles.assetArea}>
			<div
				style={{
					marginBottom: "32px",
				}}
				className={styles.gridContainer}
			>
				{Object.values(AssetStatus).map((status) => (
					<div key={status}>
						<AssetAnalyticCard
							val={assetsData && assetsData.count ? assetsData.count[status] : 0}
							status={status}
						/>
					</div>
				))}
			</div>

			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
					<PlacesAutocomplete
						style={{
							width: 280,
						}}
						handleAutocompleteChange={handleAutocompleteChange}
						placeholder="Pickup Location"
					/>
					<div>
						<TextField
							size="small"
							sx={{ width: "80px" }}
							variant="outlined"
							placeholder="Enter radius(mi)"
							name="radius"
							type="text"
							value={radiusValue}
							onChange={onRadiusChange}
						/>
					</div>
					<FormControl className={styles.statusSelect} size="small" style={{ width: "240px" }}>
						<Select
							labelId="asset-status-label"
							id="asset-status"
							multiple
							size="small"
							open={open}
							label="Status"
							onClose={() => setOpen(false)}
							onOpen={() => setOpen(true)}
							value={currentStatus.split(",")}
							onChange={handleSelectChange}
							renderValue={(selected) => selected.join(", ")}
						>
							<MenuItem value="all">
								<Checkbox checked={currentStatus.split(",").includes("all")} />
								<ListItemText primary="All" />
							</MenuItem>
							{Object.values(AssetStatus).map((status) => (
								<MenuItem key={status} value={status}>
									<Checkbox checked={currentStatus.split(",").includes(status)} />
									<ListItemText primary={status.replace(/_/g, " ")} />
								</MenuItem>
							))}
							<MenuItem value="on_hold">
								<Checkbox checked={currentStatus.split(",").includes("on_hold")} />
								<ListItemText primary="On Hold" />
							</MenuItem>
						</Select>
					</FormControl>
					<div>
						<FormControl>
							<div style={{ display: "flex", alignItem: "center", gap: "0px" }}>
								<TextField
									size="small"
									variant="outlined"
									sx={{ width: "220px" }}
									onChange={handleChangeSearch}
									onKeyDown={(event) => handleSearch(event, true)}
									value={searchQuery}
									placeholder="Search"
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" style={{ display: showClearIcon }}>
												<IconButton onClick={handleClear} size="small">
													<Clear />
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<IconButton className={styles.searchBtn} onClick={handleSearch} size="small">
									<SearchIcon />
								</IconButton>
							</div>
						</FormControl>
					</div>
				</div>
				<div className={styles.actionArea}>
					<Stack direction="row" spacing={1}>
						<Tooltip title="Reload Data" placement="left">
							<IconButton
								onClick={() => {
									setHasMore(true);
									fetchAssets({ cache: false, search: true });
									refetchMaxId();
								}}
								color="primary"
								size="small"
								sx={{ marginRight: "8px" }}
							>
								{isFetching ? (
									<CircularProgress size={20} color="primary" />
								) : (
									<Refresh fontSize="medium" />
								)}
							</IconButton>
						</Tooltip>
						{userData &&
							userData.user.accessFeatures &&
							userData.user.accessFeatures["Asset"] &&
							userData.user.accessFeatures["Asset"]["Create"] && (
								<Button
									variant="contained"
									onClick={() => {
										refetchMaxId();
										setCurrentData(null);
										reset();
										setShowModal(true);
										setDelFiles([]);
										setAssetFiles({
											identityDoc: null,
											insuranceDoc: null,
											drivingLicense: null,
											vanPictures: [],
										});
									}}
									size="small"
									startIcon={<FontAwesomeIcon icon={faPlus} />}
								>
									Add Asset
								</Button>
							)}

						<Button
							variant="contained"
							onClick={handleViewMap}
							startIcon={<FontAwesomeIcon icon={faLocationArrow} />}
							color="secondary"
							size="small"
						>
							View Map
						</Button>
					</Stack>
				</div>
			</div>
			{assetsData && assetsData.activeCount > 0 && (
				<Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: "flex-end" }}>
					<Chip
						sx={{ fontWeight: "bold" }}
						label={`Total: ${selectedLocation ? tableAssestData.length : assetsData.activeCount}`}
						size="small"
					/>
				</Stack>
			)}
			<CrmTable
				columns={assetColumn}
				data={tableAssestData}
				loading={isLoading || dLoading || isFetching}
				onScrollBottom={onScrollBottom}
				ROWS_PER_PAGE={ROWS_PER_PAGE}
				hasMore={hasMore}
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<MUIModal
					showModal={showModal}
					setShowModal={setShowModal}
					modalTitle={`${currentData ? "Update" : "Add"} Asset`}
					closeBtnText="Cancel"
					secondaryBtnText={currentData ? "Update" : "Submit"}
					isSubmit={true}
					modalClassName="wd-65"
					handleClickSecondaryBtn={handleSubmit(onSubmit)}
					secondaryBtnDisabled={disableSubmit}
					secondaryBtnLoading={disableSubmit}
					modalBodyComponent={
						<AddAssetModal
							currentData={currentData}
							setValue={setValue}
							register={register}
							errors={errors}
							watch={watch}
							control={control}
							dynamicAssetId={dynamicAssetId}
							handleFileSelected={handleFileSelected}
							deleteFileHandler={deleteFileHandler}
						/>
					}
				/>
			</form>

			<Confirmation
				open={showConfirm}
				setOpen={setShowConfirm}
				actionBtnLoading={response.isLoading}
				textComponent={
					<p>
						Confirming this action will result in the permanent deletion of data{" "}
						{currentData ? (
							<span style={{ color: COLORS.CRAYOLA }}>
								{currentData.assignedDrivers}({currentData.assetId})
							</span>
						) : (
							<span>data</span>
						)}{" "}
						from everywhere. Do you wish to proceed?
					</p>
				}
				handleSecondaryBtnClick={async () => {
					const res = await deletePost(currentData._id);
					if (res.data && res.data.success) {
						setHasMore(true);
						fetchAssets({ cache: false, search: true });
						setCurrentData(null);
						setShowConfirm(false);
						toast.success("Asset deleted successfully!");
					} else {
						toast.error(res.data && res.data.message ? res.data.message : "Something Wrong!");
					}
				}}
			/>
		</div>
	);
};

export default Assets;
