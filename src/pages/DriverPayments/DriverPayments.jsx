import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import BOL from "../../components/LoadDocuments/BOL";
import styles from "./DriverPayments.module.scss";

import {
	useAddPrivateNoteMutation,
	useGetLoadCountsAccQuery,
	useLazyGetDispatchedLoadsQuery,
	useUpdateLoadPaymentStatusMutation,
} from "../../services/load";
import {
	Backdrop,
	ButtonGroup,
	CircularProgress,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Typography,
	Divider,
	Paper,
	FormControl,
	InputAdornment,
	IconButton,
} from "@mui/material";
import axios from "axios";
import BolSection from "../Loads/BolSection";
import Ratecon from "../../components/LoadDocuments/Ratecon";
import Invoice from "../../components/LoadDocuments/Invoice";
import RateconSection from "../Loads/RateconSection";
import InvoiceSection from "../Loads/InvoiceSection";
import { useGetMeQuery } from "../../services/user";
import { pdf } from "@react-pdf/renderer";
import {
	LocalShipping,
	Payment,
	Cancel,
	NextWeekOutlined,
	WeekendOutlined,
	Clear,
} from "@mui/icons-material";
import { config } from "../../config";
import ReusableTable from "../../components/ReusableTable/ReusableTable";
import dateUtils from "../../utils/dateUtils";
import AppDrawer from "../../components/AppDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
	setBrokerActiveFilter,
	setDriverActiveFilter,
	setLastLoadsQueryDriver,
} from "../../store/slice/globalSlice";
import LoadFilterButton from "./LoadFilterButton";
import MUIModal from "../../components/MUIModal";
import LoadPaid from "./LoadPaid";
import useLoadCols from "../../hooks/useLoadCols/useLoadCols";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: "darkslateblue",
	height: "30px",
	display: "flex",
	alignItems: "center",
	gap: "5px",
}));

const DriverPayments = () => {
	const [triggerLoads, { data: quotesData, isFetching }] = useLazyGetDispatchedLoadsQuery();
	const loadsActiveFilter = useSelector((state) => state.global.driverActiveFilter);
	const { data: loadCounts, refetch: refetchLoadCounts } = useGetLoadCountsAccQuery();
	const [showBolModal, setShowBolModal] = useState(false);
	const [showRateconModal, setShowRateconModal] = useState(false);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [currentData, setCurrentData] = useState(null);
	const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQueryDriver);

	const { data: userData } = useGetMeQuery();

	const [customer, setCustomer] = useState(null);
	const [deletedIds, setDeletedIds] = useState([]);
	const [backDropOpen, setBackDropOpen] = useState(false);
	const dispatch = useDispatch();

	const [updateLoadPaymentStatus] = useUpdateLoadPaymentStatusMutation();

	const getActualLoad = (load) => {
		const actualLoadArr = quotesData.loads.map((item) => {
			if (item._id === load._id) return item;
		});
		const actualLoad = actualLoadArr.filter((item) => item !== null && item !== undefined);
		return actualLoad[0];
	};

	const handleCloseBackDrop = () => {
		setBackDropOpen(false);
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

	const fileUpload = async (id, formData) => {
		try {
			const res = await axios.put(`${config.apiBaseUrl}/load/${id}/upload-invoice`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			triggerLoads(lastLoadsQuery);
			refetchLoadCounts();
			dispatch(
				setBrokerActiveFilter(res.data.data.paymentStatus === "Invoiced" ? "invoiced" : "factored")
			);
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
	};

	const handleInvoiceDownload = async (load) => {
		try {
			setShowInvoiceModal(false);
			const blob = await pdf(
				<Invoice load={load} userData={userData} loadApiData={getActualLoad(load)} />
			).toBlob();

			// Trigger download using saveAs
			saveAs(blob, `load_invoice_${load.loadId}.pdf`);

			// Create FormData object
			const formData = new FormData();
			formData.append("invoicedFile", blob, `load_invoice_${load.loadId}.pdf`);

			// Upload FormData to backend
			await fileUpload(load._id, formData);

			console.log("Download and upload successful");
		} catch (error) {
			console.error("Error performing download and upload", error);
		}
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [editedLoad, setEditedLoad] = useState(null);

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [notesValue, setNotesValue] = useState("");

	const [addPrivateNotes] = useAddPrivateNoteMutation();

	const toggleDrawer = (anchor, open) => {
		setDrawerOpen(open);
	};

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

	const handleClick = (event, load) => {
		setAnchorEl(event.currentTarget);
		setEditedLoad(load);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setEditedLoad(null);
	};

	const { loadCols } = useLoadCols({
		loadsActiveFilter,
		setEditedLoad,
		toggleDrawer,
		handleClick,
		page: "driver",
	});

	const updatePaymentStatusOfLoad = async (status) => {
		setBackDropOpen(true);
		setAnchorEl(null);
		await updateLoadPaymentStatus({
			id: editedLoad._id,
			payload: { paymentStatus: status, lastDriverPaymentStatus: status },
		});
		refetchLoadCounts();
		triggerLoads(lastLoadsQuery, false)
			.unwrap()
			.then(() => setBackDropOpen(false));
	};

	const [showModalPaid, setShowModalPaid] = useState(false);

	const tableDataFetch = async (props) => {
		const {
			paymentStatus = "Delivered",
			page = 1,
			rowsPerPage = 15,
			orderBy = "loadId",
			order = "desc",
			cache = false,
			search = "",
		} = props;
		const queryString = `?paymentStatus=${paymentStatus}&page=${page}&rowsPerPage=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}&type=driver`;
		dispatch(setLastLoadsQueryDriver(queryString));
		try {
			refetchLoadCounts();
			await triggerLoads(queryString, cache);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const convertedStringFun = (str) => {
		const convertedString = str
			.split("_")
			.map((word, index) => {
				if (index === 0) {
					return word.charAt(0).toUpperCase() + word.slice(1);
				}
				return word;
			})
			.join(" ");
		return convertedString;
	};

	const onPageChange = ({ page }) => {
		const convertedString = convertedStringFun(loadsActiveFilter);
		tableDataFetch({ paymentStatus: convertedString, page });
	};

	useEffect(() => {
		const convertedString = convertedStringFun(loadsActiveFilter);

		tableDataFetch({
			paymentStatus: convertedString,
			page: 1,
		});
	}, []);

	const handleDeleteMultiples = async () => {
		// setAnchorEl(null);
		// confirm({
		// 	title: "Are you sure want to delete the selected loads?",
		// 	description: "Once deleted, this data can't be restored.",
		// 	confirmationText: isLoadingDeleteSingle ? "Deleting..." : "Delete",
		// })
		// 	.then(async () => {
		// 		const delLoad = await deleteLoadMultiples(deletedIds).unwrap();
		// 		if (delLoad.success) {
		// 			setDeletedIds([]);
		// 			triggerLoads(lastLoadsQuery, true);
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
	};

	const [searchQuery, setSearchQuery] = useState("");

	const Toolbar = () => {
		const [searchVal, setSearchVal] = useState(searchQuery);
		const [showClearIcon, setShowClearIcon] = useState(searchQuery === "" ? "none" : "flex");

		const handleChangeSearch = (event) => {
			if (event.target.value.length < 1) {
				tableDataFetch({ paymentStatus: convertedStringFun(loadsActiveFilter), cache: true });
			}
			setSearchVal(event.target.value);
			setShowClearIcon(event.target.value === "" ? "none" : "flex");
		};

		const handleSearch = async (event, key = false) => {
			if ((key && event.keyCode === 13) || key === false) {
				try {
					setSearchQuery(searchVal);
					tableDataFetch({
						paymentStatus: convertedStringFun(loadsActiveFilter),
						search: searchVal,
						cache: false,
					});
				} catch (error) {
					console.log(error);
				}
			}
		};

		const handleClear = () => {
			tableDataFetch({ paymentStatus: convertedStringFun(loadsActiveFilter), cache: true });
			setShowClearIcon("none");
			setSearchVal("");
			setSearchQuery("");
		};

		return (
			<>
				<div>
					<Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
						<Item>
							Total:{" "}
							<span style={{ color: "tomato", fontWeight: "bold" }}>
								${quotesData?.driverTotalRate || 0}
							</span>
						</Item>
					</Stack>
				</div>
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
			<div className={styles.orderArea}>
				{quotesData && (
					<Stack className={styles.orderTop} direction="row" spacing={1}>
						<ButtonGroup size="92" variant="outlined" aria-label="tooltip button group">
							{[
								{
									title: "Load Delivered",
									startIcon: <LocalShipping />,
									btnText: "Delivered",
									activeKey: "delivered",
									length: loadCounts?.counts?.Delivered || 0,
									key: "Delivered",
								},
								{
									title: "Load Cancelled",
									startIcon: <Cancel />,
									btnText: "Cancelled",
									activeKey: "cancelled",
									length: loadCounts?.counts?.Cancelled || 0,
									key: "Cancelled",
								},
								// {
								// 	title: "Load Due",
								// 	startIcon: <Warning />,
								// 	btnText: "Due",
								// 	activeKey: "due",
								// 	loads: overDueLoads || [],
								// },
								{
									title: "Load Paid",
									startIcon: <Payment />,
									btnText: "Paid",
									activeKey: "driverPaid",
									length: loadCounts?.counts?.DriverPaid || 0,
									key: "DriverPaid",
								},
								{
									title: "This Week",
									startIcon: <WeekendOutlined />,
									btnText: "This Week",
									activeKey: "this_week",
									length: loadCounts?.counts["This week"] || 0,
									key: "This week",
								},
								{
									title: "Next Week",
									startIcon: <NextWeekOutlined />,
									btnText: "Next Week",
									activeKey: "next_week",
									length: loadCounts?.counts["Next week"] || 0,
									key: "Next week",
								},
							].map((loadType) => (
								<LoadFilterButton
									key={loadType.activeKey}
									title={loadType.title}
									startIcon={loadType.startIcon}
									btnText={loadType.btnText}
									activeKey={loadType.activeKey}
									length={loadType.length}
									onClick={async () => {
										await tableDataFetch({
											paymentStatus: loadType.key,
											cache: false,
										});
										dispatch(setDriverActiveFilter(loadType.activeKey));
									}}
								/>
							))}
						</ButtonGroup>
					</Stack>
				)}
				<div style={{ width: "100%" }}>
					<ReusableTable
						setDeletedIds={setDeletedIds}
						deletedIds={deletedIds}
						handleDeleteMultiples={handleDeleteMultiples}
						columns={loadCols}
						data={quotesData && quotesData.loads ? quotesData.loads : []}
						initialOrderBy="loadId"
						initialOrder="desc"
						onPageChange={onPageChange}
						pages={quotesData && quotesData.pages ? quotesData.pages : 0}
						currentPage={quotesData && quotesData.page ? quotesData.page : 1}
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
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Delivered")}>Load Delivered</MenuItem>

				<MenuItem
					onClick={() => {
						setShowModalPaid(true);
						setAnchorEl(null);
					}}
				>
					Load Paid
				</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Due")}>Load Due</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("This week")}>This week</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Next week")}>Next week</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Cancelled")}>Load Cancelled</MenuItem>
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
			<MUIModal
				showModal={showModalPaid}
				setShowModal={setShowModalPaid}
				modalTitle="Load Paid"
				modalClassName="wd-65"
				isFooter={false}
				modalBodyComponent={
					<LoadPaid currentData={editedLoad} setShowModalPaid={setShowModalPaid} />
				}
			/>

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

export default DriverPayments;
