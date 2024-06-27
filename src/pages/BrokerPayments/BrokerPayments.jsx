import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import BOL from "../../components/LoadDocuments/BOL";
import styles from "./BrokerPayments.module.scss";

import {
	useAddPrivateNoteMutation,
	useGetLoadCountsAccQuery,
	useLazyGetDispatchedLoadsQuery,
	useLazyGetQuotesQuery,
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
	FormControl,
	InputAdornment,
	IconButton,
	Divider,
	Paper,
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
	Warning,
	Cancel,
	MonetizationOn,
	Error,
	Receipt,
	Clear,
} from "@mui/icons-material";
import { config } from "../../config";
import ReusableTable from "../../components/ReusableTable/ReusableTable";
import dateUtils from "../../utils/dateUtils";
import AppDrawer from "../../components/AppDrawer";
import { useDispatch, useSelector } from "react-redux";
import { setBrokerActiveFilter, setLastLoadsQueryBroker } from "../../store/slice/globalSlice";
import LoadFilterButton from "./LoadFilterButton";
import MUIModal from "../../components/MUIModal";
import LoadPaid from "./LoadPaid";
import useLoadCols from "../../hooks/useLoadCols/useLoadCols";
import globalUtils from "../../utils/globalUtils";
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

const BrokerPayments = () => {
	const [triggerLoads, { data: quotesData, isFetching: isLoading }] =
		useLazyGetDispatchedLoadsQuery();
	const { refetch: refetchLoadsAll } = useLazyGetQuotesQuery();
	const { data: loadCounts, refetch: refetchLoadCounts } = useGetLoadCountsAccQuery();
	const loadsActiveFilter = useSelector((state) => state.global.brokerActiveFilter);
	const [showBolModal, setShowBolModal] = useState(false);
	const [showRateconModal, setShowRateconModal] = useState(false);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [currentData, setCurrentData] = useState(null);
	const [deletedIds, setDeletedIds] = useState([]);

	const { data: userData } = useGetMeQuery();

	const [customer, setCustomer] = useState(null);
	const [backDropOpen, setBackDropOpen] = useState(false);
	const dispatch = useDispatch();

	const [updateLoadPaymentStatus] = useUpdateLoadPaymentStatusMutation();
	const getActualLoad = (load) => {
		console.log(quotesData);
		const actualLoadArr = quotesData.loads.map((item) => {
			if (item._id === load._id) return item;
		});
		const actualLoad = actualLoadArr.filter((item) => item !== null && item !== undefined);
		console.log("actualLoad", actualLoad[0]);
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

	const accessToken = localStorage.getItem(config.accessTokenName);

	const fileUpload = async (id, formData) => {
		try {
			const res = await axios.put(`${config.apiBaseUrl}/load/${id}/upload-invoice`, formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "multipart/form-data",
				},
			});
			triggerLoads(lastLoadsQuery, false);
			refetchLoadCounts();
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

	const handlePreviewBOLDownload = async (load, type) => {
		console.log(load.customer?._id, "customer");
		setCurrentData(null);
		setCustomer(null);
		setBackDropOpen(true);
		try {
			const headers = {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "multipart/form-data",
			};
			const customerRes = await axios.get(`${config.apiBaseUrl}/customers/${load.customer?._id}`, {
				headers,
			});
			console.log(customerRes, "CustomerRes");
			setCustomer(customerRes.data.customer);
			if (type === "BOL") setShowBolModal(true);
			else if (type === "Ratecon") setShowRateconModal(true);
			else setShowInvoiceModal(true);
			setCurrentData(load);
			setBackDropOpen(false);
			handleClose();
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
	};

	// This is for Dropdown
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [editedLoad, setEditedLoad] = useState(null);

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [notesValue, setNotesValue] = useState("");

	const [addPrivateNotes] = useAddPrivateNoteMutation();
	const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQueryBroker);

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
		page: "broker",
	});

	const updatePaymentStatusOfLoad = async (status) => {
		setBackDropOpen(true);
		setAnchorEl(null);
		await updateLoadPaymentStatus({
			id: editedLoad._id,
			payload: { paymentStatus: status, lastBrokerPaymentStatus: status },
		});
		refetchLoadCounts();
		triggerLoads(lastLoadsQuery, false)
			.unwrap()
			.then(() => setBackDropOpen(false));
		refetchLoadsAll();
	};

	const [showModalPaid, setShowModalPaid] = useState(false);

	const tableDataFetch = async (props) => {
		const {
			paymentStatus = "Delivered",
			page = 1,
			rowsPerPage = 15,
			orderBy = "loadId",
			order = "desc",
			cache,
			search = "",
		} = props;
		const queryString = `?paymentStatus=${paymentStatus}&page=${page}&rowsPerPage=${rowsPerPage}&orderBy=${orderBy}&order=${order}&type=broker&search=${search}`;
		dispatch(setLastLoadsQueryBroker(queryString));
		try {
			refetchLoadCounts();
			await triggerLoads(queryString, cache);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const onPageChange = ({ page }) => {
		tableDataFetch({ paymentStatus: globalUtils.snakeCaseToCapitalize(loadsActiveFilter), page });
	};

	useEffect(() => {
		tableDataFetch({
			paymentStatus: globalUtils.snakeCaseToCapitalize(loadsActiveFilter),
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
				tableDataFetch({
					paymentStatus: globalUtils.snakeCaseToCapitalize(loadsActiveFilter),
					cache: true,
				});
			}
			setSearchVal(event.target.value);
			setShowClearIcon(event.target.value === "" ? "none" : "flex");
		};

		const handleSearch = async (event, key = false) => {
			if ((key && event.keyCode === 13) || key === false) {
				try {
					setSearchQuery(searchVal);
					tableDataFetch({
						paymentStatus: globalUtils.snakeCaseToCapitalize(loadsActiveFilter),
						search: searchVal,
					});
				} catch (error) {
					console.log(error);
				}
			}
		};

		const handleClear = () => {
			tableDataFetch({
				paymentStatus: globalUtils.snakeCaseToCapitalize(loadsActiveFilter),
				cache: true,
			});
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
							<span style={{ color: "limegreen", fontWeight: "bold" }}>
								${quotesData?.customerTotalRate || 0}
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
									title: "Load Invoiced",
									startIcon: <Receipt />,
									btnText: "Invoiced",
									activeKey: "invoiced",
									length: loadCounts?.counts?.Invoiced || 0,
									key: "Invoiced",
								},
								{
									title: "Load Paid",
									startIcon: <Payment />,
									btnText: "Paid",
									activeKey: "paid",
									length: loadCounts?.counts?.Paid || 0,
									key: "Paid",
								},
								{
									title: "Load Overdue",
									startIcon: <Warning />,
									btnText: "Overdue",
									activeKey: "overdue",
									length: loadCounts?.counts?.Overdue || 0,
									key: "Overdue",
								},
								{
									title: "Load Cancelled",
									startIcon: <Cancel />,
									btnText: "Cancelled",
									activeKey: "cancelled",
									length: loadCounts?.counts?.Cancelled || 0,
									key: "Cancelled",
								},
								{
									title: "Load Issue",
									startIcon: <Error />,
									btnText: "Issue",
									activeKey: "issue",
									length: loadCounts?.counts?.Issue || 0,
									key: "Issue",
								},
								{
									title: "Load Factored",
									startIcon: <MonetizationOn />,
									btnText: "Factored",
									activeKey: "factored",
									length: loadCounts?.counts?.Factored || 0,
									key: "Factored",
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
										});
										dispatch(setBrokerActiveFilter(loadType.activeKey));
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
						isFetching={isLoading}
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
				{loadsActiveFilter === "delivered" && (
					<MenuItem
						onClick={() => {
							handlePreviewBOLDownload(editedLoad, "Invoice");
						}}
					>
						Create Invoice
					</MenuItem>
				)}

				{/* <MenuItem onClick={() => updatePaymentStatusOfLoad("Invoiced")}>Load Invoiced</MenuItem> */}
				<MenuItem
					onClick={() => {
						setShowModalPaid(true);
						setAnchorEl(null);
					}}
				>
					Load Paid
				</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Overdue")}>Load Overdue</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Cancelled")}>Load Cancelled</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Issue")}>Load Issue</MenuItem>
				<MenuItem onClick={() => updatePaymentStatusOfLoad("Factored")}>Load Factored</MenuItem>
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

export default BrokerPayments;
