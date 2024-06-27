import { Alert, Box, Divider, Grid, TextField, TextareaAutosize } from "@mui/material";
import React from "react";
import styles from "./Invoice.module.scss";
import { styled } from "@mui/system";
import { APP } from "../../../../../shared/constants";
import { formatDate, formatTime } from "../../../../../utils/dateUtils";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";

const blue = {
	100: "#DAECFF",
	200: "#b6daff",
	400: "#3399FF",
	500: "#007FFF",
	600: "#0072E5",
	900: "#003A75",
};

const grey = {
	50: "#f6f8fa",
	100: "#eaeef2",
	200: "#d0d7de",
	300: "#afb8c1",
	400: "#8c959f",
	500: "#6e7781",
	600: "#57606a",
	700: "#424a53",
	800: "#32383f",
	900: "#24292f",
};

const StyledTextarea = styled(TextareaAutosize)(
	({ theme }) => `
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 2px;
		padding-bottom: "2px",
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[500] : blue[200]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const Invoice = ({ register, setValue, watch, load, control, errors }) => {
	console.log(Boolean(errors.lastDate));
	return (
		<div className={styles.pdfArea}>
			<Box sx={{ marginBottom: "5px" }} display="flex" alignItems="center" gap={1}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Controller
						name="lastDate"
						control={control}
						defaultValue={null}
						rules={{ required: "Overdue date is required!" }}
						render={({ field }) => (
							<DateTimePicker
								{...field}
								label="Overdue date"
								slotProps={{ textField: { size: "small" } }}
								inputFormat="MM/dd/yyyy"
								value={field.value || null}
								onChange={(newValue) => {
									field.onChange(newValue);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										size="small"
										error={Boolean(errors.lastDate)}
										helperText={errors.lastDate?.message || ""}
									/>
								)}
							/>
						)}
					/>
				</LocalizationProvider>
				{Boolean(errors.lastDate) && (
					<Alert variant="outlined" severity="error">
						{errors.lastDate?.message || ""}
					</Alert>
				)}
			</Box>

			<div className="pdfMain">
				<Grid container spacing={2}>
					<Grid item sm={6}>
						<div className="logo mb-3">
							<img src={`/${APP}_Logo.png`} style={{ width: "130px", height: "auto" }} alt="Logo" />
						</div>
						<TextField
							{...register("address_1")}
							id="small-input"
							variant="outlined"
							size="small"
							className={styles.customInput}
							placeholder="address 1"
						/>
						<TextField
							{...register("address_2")}
							id="small-input"
							variant="outlined"
							size="small"
							className={styles.customInput}
							placeholder="address 2"
						/>

						<div className={styles.inlineLabelInput}>
							<label>
								<b>Phone: </b>
							</label>
							<TextField
								{...register("phone")}
								id="small-input"
								variant="outlined"
								size="small"
								className={styles.customInput}
							/>
						</div>
					</Grid>
					<Grid item sm={6}>
						<p>
							<b>INVOICE</b>
							<div className={styles.inlineLabelInput}>
								<label>
									<b>Invoice # </b>
								</label>
								<TextField
									{...register("loadId")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>

							<div className={styles.inlineLabelInput}>
								<label>
									<b>Date </b>
								</label>
								<TextField
									{...register("load_date")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>

							<div className={styles.inlineLabelInput}>
								<label>
									<b>Reference </b>
								</label>
								<TextField
									{...register("load_reference")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>

							<div className={styles.inlineLabelInput}>
								<label>
									<b>Weight </b>
								</label>
								<TextField
									{...register("weight")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>
						</p>
					</Grid>
				</Grid>
				<div className="customerInformation mt-4">
					<p>
						<b>Customer Information</b>
					</p>
					<Divider />
					<Grid style={{ marginTop: "2px" }} container columnSpacing={2} rowSpacing={1}>
						<Grid item sm={6}>
							<TextField
								{...register("company_name")}
								id="small-input"
								variant="outlined"
								size="small"
								className={styles.customInput}
								placeholder="Company Name"
							/>
							<TextField
								{...register("company_address")}
								id="small-input"
								variant="outlined"
								size="small"
								className={styles.customInput}
								placeholder="Company Address"
							/>
							<TextField
								{...register("company_phone")}
								id="small-input"
								variant="outlined"
								size="small"
								className={styles.customInput}
								placeholder="Company Phone"
							/>
						</Grid>
						<Grid item sm={6}>
							<div className={styles.inlineLabelInput}>
								<label style={{ minWidth: 136 }}>
									<b>Primary Contact </b>
								</label>
								<TextField
									{...register("billing_primary_contact")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>
							<div className={styles.inlineLabelInput}>
								<label style={{ minWidth: 136 }}>
									<b>Phone </b>
								</label>
								<TextField
									{...register("billing_primary_phone")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>
							<div className={styles.inlineLabelInput}>
								<label style={{ minWidth: 136 }}>
									<b>Fax </b>
								</label>
								<TextField
									{...register("billing_primary_fax")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>
						</Grid>
					</Grid>
				</div>
				<div className="stopActions" style={{ marginTop: "8px" }}>
					<b>Pay Items</b>
					<Divider />
					<table className={styles.table}>
						<thead>
							<tr>
								<th className={styles.header}> Description </th>
								<th className={styles.header}> Notes </th>
								<th className={styles.header}> Quantity </th>
								<th className={styles.header}> Rate </th>
								<th className={styles.header}> Amount </th>
							</tr>
						</thead>
						<tbody>
							<tr className={styles.row}>
								<td className={styles.cell}>
									{" "}
									<TextField
										{...register("paytm_description")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>{" "}
								</td>
								<td className={styles.cell}>
									{" "}
									<StyledTextarea
										{...register("paytm_notes")}
										minRows={1}
										aria-label="empty textarea"
									/>{" "}
								</td>
								<td className={styles.cell}>
									<div className={styles.inlineLabelInput}>
										<TextField
											{...register("paytm_quantity")}
											id="small-input"
											variant="outlined"
											size="small"
											className={styles.customInput}
											onChange={(e) => {
												setValue(
													"paytm_amount",
													Number(e.currentTarget.value) * watch("paytm_rate")
												);
											}}
										/>
									</div>
								</td>
								<td className={styles.cell}>
									{" "}
									<TextField
										{...register("paytm_rate")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>{" "}
								</td>
								<td className={styles.cell}>
									{" "}
									<TextField
										{...register("paytm_amount")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>{" "}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="stopActions" style={{ marginTop: "14px" }}>
					<h5>Stops / Actions</h5>
					<Divider />
					<table className={styles.table}>
						<thead>
							<tr>
								<th className={styles.header}> # </th>
								<th className={styles.header}> Action </th>
								<th className={styles.header}> Date/Time </th>
								<th className={styles.header}> Location </th>
								<th className={styles.header}> Contact </th>
							</tr>
						</thead>
						<tbody>
							<tr className={styles.row}>
								<td rowSpan="2" className={styles.cell}>
									{" "}
									1{" "}
								</td>
								<td className={styles.cell}> Pickup </td>
								<td className={styles.cell}>
									{load.pickUpList.map((pickup, index) => (
										<>
											{" "}
											<TextField
												{...register(`p_date${index}`)}
												id="small-input"
												variant="outlined"
												size="small"
												className={styles.customInput}
												placeholder="Date/Time"
												defaultValue={`${formatDate(pickup.pickUpOpeningDateTime)} ${formatTime(
													pickup.pickUpOpeningDateTime
												)}`}
											/>{" "}
										</>
									))}{" "}
								</td>
								<td className={styles.cell}>
									{load.pickUpList.map((pickup, index) => (
										<>
											{" "}
											<TextField
												{...register(`p_location${index}`)}
												id="small-input"
												variant="outlined"
												size="small"
												className={styles.customInput}
												placeholder="Location"
												defaultValue={pickup.pickUpLocation}
											/>{" "}
										</>
									))}
								</td>
								<td className={styles.cell}>
									{load.pickUpList.map((pickup, index) => (
										<div key={pickup._id} className={styles.inlineLabelInput}>
											<label>
												<b>Phone: </b>
											</label>
											<TextField
												{...register(`p_phone${index}`)}
												id="small-input"
												variant="outlined"
												size="small"
												className={styles.customInput}
												defaultValue=""
											/>
										</div>
									))}
								</td>
							</tr>
							<tr className={styles.row}>
								<td colSpan="4" className={`${styles.cell} ${styles.referenced}`}>
									<div className={styles.inlineLabelInput}>
										<label>
											<b>References: </b>
										</label>
										<TextField
											{...register("p_references")}
											id="small-input"
											variant="outlined"
											size="small"
											className={styles.customInput}
										/>
									</div>
								</td>
							</tr>
							<tr className={styles.row}>
								<td className={styles.cell}> 2 </td>
								<td className={styles.cell}> Delivery </td>
								<td className={styles.cell}>
									{load.destinationList.map((des, index) => (
										<>
											{" "}
											<TextField
												{...register(`d_date${index}`)}
												id="small-input"
												variant="outlined"
												size="small"
												className={styles.customInput}
												placeholder="Date/Time"
												defaultValue={`${formatDate(des.dropOpeningDateTime)} ${formatTime(
													des.dropOpeningDateTime
												)}`}
											/>{" "}
										</>
									))}
								</td>
								<td className={styles.cell}>
									{load.destinationList.map((des, index) => (
										<>
											{" "}
											<TextField
												{...register(`d_location${index}`)}
												id="small-input"
												variant="outlined"
												size="small"
												className={styles.customInput}
												placeholder="Location"
												defaultValue={des.destination}
											/>{" "}
										</>
									))}
								</td>
								<td className={styles.cell}>
									{load.destinationList.map((des, index) => (
										<div key={des._id} className={styles.inlineLabelInput}>
											<label>
												<b>Phone: </b>
											</label>
											<TextField
												{...register(`d_phone${index}`)}
												id="small-input"
												variant="outlined"
												size="small"
												className={styles.customInput}
												defaultValue=""
											/>
										</div>
									))}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			{Boolean(errors.lastDate) && (
				<Alert
					sx={{ textAlign: "right", float: "right", width: "320px", marginTop: "10px" }}
					variant="outlined"
					severity="error"
				>
					{errors.lastDate?.message || ""}
				</Alert>
			)}
		</div>
	);
};

export default Invoice;
