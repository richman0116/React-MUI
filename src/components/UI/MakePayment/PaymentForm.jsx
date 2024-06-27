import React, { useEffect, useState } from "react";
import {
	Box,
	Card,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styles from "./MakePayment.module.scss";

const PaymentForm = ({ load, setValue, register, errors, watch, pType }) => {
	const [handleProcessDate, setHandleProcessDate] = useState(
		pType === "incoming" && load.incomingPayment && load.incomingPayment.processDate
			? load.incomingPayment.processDate
			: pType === "outgoing" && load.outgoingPayment && load.outgoingPayment.processDate
			? load.outgoingPayment.processDate
			: dayjs(new Date())
	);

	const [handleDeadlineDate, setHandleDeadlineDate] = useState(
		dayjs(
			pType === "outgoing" && load.outgoingPayment ? load.outgoingPayment.deadlineDate : new Date()
		).add(1, "month")
	);

	const [paymentMethod, setPaymentMethod] = useState(
		pType === "incoming" && load.incomingPayment
			? load.incomingPayment.paymentMethod
			: pType === "outgoing" && load.outgoingPayment
			? load.outgoingPayment.paymentMethod
			: ""
	);
	const [pStatus, setPStatus] = useState(
		pType === "incoming" && load.incomingPayment
			? load.incomingPayment.paymentStatus
			: pType === "outgoing" && load.outgoingPayment
			? load.outgoingPayment.paymentStatus
			: ""
	);

	const handlePaymentMethod = (e) => {
		setPaymentMethod(e.target.value);
		setValue("paymentMethod", paymentMethod);
	};
	const handlePStatus = (e) => {
		setPStatus(e.target.value);
		setValue("paymentStatus", pStatus);
	};

	const updateProcessDate = (value) => {
		setHandleProcessDate(value.format("YYYY-MM-DD"));
		setValue("processDate", handleProcessDate);
	};

	const updateDeadlineDate = (value) => {
		setHandleDeadlineDate(value.format("YYYY-MM-DD"));
		setValue("deadlineDate", handleDeadlineDate);
	};
	useEffect(() => {
		setValue("loadId", load.loadId);
		setValue("paymentType", pType.toLowerCase());
	}, []);

	return (
		<div className="paymentForm">
			<b>loadId:</b> {load.loadId}
			<Box style={{ marginTop: "20px" }}>
				<Card
					sx={{
						width: "100%",
						padding: "10px 20px 20px 20px",
						marginBottom: "50px",
						borderWidth: 2,
					}}
					variant="outlined"
				>
					<Typography
						variant="h6"
						component="div"
						style={{ textAlign: "center", padding: "10px", color: "#4A5073" }}
					>
						{pType === "incoming" ? "Customer" : "Carrier"} Info
					</Typography>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={12} sm={6} lg={4}>
							<TextField
								fullWidth
								size="small"
								type="text"
								disabled
								label="Name"
								defaultValue={pType === "incoming" ? load.customer.name : load.carrier.name}
								className={styles.infoFields}
							/>
						</Grid>
						<Grid item xs={12} sm={6} lg={4}>
							<TextField
								fullWidth
								size="small"
								type="text"
								disabled
								label="Email"
								defaultValue={pType === "incoming" ? load.customer.name.split("-")[1] : ""}
								className={styles.infoFields}
							/>
						</Grid>
						<Grid item xs={12} sm={6} lg={4}>
							<TextField
								fullWidth
								size="small"
								type="text"
								disabled
								label="Contact"
								defaultValue={pType === "incoming" ? load.customer.number : load.carrier.phone}
								className={styles.infoFields}
							/>
						</Grid>
						<Grid item xs={12} sm={6} lg={4}>
							<TextField
								fullWidth
								size="small"
								type="text"
								disabled
								label={pType === "incoming" ? "Customer Rate" : "Carrier Rate"}
								defaultValue={pType === "incoming" ? load.customerRate : load.driverRate}
								className={styles.infoFields}
							/>
						</Grid>
						{pType === "incoming" && (
							<>
								<Grid item xs={12} sm={6} lg={4}>
									<TextField
										fullWidth
										size="small"
										type="text"
										disabled
										label="Customer Type"
										defaultValue={load.customer.type}
										className={styles.infoFields}
									/>
								</Grid>
								<Grid item xs={12} sm={6} lg={4}>
									<TextField
										fullWidth
										size="small"
										type="text"
										disabled
										label="Reference Number"
										defaultValue={load.referenceNumber}
										className={styles.infoFields}
									/>
								</Grid>
							</>
						)}
					</Grid>
				</Card>

				<Grid item xs={12} container spacing={2}>
					<Grid item xs={12} sm={6} lg={3}>
						<FormControl
							error={!!errors.paymentMethod}
							helperText={errors.paymentMethod?.message}
							size="small"
							fullWidth
						>
							<InputLabel style={{ zIndex: 9999 }} id="demo-simple-select-label">
								Payment Type
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								required
								{...register("paymentMethod", {
									required: {
										value: true,
										message: "Please select a payment type",
									},
								})}
								label="Payment Type"
								name="paymentMethod"
								defaultValue={paymentMethod}
								onChange={handlePaymentMethod}
							>
								<MenuItem value={"Check"}>Check</MenuItem>
								<MenuItem value={"ACH"}>ACH</MenuItem>
								<MenuItem value={"OTR"}>OTR</MenuItem>
								<MenuItem value={"Zelle"}>Zelle</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} lg={3}>
						<FormControl fullWidth>
							<InputLabel style={{ color: "#4A5073", fontWeight: "bold" }}>Payment Type</InputLabel>
							<Select
								fullWidth
								size="small"
								required
								label="Payment Status"
								{...register("paymentStatus", {
									required: {
										value: true,
										message: "Please select a payment type",
									},
								})}
								name="paymentStatus"
								defaultValue={pStatus || "pending"}
								onChange={handlePStatus}
							>
								<MenuItem value={"pending"}>Pending</MenuItem>
								<MenuItem value={"paid"}>Paid</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} lg={3}>
						<FormControl fullWidth>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									fullWidth
									size="small"
									required
									label="Process Date"
									{...register("processDate", {
										required: {
											value: true,
											message: "Please select a Process Date",
										},
									})}
									name="processDate"
									defaultValue={handleProcessDate}
									onChange={(value) => updateProcessDate(value)}
									className={styles.timePicker}
								/>
							</LocalizationProvider>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} lg={3}>
						<FormControl fullWidth>
							<LocalizationProvider
								dateAdapter={AdapterDayjs}
								style={{ display: "block", width: "100%" }}
							>
								<DatePicker
									fullWidth
									size="small"
									required
									label="Deadline Date"
									{...register("deadlineDate", {
										required: {
											value: true,
											message: "Please select a Deadline Date",
										},
									})}
									name="deadlineDate"
									defaultValue={handleDeadlineDate}
									onChange={(value) => updateDeadlineDate(value)}
									className={styles.timePicker}
								/>
							</LocalizationProvider>
						</FormControl>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default PaymentForm;
