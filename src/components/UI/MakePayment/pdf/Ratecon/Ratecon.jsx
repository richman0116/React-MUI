import { Divider, Grid, TextField, TextareaAutosize } from "@mui/material";
import React from "react";
import styles from "./Ratecon.module.scss";
import { styled } from "@mui/system";
import { APP } from "../../../../../shared/constants";

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
    padding: 12px;
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
const DriverName = () => {
	return (
		<div>
			<div className={styles.spacedText}></div>
			<div className={styles.underline} />
			<div className="print">Driver Name</div>
		</div>
	);
};

const DriverCellPhone = () => {
	return (
		<div>
			<div className={styles.spacedText}></div>
			<div className={styles.underline} />
			<div className="sig">Driver Cell Phone #</div>
		</div>
	);
};

const PrintName = () => {
	return (
		<div>
			<div className={styles.spacedText}></div>
			<div className={styles.underline} />
			<div className="dateack">Print Name</div>
		</div>
	);
};

const Signature = () => {
	return (
		<div>
			<div className={styles.spacedText}></div>
			<div className={styles.underline} />
			<div className="sig">Signature</div>
		</div>
	);
};
const Date = () => {
	return (
		<div>
			<div className={styles.spacedText}></div>
			<div className={styles.underline} />
			<div className="dateack">Date</div>
		</div>
	);
};

const Ratecon = ({ register, setValue, watch, load }) => {
	return (
		<div className={styles.pdfArea}>
			<div className="pdfMain">
				<Grid container spacing={2}>
					<Grid item sm={6}>
						<div className="logo mb-3">
							<img src={`/${APP}_Logo.png`} style={{ width: "130px", height: "auto" }} />
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
						{/* <div className={styles.inlineLabelInput}>
							<label>
								<b>Docket: </b>
							</label>
							<TextField
								{...register("docket")}
								id="small-input"
								variant="outlined"
								size="small"
								className={styles.customInput}
							/>
						</div> */}

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
							<b>LOAD CONFIRMATION</b>
							<div className={styles.inlineLabelInput}>
								<label>
									<b>Load # </b>
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
									<b>Equipment </b>
								</label>
								<TextField
									{...register("equipment")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>

							{/* <div className={styles.inlineLabelInput}>
								<label>
									<b>Equipment length</b>
								</label>
								<TextField
									{...register("equipment_length")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div> */}

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
							{/* <div className={styles.inlineLabelInput}>
								<label>
									<b>Distance</b>
								</label>
								<TextField
									{...register("distance")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div> */}
						</p>
					</Grid>
				</Grid>
				<div className="customerInformation mt-4">
					<p>
						<b>{load.isDriver ? "Driver" : "Carrier"} Information</b>
					</p>
					<Divider />
					<Grid style={{ marginTop: "2px" }} container columnSpacing={2} rowSpacing={1}>
						{!load.isDriver && (
							<>
								<Grid item sm={4}>
									<TextField
										{...register("carrier_name")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
										placeholder="Carrier Name"
									/>
									<TextField
										{...register("carrier_address")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
										placeholder="Carrier Address"
									/>
									<TextField
										{...register("carrier_phone")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
										placeholder="Carrier Phone"
									/>
								</Grid>
								<Grid item sm={4}>
									<div className={styles.inlineLabelInput}>
										<label style={{ minWidth: 136 }}>
											<b>MC Number </b>
										</label>
										<TextField
											{...register("carrier_mc_number")}
											id="small-input"
											variant="outlined"
											size="small"
											className={styles.customInput}
										/>
									</div>
									<div className={styles.inlineLabelInput}>
										<label style={{ minWidth: 136 }}>
											<b>Primary Contact </b>
										</label>
										<TextField
											{...register("carrier_primary_contact")}
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
											{...register("carrier_primary_phone")}
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
											{...register("carrier_primary_fax")}
											id="small-input"
											variant="outlined"
											size="small"
											className={styles.customInput}
										/>
									</div>
								</Grid>
							</>
						)}

						{load.isDriver && (
							<Grid item sm={6}>
								<div className={styles.inlineLabelInput}>
									<label style={{ minWidth: 136 }}>
										<b>Driver </b>
									</label>
									<TextField
										{...register("driver")}
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
										{...register("driver_phone")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>
								</div>
								<div className={styles.inlineLabelInput}>
									<label style={{ minWidth: 136 }}>
										<b>Email </b>
									</label>
									<TextField
										{...register("driver_email")}
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
										{...register("driver_fax")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>
								</div>
							</Grid>
						)}
					</Grid>
				</div>
				<div className="notesReference mt-4">
					<p>
						<b>Notes and References</b>
					</p>
					<Divider />
					<Grid style={{ marginTop: "2px" }} container columnSpacing={2} rowSpacing={1}>
						<Grid item sm={12}>
							<div className={styles.inlineLabelInput}>
								<label>
									<b>Notes </b>
								</label>
								<StyledTextarea
									{...register("notes")}
									minRows={3}
									aria-label="empty textarea"
									placeholder="Notes"
								/>
							</div>
							<div className={styles.inlineLabelInput}>
								<label>
									<b>Reference(s) </b>
								</label>
								<TextField
									{...register("references_note")}
									id="small-input"
									variant="outlined"
									size="small"
									className={styles.customInput}
								/>
							</div>
						</Grid>
					</Grid>
				</div>
				<div className="stopActions mt-3">
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
												defaultValue={`${pickup.pickUpOpeningDateTime} - ${pickup.pickUpClosingDateTime}`}
											/>{" "}
										</>
									))}
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

									<div className={styles.inlineLabelInput}>
										<label>
											<b>Driver Instructions: </b>
										</label>
										<TextField
											{...register("driver_instructions")}
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
												defaultValue={`${des.dropOpeningDateTime} - ${des.dropClosingDateTime}`}
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

				<div className="stopActions mt-3">
					<h5>Pay Items</h5>
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
									<TextField
										{...register("pay_notes")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>
								</td>
								<td className={styles.cell}>
									<TextField
										{...register("quantity")}
										id="small-input"
										variant="outlined"
										size="small"
										type="number"
										className={styles.customInput}
										onChange={(e) => {
											setValue("amount", Number(e.currentTarget.value) * watch("rate"));
											setValue("total_amount", Number(e.currentTarget.value) * watch("rate"));
										}}
									/>
								</td>
								<td className={styles.cell}>
									<TextField
										{...register("rate")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>
								</td>
								<td className={styles.cell}>
									<TextField
										{...register("amount")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>
								</td>
							</tr>
							<tr>
								<td colSpan={4}>
									{" "}
									<b>Total</b>{" "}
								</td>
								<td className={styles.header}>
									<TextField
										{...register("total_amount")}
										id="small-input"
										variant="outlined"
										size="small"
										className={styles.customInput}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className={styles.othersArea}>
					<div className={styles.descriptionArea}>
						<p>RECEIVED, </p>
						<StyledTextarea
							{...register("description")}
							minRows={4}
							aria-label="empty textarea"
							placeholder="Description"
						/>
					</div>
					<div className={styles.toShipper}>
						<StyledTextarea
							{...register("to_shipper")}
							minRows={1}
							aria-label="empty textarea"
							placeholder="To Shipper "
						/>
					</div>
					<div className={styles.descriptionArea}>
						<StyledTextarea
							{...register("to_carrier")}
							minRows={2}
							aria-label="empty textarea"
							placeholder="To Carrier "
						/>
					</div>
					<div className={styles.descriptionArea}>
						<StyledTextarea
							{...register("notice")}
							minRows={1}
							aria-label="empty textarea"
							placeholder="Notice"
						/>
					</div>
					<div className={styles.descriptionArea}>
						<StyledTextarea
							{...register("ratecon_notes_1")}
							minRows={1}
							aria-label="empty textarea"
							placeholder="Notes"
						/>
					</div>
					<div className={styles.descriptionArea}>
						<StyledTextarea
							{...register("ratecon_notes_2")}
							minRows={1}
							aria-label="empty textarea"
							placeholder="Notes"
						/>
					</div>
					<div className={styles.descriptionArea}>
						<StyledTextarea
							{...register("ratecon_notes_3")}
							minRows={1}
							aria-label="empty textarea"
							placeholder="Notes"
						/>
					</div>
					<br />
					<div className={styles.acknowladgementArea}>
						<div className={styles.ackMain}>
							<div className={styles.singleAck}>
								<DriverName />
								<DriverCellPhone />
							</div>
							<div className={styles.singleAck}>
								<PrintName />
								<Signature />
								<Date />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Ratecon;
