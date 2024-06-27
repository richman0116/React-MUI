import React, { useState } from "react";
import { saveAs } from "file-saver";
import BOL from "../../components/LoadDocuments/BOL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import styles from "./DispatchedLoad.module.scss";
import CrmTable from "../../components/CrmTable";

// eslint-disable-next-line import/named
import { useGetDispatchedLoadsQuery } from "../../services/load";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import axios from "axios";
import BolSection from "../Loads/BolSection";
import Ratecon from "../../components/LoadDocuments/Ratecon";
import Invoice from "../../components/LoadDocuments/Invoice";
import RateconSection from "../Loads/RateconSection";
import InvoiceSection from "../Loads/InvoiceSection";
import { useGetMeQuery } from "../../services/user";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";
import { pdf } from "@react-pdf/renderer";
import { COLORS } from "../../shared/colors";
import { EditNoteTwoTone, CallReceived, CallMade } from "@mui/icons-material";
import MakePayment from "../../components/UI/MakePayment/MakePayment";
import useDispatchLoads from "./hooks/hooks";
import moment from "moment-timezone";
import { config } from "../../config";

const DispatchedLoads = () => {
	const {
		paymentsData,
		carriers,
		selectedCustomerId,
		handleChange,
		customers,
		selectedCarrierId,
		selectedAssetId,
		assets,
		setLoadId,
	} = useDispatchLoads();

	const { data: quotesData, isLoading } = useGetDispatchedLoadsQuery();
	const [showBolModal, setShowBolModal] = useState(false);
	const [showRateconModal, setShowRateconModal] = useState(false);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [currentData, setCurrentData] = useState(null);

	const navigate = useNavigate();

	const { data: userData } = useGetMeQuery();

	const [customer, setCustomer] = useState(null);
	const [paymentOpen, setPaymentOpen] = useState(false);
	const [backDropOpen, setBackDropOpen] = useState(false);

	const handleEdit = (data) => {
		navigate(`${ROUTES.PATHS.ADD_LOAD}?id=${data._id}`);
	};

	const getActualLoad = (load) => {
		const actualLoadArr = quotesData.loads.map((item) => {
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
		const customerRes = await axios.get(`${config.apiBaseUrl}/customers/${load.customer?.id}`);
		setCustomer(customerRes.data.customer);
		if (type === "BOL") setShowBolModal(true);
		else if (type === "Ratecon") setShowRateconModal(true);
		else setShowInvoiceModal(true);
		setCurrentData(load);
		setBackDropOpen(false);
		handleClose();
	};

	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 250,
			},
		},
	};

	// This is for Dropdown
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [editedLoad, setEditedLoad] = useState(null);

	const handleClick = (event, load) => {
		setAnchorEl(event.currentTarget);
		console.log("clicked", load);
		setEditedLoad(load);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setEditedLoad(null);
	};

	const [loadColumn] = useState([
		{
			id: "pro",
			label: "Pro Number",
			canBeSorted: true,
			render: (load) => {
				return (
					<div style={{ minWidth: "110px" }}>
						<p>
							{" "}
							<span style={{ color: "green" }}>UA2</span> |{" "}
							<span style={{ color: "red" }}>HCu</span>{" "}
						</p>
						<div>{load.loadId}</div>
					</div>
				);
			},
		},

		{
			id: "customerRate",
			label: "Client",
			canBeSorted: true,
			render: (load) => {
				return (
					<Box
						sx={{
							display: "flex",
							alignItems: "stretch",
							justifyContent: "flex-start",
							flexDirection: "row",
							gap: ".3rem",
							width: "270px",
						}}
					>
						<Box>
							<Box
								sx={{
									display: "flex",
									alignItems: "flex-start",
									justifyContent: "flex-start",
									flexDirection: "column",
								}}
							>
								<p>
									<div style={{ fontWeight: 600 }}>
										{load.customer.type === "shipper" ? "Customer" : "Broker"}
									</div>
									<p>{load.customer.name}</p>
								</p>

								<div>
									<div>
										<p style={{ fontWeight: "600", marginTop: "4px" }}>payment details:</p>
										{load.incomingPayment ? (
											<>
												<p className={styles.colorRed}>Rate: $ {load.customerRate}</p>
												<p>
													PaymentType :{" "}
													{load.incomingPayment
														? load.incomingPayment.paymentMethod
														: "No Payment Yet"}
												</p>
												<div style={{ fontSize: "11px", color: "red" }}>
													<p>
														Deadline date:{" "}
														{moment(load.incomingPayment.deadlineDate).format("MM-DD-YYYY")}
													</p>
													<p>
														Process date:{" "}
														{moment(load.incomingPayment.processDate).format("MM-DD-YYYY")}
													</p>
												</div>
											</>
										) : (
											<p> No incoming payment yet! </p>
										)}
									</div>
								</div>
							</Box>
						</Box>

						<Box
							sx={{
								display: "flex",
								alignItems: "flex-end",
								justifyContent: "flex-start",
								flexDirection: "column",
							}}
						>
							<Button
								sx={{
									textAlign: "center",
									fontSize: "10px",
									borderRadius: "20px",
									backgroundColor: "#618833",
									gap: "4px",
								}}
								size="small"
								startIcon={<CallReceived />}
								variant="contained"
							>
								Incoming
							</Button>
						</Box>
					</Box>
				);
			},
		},

		{
			id: "driverRate",
			label: "Unit/Carrier",
			canBeSorted: true,
			render: (load) => {
				return (
					<div className={styles.flexColumn}>
						<div>
							{load.isDriver ? (
								<div>
									<p>
										<div style={{ fontWeight: 600 }}>Driver</div>
									</p>
									<p>{load.asset?.assignedDrivers}</p>
									<p>{load.asset?.email}</p>
									<p>{load.asset?.contactNumber}</p>
								</div>
							) : (
								<div>
									<p>
										<div style={{ fontWeight: 600 }}>Carrier</div>
									</p>
									<p>{load?.carrier?.name}</p>
									<p>{load?.carrier?.email}</p>
									<p>{load?.carrier?.phone}</p>
								</div>
							)}

							<div>
								<div>
									<p style={{ fontWeight: "600", marginTop: "4px" }}>payment details:</p>

									{load.outgoingPayment ? (
										<>
											<span style={{ marginTop: "5px" }} className={styles.colorRed}>
												Rate: $ {load.driverRate}
											</span>
											<p>
												PaymentType :{" "}
												{load.outgoingPayment
													? load.outgoingPayment.paymentMethod
													: "No Payment Yet"}
											</p>
											<div style={{ fontSize: "11px", color: "red" }}>
												<p>
													Deadline date:{" "}
													{moment(load.outgoingPayment.deadlineDate).format("MM-DD-YYYY")}
												</p>
												<p>
													Process date:{" "}
													{moment(load.outgoingPayment.processDate).format("MM-DD-YYYY")}
												</p>
											</div>
										</>
									) : (
										<p>No outgoing payment yet!</p>
									)}
								</div>
							</div>
						</div>

						<div>
							<div>
								<Button
									sx={{
										textAlign: "center",
										fontSize: "10px",
										borderRadius: "20px",
										backgroundColor: "#f50057",
										gap: "4px",
									}}
									size="small"
									startIcon={<CallMade />}
									variant="contained"
								>
									Outgoing
								</Button>
							</div>
						</div>
					</div>
				);
			},
		},

		// {
		// 	id: "date",
		// 	label: "Date",
		// 	canBeSorted: true,
		// 	render: (load) => {
		// 		return (
		// 			<div
		// 				style={{
		// 					display: "flex",
		// 					gap: "1rem",
		// 					flexDirection: "column",
		// 					justifyContent: "center",
		// 					alignItems: "flex-start",
		// 				}}
		// 			>
		// 				<div
		// 					style={{
		// 						display: "flex",
		// 						flexDirection: "column",
		// 						justifyContent: "flex-start",
		// 						alignItems: "flex-start",
		// 						padding: "4px 4px 4px 6px",
		// 						boxShadow: "0 5x 2px 3px rgba(0,0,0,.3)",
		// 						borderRadius: "5px",
		// 						backgroundColor: "#e2e2e2",
		// 						width: "130px",
		// 					}}
		// 				>
		// 					<Typography
		// 						sx={{
		// 							textAlign: "center",
		// 							fontSize: "12px",
		// 							borderRadius: "20px",
		// 							gap: "4px",
		// 							color: "black",
		// 							textTransform: "uppercase",
		// 							fontWeight: "500",
		// 							mb: "5px",
		// 						}}
		// 					>
		// 						Incoming
		// 					</Typography>
		// 					<Box>
		// 						<span style={{ color: "#191919" }}>process date: </span>
		// 						<span style={{ color: "red" }}>{"It's Coming"}</span>
		// 					</Box>
		// 					<Box>
		// 						deadline:
		// 						{load.incomingPayment ? (
		// 							<div style={{ fontSize: "11px", color: "red" }}>
		// 								<p>{moment(load.incomingPayment.deadlineDate).format("MM-DD-YYYY")}</p>
		// 								<p>{moment(load.incomingPayment.deadlineDate).format("hh:mm A")}</p>
		// 							</div>
		// 						) : (
		// 							"It's Coming"
		// 						)}
		// 					</Box>
		// 				</div>

		// 				<div
		// 					style={{
		// 						display: "flex",
		// 						flexDirection: "column",
		// 						justifyContent: "flex-start",
		// 						alignItems: "flex-start",
		// 						padding: "4px 4px 4px 6px",
		// 						boxShadow: "0 5x 2px 3px rgba(0,0,0,.3)",
		// 						borderRadius: "5px",
		// 						backgroundColor: "#e2e2e2",
		// 						width: "130px",
		// 					}}
		// 				>
		// 					<Typography
		// 						sx={{
		// 							textAlign: "center",
		// 							fontSize: "12px",
		// 							borderRadius: "20px",
		// 							gap: "4px",
		// 							color: "black",
		// 							textTransform: "uppercase",
		// 							fontWeight: "500",
		// 							mb: "5px",
		// 						}}
		// 					>
		// 						Outgoing
		// 					</Typography>
		// 					<Box>
		// 						<span style={{ color: "#191919" }}>process date: </span>
		// 						<span style={{ color: "red" }}>{"It's Coming"}</span>
		// 					</Box>
		// 					<span style={{ fontSize: "11px", color: "#191919" }}>deadline:{" It's Coming "}</span>
		// 				</div>
		// 			</div>
		// 		);
		// 	},
		// },

		{
			id: "notes",
			label: "Notes",
			canBeSorted: true,
			render: (load) => {
				return <span>{load.notesPrivate}</span>;
			},
		},

		{
			id: "action",
			label: "Action",
			render: (load) => {
				return (
					<div className={styles.actionFlex}>
						<IconButton
							onClick={() => handleEdit(load)}
							aria-label="edit"
							style={{ color: COLORS.CRAYOLA }}
						>
							<EditNoteTwoTone />
						</IconButton>

						<Box>
							<Button
								id="basic-button"
								aria-controls={open ? "basic-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}
								onClick={(event) => handleClick(event, load)}
							>
								<FontAwesomeIcon icon={faEllipsisV} style={{ color: COLORS.CRAYOLA }} />
							</Button>
						</Box>
					</div>
				);
			},
		},
	]);

	return (
		<>
			<div className={styles.orderArea}>
				{/* <div className={styles.filterArea}>
					{customers && customers.customers?.length && (
						<FormControl size="small" sx={{ width: 280, marginLeft: "10px" }}>
							<InputLabel id="demo-multiple-checkbox-label">Customer</InputLabel>
							<Select
								labelId="demo-multiple-checkbox-label"
								id="demo-multiple-checkbox"
								multiple
								value={selectedCustomerId}
								onChange={(event) => handleChange(event, "customer")}
								input={<OutlinedInput label="Customer" />}
								renderValue={(selected) =>
									selected
										.map((customerId) => {
											const customer = customers.customers.find((cust) => cust._id === customerId);
											return customer ? customer.customerName : "";
										})
										.join(", ")
								}
								MenuProps={MenuProps}
							>
								{customers.customers.map((customer) => (
									<MenuItem key={customer._id} value={customer._id}>
										<Checkbox checked={selectedCustomerId.indexOf(customer._id) > -1} />
										<ListItemText primary={customer.customerName} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					{carriers && carriers.carriers?.length && (
						<FormControl size="small" sx={{ width: 280, marginLeft: "10px" }}>
							<InputLabel id="demo-multiple-checkbox-label">Carrier</InputLabel>
							<Select
								labelId="demo-multiple-checkbox-label"
								id="demo-multiple-checkbox"
								multiple
								value={selectedCarrierId}
								onChange={(event) => handleChange(event, "carrier")}
								input={<OutlinedInput label="Carrier" />}
								renderValue={(selected) =>
									selected
										.map((carrierId) => {
											const carrier = carriers.carriers.find((car) => car._id === carrierId);
											return carrier ? carrier.name : "";
										})
										.join(", ")
								}
								MenuProps={MenuProps}
							>
								{carriers.carriers.map((carrier) => (
									<MenuItem key={carrier._id} value={carrier._id}>
										<Checkbox checked={selectedCarrierId.indexOf(carrier._id) > -1} />
										<ListItemText primary={carrier.name} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					{assets && assets.assets?.length && (
						<FormControl size="small" sx={{ width: 280, marginLeft: "10px" }}>
							<InputLabel id="demo-multiple-checkbox-label">Driver</InputLabel>
							<Select
								labelId="demo-multiple-checkbox-label"
								id="demo-multiple-checkbox"
								multiple
								value={selectedAssetId}
								onChange={(event) => handleChange(event, "asset")}
								input={<OutlinedInput label="Driver" />}
								renderValue={(selected) =>
									selected
										.map((assetId) => {
											const asset = assets.assets.find((car) => car._id === assetId);
											return asset ? asset.assignedDrivers : "";
										})
										.join(", ")
								}
								MenuProps={MenuProps}
							>
								{assets.assets.map((asset) => (
									<MenuItem key={asset._id} value={asset._id}>
										<Checkbox checked={selectedAssetId.indexOf(asset._id) > -1} />
										<ListItemText primary={asset.assignedDrivers} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					<div className={styles.btnArea}>
						<Button
							variant="contained"
							onClick={() => {
								setLoadId(null);
								setPaymentOpen(true);
							}}
							size="small"
							startIcon={<FontAwesomeIcon icon={faPlus} />}
						>
							Add Payment
						</Button>
					</div>
				</div> */}

				<CrmTable
					columns={loadColumn}
					data={quotesData ? quotesData.loads : []}
					loading={isLoading}
				/>

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

			<MakePayment loadId={editedLoad?._id} open={paymentOpen} setOpen={setPaymentOpen} />

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem
					onClick={() => {
						setPaymentOpen(true);
						setAnchorEl(null);
					}}
				>
					Make Payment
				</MenuItem>
				<MenuItem
					onClick={() => {
						handlePreviewBOLDownload(editedLoad, "BOL");
					}}
				>
					Create BOL
				</MenuItem>
				<MenuItem
					onClick={() => {
						handlePreviewBOLDownload(editedLoad, "Ratecon");
					}}
				>
					Create Ratecon
				</MenuItem>
				<MenuItem
					onClick={() => {
						handlePreviewBOLDownload(editedLoad, "Invoice");
					}}
				>
					Create Invoice
				</MenuItem>
			</Menu>
		</>
	);
};

export default DispatchedLoads;
