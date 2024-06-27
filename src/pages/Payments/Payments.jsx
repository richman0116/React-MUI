import moment from "moment";
import React, { useState } from "react";
import styles from "./Payments.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
	Button,
	ButtonGroup,
	Checkbox,
	Chip,
	FormControl,
	IconButton,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
} from "@mui/material";
import usePayments from "./hooks/usePayments";
import MakePayment from "../../components/UI/MakePayment/MakePayment";
import CrmTable from "../../components/CrmTable";
import { PaymentStatus, PaymentType } from "../../shared/constants";
import { COLORS } from "../../shared/colors";
import globalUtils from "../../utils/globalUtils";
import { EditNoteTwoTone } from "@mui/icons-material";

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

const Payments = () => {
	const {
		paymentOpen,
		setPaymentOpen,
		handleButtonClick,
		paymentsData,
		isFetching,
		activeButton,
		carriers,
		selectedCustomerId,
		handleChange,
		customers,
		selectedCarrierId,
		selectedAssetId,
		assets,
		loadId,
		handleEdit,
		setLoadId,
	} = usePayments();

	const getPaymentStatusColor = (status) => {
		switch (status) {
			case PaymentStatus.PAID:
				return "green";
			case PaymentStatus.PENDING:
				return "#F6D155";
			case PaymentStatus.DUE:
				return "red";

			default:
				return "blue";
		}
	};

	const [paymentColumn] = useState([
		{
			id: "loadId",
			label: "Load #",
			canBeSorted: true,
			render: (payment) => {
				return (
					<div>
						<p>{payment.load.loadId}</p>
					</div>
				);
			},
		},
		{
			id: "paymentType",
			label: "Payment Type",
			canBeSorted: true,
			render: (payment) => {
				return (
					<div
						style={{
							fontWeight: 500,
							color:
								payment.paymentType === PaymentType.INCOMING
									? COLORS.HOOKERS_GREEN
									: COLORS.DEEP_CHESNUT,
						}}
					>
						{globalUtils.snakeCaseToCapitalize(payment.paymentType)}
					</div>
				);
			},
		},
		{
			id: "customer",
			label: "Responsible Org/Person",
			canBeSorted: true,
			render: (payment) => {
				if (payment.paymentType === PaymentType.INCOMING) {
					return (
						<div>
							<div>
								<span style={{ color: COLORS.ZERO_CRAYOLA }}>{payment.customer?.name}</span>
								<span style={{ paddingLeft: "3px" }}>({payment.customer?.type})</span>
							</div>
							<div style={{ color: COLORS.EERIE_BLACK }}>
								{payment.customer?.phone} | {payment.customer?.email}
							</div>
						</div>
					);
				} else {
					return (
						<div>
							<div>
								<span style={{ color: COLORS.ZERO_CRAYOLA }}>
									{payment.carrier ? payment.carrier?.name : payment?.asset?.assignedDrivers}
								</span>
								<span style={{ paddingLeft: "3px" }}>
									({payment.carrier ? "Carrier" : "Driver"})
								</span>
							</div>
							<div style={{ color: COLORS.EERIE_BLACK }}>
								{payment.carrier ? payment.carrier?.phone : payment?.asset?.phone} |{" "}
								{payment.carrier ? payment.carrier?.email : payment?.asset?.email}
							</div>
						</div>
					);
				}
			},
		},
		{
			id: "processDate",
			label: "Process Date",
			canBeSorted: true,
			render: (payment) => {
				return (
					<div>
						<div>{moment(payment.processDate).format("MM-DD-YYYY")}</div>
						<div>{moment(payment.processDate).format("hh:mm A")}</div>
					</div>
				);
			},
		},
		{
			id: "amount",
			label: "Amount",
			canBeSorted: true,
			render: (payment) => {
				return (
					<div
						style={{
							fontWeight: 500,
							color:
								payment.paymentType === PaymentType.INCOMING
									? COLORS.HOOKERS_GREEN
									: COLORS.DEEP_CHESNUT,
						}}
					>
						{payment.paymentType === PaymentType.INCOMING
							? `+${payment.customerRate} $`
							: `-${payment.driverRate} $`}
					</div>
				);
			},
		},
		{
			id: "paymentMethod",
			label: "Pay Method",
			canBeSorted: true,
			render: (payment) => {
				return <div>{payment.paymentMethod}</div>;
			},
		},
		{
			id: "deadline",
			label: "Deadline",
			canBeSorted: true,
			render: (payment) => {
				return (
					<div>
						<div>{moment(payment.deadlineDate).format("MM-DD-YYYY")}</div>
						<div>{moment(payment.deadlineDate).format("hh:mm A")}</div>
					</div>
				);
			},
		},
		{
			id: "paymentStatus",
			label: "Status",
			canBeSorted: true,
			render: (payment) => {
				return (
					<Chip
						label={payment.paymentStatus.toUpperCase()}
						style={{
							padding: "0 12px",
							backgroundColor: `${getPaymentStatusColor(payment.paymentStatus)}`,
							color: `${payment.paymentStatus === PaymentStatus.PENDING ? "black" : "white"}`,
						}}
						size="small"
					/>
				);
			},
		},
		// {
		// 	id: "notes",
		// 	label: "Notes",
		// 	canBeSorted: true,
		// 	render: (payment) => {
		// 		return <span>{payment.notesPrivate}</span>;
		// 	},
		// },
		{
			id: "action",
			label: "Action",
			render: (load) => {
				return (
					<div className={styles.actionFlex}>
						{/* <div>
							<WarningIcon fontSize="small" htmlColor="#F24C3D" />
						</div>

						<div>
							<VisibilityIcon fontSize="small" htmlColor="blue" />
						</div> */}

						<IconButton
							onClick={() => handleEdit(load.load._id)}
							aria-label="edit"
							style={{ color: COLORS.CRAYOLA }}
						>
							<EditNoteTwoTone />
						</IconButton>

						{/* <Box>
							<Button
								id="basic-button"
								aria-controls={open ? "basic-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}
								onClick={(event) => handleClick(event, load)}
							>
								<FontAwesomeIcon icon={faEllipsisV} style={{ color: COLORS.CRAYOLA }} />
							</Button>
						</Box> */}
					</div>
				);
			},
		},
	]);
	return (
		<div className={styles.paymentsArea}>
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
			<div className={styles.filterArea}>
				<ButtonGroup color="info" variant="outlined" aria-label="outlined button group">
					<Button
						variant={activeButton === "all" ? "contained" : "outlined"}
						onClick={() => handleButtonClick("all")}
					>
						All
					</Button>
					<Button
						variant={activeButton === "incoming" ? "contained" : "outlined"}
						onClick={() => handleButtonClick("incoming")}
					>
						Incoming
					</Button>
					<Button
						variant={activeButton === "outgoing" ? "contained" : "outlined"}
						onClick={() => handleButtonClick("outgoing")}
					>
						Outgoing
					</Button>
				</ButtonGroup>
				{customers && customers.customers?.length && (
					<FormControl size="small" sx={{ width: 300, marginLeft: "10px" }}>
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
					<FormControl size="small" sx={{ width: 300, marginLeft: "10px" }}>
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
					<FormControl size="small" sx={{ width: 300, marginLeft: "10px" }}>
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
			</div>

			<MakePayment loadId={loadId} open={paymentOpen} setOpen={setPaymentOpen} />

			<CrmTable
				columns={paymentColumn}
				// data={paymentsData || []}
				data={(paymentsData && !isFetching && paymentsData.payments) || []}
				loading={isFetching}
			/>
		</div>
	);
};

export default Payments;
