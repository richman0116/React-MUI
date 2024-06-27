import React, { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import BOL from "../../components/LoadDocuments/BOL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Loads.module.scss";
import { toast } from "react-toastify";

import {
	useAddPrivateNoteMutation,
	useDeleteLoadMutation,
	useDeleteMultipleLoadsMutation,
	useGetLoadCountsQuery,
	useLazyGetQuotesQuery,
	useUpdateHotLoadMutation,
	useUpdateLoadPaymentStatusMutation,
} from "../../services/load";
import {
	Backdrop,
	Button,
	ButtonGroup,
	Chip,
	CircularProgress,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Tooltip,
	Typography,
	FormControl,
	InputAdornment,
} from "@mui/material";
import axios from "axios";
import BolSection from "./BolSection";
import Ratecon from "../../components/LoadDocuments/Ratecon";
import Invoice from "../../components/LoadDocuments/Invoice";
import RateconSection from "./RateconSection";
import InvoiceSection from "./InvoiceSection";
import { useGetMeQuery } from "../../services/user";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";
import { pdf } from "@react-pdf/renderer";
import { CheckCircle, GpsFixed, LocalShipping, Refresh, Clear } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AppDrawer from "../../components/AppDrawer";
import dateUtils from "../../utils/dateUtils";
import { config } from "../../config";
import ReusableTable from "../../components/ReusableTable/ReusableTable";
import { useConfirm } from "material-ui-confirm";
import { useDispatch, useSelector } from "react-redux";
import { setLastLoadsQuery, setLoadsActiveFilter } from "../../store/slice/globalSlice";
import useLoadCols from "../../hooks/useLoadCols/useLoadCols";
import SearchIcon from "@mui/icons-material/Search";
const Loads = () => {
	const loadsActiveFilter = useSelector((state) => state.global.loadsActiveFilter);
	const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQuery);
	const [triggerLoads, { data: loadsData, isFetching }] = useLazyGetQuotesQuery();
	const {
		data: loadsCount,
		isFetching: loadsCountFetching,
		refetch: refetchLoadCounts,
	} = useGetLoadCountsQuery();
	const [updateLoadPaymentStatus] = useUpdateLoadPaymentStatusMutation();
	const [updateHotLoad] = useUpdateHotLoadMutation();

	const dispatch = useDispatch();

	const [showBolModal, setShowBolModal] = useState(false);
	const [showRateconModal, setShowRateconModal] = useState(false);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [currentData, setCurrentData] = useState(null);
	const navigate = useNavigate();

	const { data: userData } = useGetMeQuery();

	const [deleteLoad, { isLoading: isLoadingDeleteSingle }] = useDeleteLoadMutation();
	const [deleteLoadMultiples] = useDeleteMultipleLoadsMutation();

	const [customer, setCustomer] = useState(null);
	const [deletedIds, setDeletedIds] = useState([]);
	const [backDropOpen, setBackDropOpen] = useState(false);

	const handleEdit = (data) => {
		navigate(`${ROUTES.PATHS.ADD_LOAD}?id=${data._id}`);
	};

	const getActualLoad = (load) => {
		const actualLoadArr = loadsData.loads.map((item) => {
			if (item._id === load._id) return item;
		});
		const actualLoad = actualLoadArr.filter((item) => item !== null && item !== undefined);
		return actualLoad[0];
	};
	const handleBOLDownload = async (load) => {
		const blob = await pdf(
			<BOL load={load} userData={userData} loadApiData={getActualLoad(load)} />
		).toBlob();
		saveAs(blob, `bill_of_lading_${load.loadId}.pdf`);
	};

	const handleRateconDownload = async (load) => {
		const blob = await pdf(
			<Ratecon load={load} userData={userData} loadApiData={getActualLoad(load)} />
		).toBlob();
		saveAs(blob, `load_confirmation_${load.loadId}.pdf`);
	};

	const handleInvoiceDownload = async (load) => {
		const blob = await pdf(
			<Invoice load={load} userData={userData} loadApiData={getActualLoad(load)} />
		).toBlob();
		saveAs(blob, `load_invoice_${load.loadId}.pdf`);
	};

	const handlePreviewBOLDownload = async (load, type) => {
		setCurrentData(null);
		setCustomer(null);
		setBackDropOpen(true);
		const customerRes = await axios.get(`${config.apiBaseUrl}/customers/${load.customer?._id}`);
		setCustomer(customerRes.data.customer);
		if (type === "BOL") setShowBolModal(true);
		else if (type === "Ratecon") setShowRateconModal(true);
		else setShowInvoiceModal(true);
		setCurrentData(load);
		setBackDropOpen(false);

		handleClose();
	};

	const handleCloseBackDrop = () => {
		setBackDropOpen(false);
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [editedLoad, setEditedLoad] = useState(null);

	const handleClick = (event, load) => {
		setAnchorEl(event.currentTarget);
		setEditedLoad(load);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setEditedLoad(null);
	};

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isReload, SetIsReload] = useState(false);
	const [notesValue, setNotesValue] = useState("");

	const [addPrivateNotes] = useAddPrivateNoteMutation();

	const toggleDrawer = (anchor, open) => {
		setDrawerOpen(open);
	};

	const { loadCols } = useLoadCols({
		loadsActiveFilter,
		setEditedLoad,
		toggleDrawer,
		handleClick,
		page: loadsActiveFilter === "active" ? "loads" : "broker",
	});

	const onNotesActivity = () => {
		setAnchorEl(false);
		toggleDrawer("right", true);
	};

	const handleKeyDown = async (event) => {
		if (event.keyCode === 13 && event.shiftKey) {
			setNotesValue("");
			event.preventDefault();
			const newNote = {
				text: event.target.value,
				createdTime: new Date().toISOString(),
			};
			setEditedLoad({
				...editedLoad,
				activity: {
					...editedLoad.activity,
					private: [...editedLoad.activity.private, newNote],
				},
			});
			await addPrivateNotes({ id: editedLoad._id, body: { privateNote: event.target.value } });
		}
	};

	const handleTrack = () => {
		window.open(ROUTES.PATHS.TRACK, "_blank");
	};

	const handleDeleteMultiples = async () => {
		setAnchorEl(null);
		confirm({
			title: "Are you sure want to delete the selected loads?",
			description: "Once deleted, this data can't be restored.",
			confirmationText: isLoadingDeleteSingle ? "Deleting..." : "Delete",
		})
			.then(async () => {
				const delLoad = await deleteLoadMultiples(deletedIds).unwrap();
				if (delLoad.success) {
					setDeletedIds([]);
					triggerLoads(lastLoadsQuery, true);
					refetchLoadCounts();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const updatePaymentStatusOfLoad = async (status) => {
		setBackDropOpen(true);
		setAnchorEl(null);
		await updateLoadPaymentStatus({
			id: editedLoad._id,
			payload: { paymentStatus: status, lastBrokerPaymentStatus: status, page: "load" },
		});
		refetchLoadCounts();
		setBackDropOpen(false);
		triggerLoads(lastLoadsQuery, false);
	};

	const confirm = useConfirm();

	const tableDataFetch = async (props) => {
		const {
			status = "active",
			page = 1,
			rowsPerPage = 15,
			orderBy = "loadId",
			order = "desc",
			search = "",
		} = props;
		const queryString = `?status=${status}&page=${page}&rowsPerPage=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}`;
		dispatch(setLastLoadsQuery(queryString));
		try {
			await triggerLoads(queryString, true);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleTabClick = async (key) => {
		tableDataFetch({ status: key });
		dispatch(setLoadsActiveFilter(key));
	};

	const onPageChange = ({ page }) => {
		tableDataFetch({ status: loadsActiveFilter, page });
	};

	const params = new URLSearchParams(lastLoadsQuery);
	const page = params.get("page");

	useEffect(() => {
		tableDataFetch({ status: loadsActiveFilter, page: page ? page : 1 });
	}, []);

	const [searchQuery, setSearchQuery] = useState("");

	const Toolbar = () => {
		const [searchVal, setSearchVal] = useState(searchQuery);
		const [showClearIcon, setShowClearIcon] = useState(searchQuery === "" ? "none" : "flex");

		const handleChangeSearch = (event) => {
			if (event.target.value.length < 1) {
				tableDataFetch({ status: loadsActiveFilter });
			}
			setSearchVal(event.target.value);
			setShowClearIcon(event.target.value === "" ? "none" : "flex");
		};

		const handleSearch = async (event, key = false) => {
			if ((key && event.keyCode === 13) || key === false) {
				try {
					setSearchQuery(searchVal);
					tableDataFetch({ status: loadsActiveFilter, search: searchVal });
				} catch (error) {
					console.log(error);
				}
			}
		};

		const handleClear = () => {
			tableDataFetch({ status: loadsActiveFilter });
			setShowClearIcon("none");
			setSearchVal("");
			setSearchQuery("");
		};

		return (
			<>
				<FormControl>
					<div style={{ display: "flex", alignItem: "center", gap: "0px" }}>
						<TextField
							size="small"
							variant="outlined"
							sx={{ width: "220px" }}
							onChange={handleChangeSearch}
							onKeyDown={(event) => handleSearch(event, true)}
							placeholder="Search"
							value={searchVal}
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
			</>
		);
	};

	return (
		<>
			{/* <PDFViewer style={{ width: "100%", height: "100vh" }}>
				<Invoice />
			</PDFViewer> */}

			<div className={styles.orderArea}>
				{loadsData && (
					<Stack className={styles.orderTop} direction="row" spacing={1}>
						<ButtonGroup size="92" variant="outlined" aria-label="tooltip button group">
							<Tooltip arrow title="Load Active">
								<Button
									variant={
										loadsActiveFilter === "active" && searchQuery === "" ? "contained" : "outlined"
									}
									startIcon={<LocalShipping />}
									onClick={() => handleTabClick("active")}
								>
									Active
									<Chip
										sx={
											loadsActiveFilter === "active" && searchQuery === ""
												? { color: "white", border: "1px solid #FFFFFF" }
												: {}
										}
										style={{ marginLeft: "10px" }}
										size="small"
										label={
											loadsCount && loadsCount.counts && loadsCount.counts.activeCount
												? loadsCount.counts.activeCount
												: 0
										}
										variant={
											loadsActiveFilter === "active" && searchQuery === ""
												? "contained"
												: "outlined"
										}
									/>
								</Button>
							</Tooltip>
							<Tooltip arrow title="Load Delivered">
								<Button
									variant={
										loadsActiveFilter === "delivered" && searchQuery === ""
											? "contained"
											: "outlined"
									}
									startIcon={<CheckCircle />}
									onClick={() => handleTabClick("delivered")}
								>
									Delivered
									<Chip
										sx={
											loadsActiveFilter === "delivered" && searchQuery === ""
												? { color: "white", border: "1px solid #FFFFFF" }
												: {}
										}
										style={{ marginLeft: "10px" }}
										size="small"
										label={
											loadsCount && loadsCount.counts && loadsCount.counts.deliveredCount
												? loadsCount.counts.deliveredCount
												: 0
										}
										variant={
											loadsActiveFilter === "delivered" && searchQuery === ""
												? "contained"
												: "outlined"
										}
									/>
								</Button>
							</Tooltip>
							<Tooltip arrow title="Load Issued">
								<Button
									variant={
										loadsActiveFilter === "issued" && searchQuery === "" ? "contained" : "outlined"
									}
									startIcon={<ErrorOutlineIcon />}
									onClick={() => handleTabClick("issued")}
								>
									Issued
									<Chip
										sx={
											loadsActiveFilter === "issued" && searchQuery === ""
												? { color: "white", border: "1px solid #FFFFFF" }
												: {}
										}
										style={{ marginLeft: "10px" }}
										size="small"
										label={
											loadsCount && loadsCount.counts && loadsCount.counts.issueCount
												? loadsCount.counts.issueCount
												: 0
										}
										variant={
											loadsActiveFilter === "issued" && searchQuery === ""
												? "contained"
												: "outlined"
										}
									/>
								</Button>
							</Tooltip>
						</ButtonGroup>
						<div>
							<IconButton
								onClick={async () => {
									SetIsReload(true);
									await triggerLoads(lastLoadsQuery);
									await refetchLoadCounts();
									SetIsReload(false);
								}}
								color="primary"
								sx={{ marginRight: "8px" }}
							>
								{isReload ? (
									<CircularProgress size={24} color="primary" />
								) : (
									<Refresh fontSize="large" />
								)}
							</IconButton>
							{userData &&
								userData.user.accessFeatures &&
								userData.user.accessFeatures["Load"] &&
								userData.user.accessFeatures["Load"]["Create"] && (
									<Button
										variant="contained"
										onClick={() => {
											// setCurrentData(null);
											// reset();
											// setShowModal(true);
											navigate(ROUTES.PATHS.ADD_LOAD);
										}}
										size="small"
										startIcon={<FontAwesomeIcon icon={faPlus} />}
									>
										Add Load
									</Button>
								)}

							<Button
								variant="contained"
								onClick={handleTrack}
								startIcon={<GpsFixed />}
								color="secondary"
								size="small"
								sx={{ marginLeft: "8px" }}
							>
								Track
							</Button>
						</div>
					</Stack>
				)}
				<div style={{ width: "100%" }}>
					<ReusableTable
						setDeletedIds={setDeletedIds}
						deletedIds={deletedIds}
						handleDeleteMultiples={handleDeleteMultiples}
						columns={loadCols}
						data={loadsData && loadsData.loads ? loadsData.loads : []}
						initialOrderBy="loadId"
						initialOrder="desc"
						onPageChange={onPageChange}
						pages={loadsData && loadsData.pages ? loadsData.pages : 0}
						currentPage={loadsData && loadsData.page ? loadsData.page : page ? page : 1}
						isFetching={isFetching}
						Toolbar={Toolbar}
					/>
				</div>
				{currentData && customer && (
					<BolSection
						customerData={customer}
						showModal={showBolModal}
						load={currentData}
						setShowModal={setShowBolModal}
						handleBOLDownload={handleBOLDownload}
					/>
				)}
				{currentData && customer && (
					<RateconSection
						customerData={customer}
						showModal={showRateconModal}
						load={currentData}
						setShowModal={setShowRateconModal}
						handleRateconDownload={handleRateconDownload}
					/>
				)}
				{currentData && customer && (
					<InvoiceSection
						customerData={customer}
						showModal={showInvoiceModal}
						load={currentData}
						setShowModal={setShowInvoiceModal}
						handleInvoiceDownload={handleInvoiceDownload}
					/>
				)}
			</div>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem onClick={onNotesActivity}>Internal Notes</MenuItem>

				<MenuItem
					onClick={() => {
						handlePreviewBOLDownload(editedLoad, "BOL");
					}}
				>
					Create BOL
				</MenuItem>
				{/* <MenuItem
					onClick={() => {
						handlePreviewBOLDownload(editedLoad, "Ratecon");
					}}
				>
					Create Ratecon
				</MenuItem> */}

				{loadsActiveFilter === "delivered" && (
					<MenuItem
						onClick={() => {
							handlePreviewBOLDownload(editedLoad, "Invoice");
						}}
					>
						Create Invoice
					</MenuItem>
				)}

				<MenuItem onClick={() => updatePaymentStatusOfLoad("Delivered")}>Load Delivered</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Issue")}>Load Issue</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Cancelled")}>Load Cancelled</MenuItem>
				<MenuItem onClick={() => handleEdit(editedLoad)}>Update Load</MenuItem>
				{/* <MenuItem
					onClick={() => {
						handleLoadDetails(editedLoad);
					}}
				>
					Load Details
				</MenuItem> */}
				{userData &&
					userData.user.accessFeatures &&
					userData.user.accessFeatures["Load"] &&
					userData.user.accessFeatures["Load"]["Delete"] && (
					<MenuItem
						onClick={() => {
							setAnchorEl(null);
							confirm({
								title: "Are you sure want to delete?",
								description: "Once deleted, this data can't be restored.",
								confirmationText: isLoadingDeleteSingle ? "Deleting..." : "Delete",
							})
								.then(async () => {
									const res = await deleteLoad(editedLoad._id);
									if (res.data && res.data.success) {
										triggerLoads(lastLoadsQuery);
										refetchLoadCounts();
										toast.success("Load deleted successfully!");
									}
								})
								.catch((error) => {
									console.log(error);
								});
						}}
					>
						Delete Load
					</MenuItem>
				)}
				{editedLoad && editedLoad.hotLoad === 1 ? (
					<MenuItem
						onClick={async () => {
							setAnchorEl(false);
							await updateHotLoad({ id: editedLoad._id, payload: { hotLoad: 0 } });
							triggerLoads(lastLoadsQuery);
							refetchLoadCounts();
						}}
					>
						Clear Hot Load
					</MenuItem>
				) : (
					<MenuItem
						onClick={async () => {
							setAnchorEl(false);
							await updateHotLoad({ id: editedLoad._id, payload: { hotLoad: 1 } });
							triggerLoads(lastLoadsQuery);
							refetchLoadCounts();
						}}
					>
						Hot Load
					</MenuItem>
				)}
			</Menu>

			<AppDrawer open={drawerOpen} onClose={toggleDrawer} width={400}>
				<div style={{ padding: 12 }}>
					<div style={{ backgroundColor: "#edf3f6" }}>
						<Typography
							style={{ padding: "12px 0", fontSize: 18, color: "#5a75c5", textAlign: "center" }}
						>
							Internal Notes Activity
						</Typography>

						<TextField
							id="filled-search"
							label="(shift + enter) press to add notes"
							type="search"
							variant="filled"
							multiline
							rows={3}
							onKeyDown={handleKeyDown}
							fullWidth
							value={notesValue}
							onChange={(event) => setNotesValue(event.target.value)}
							sx={{ background: "#edf3f6" }}
						/>
					</div>

					<div style={{ height: "64vh", overflowY: "scroll", marginTop: 24 }}>
						{editedLoad?.activity?.private
							?.map((note) => (
								<div key={note.noteId} style={{ marginBottom: 24 }}>
									<div
										style={{
											borderRadius: 2,
											padding: "16px 8px",
											backgroundColor: "#EFF0FA",
										}}
									>
										<Typography variant="body2" sx={{ textAlign: "center" }}>
											{note.text}
										</Typography>
									</div>
									<Typography sx={{ fontSize: 11.5, textAlign: "center" }}>
										{dateUtils.differenceFromNow(note.createdTime)}
									</Typography>
								</div>
							))
							.reverse()}
					</div>
				</div>
			</AppDrawer>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={backDropOpen}
				onClick={handleCloseBackDrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
};

export default Loads;
