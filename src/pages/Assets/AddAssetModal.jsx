import React from "react";
import styles from "./Assets.module.scss";
import {
	FormControl,
	InputLabel,
	TextField,
	Typography,
	MenuItem,
	Select,
	Divider,
	Box,
	Autocomplete,
	Chip,
} from "@mui/material";
import globalUtils from "../../utils/globalUtils";
import { AssetStatus, DriversCetifications, TruckTypes } from "../../shared/constants";
import PlacesAutocomplete from "../../components/PlacesAutocomplete";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useAddAssestModal from "./hooks";
import { Controller } from "react-hook-form";
import MultiFileUploader from "../../components/MultFileUploader/MultiFileUploader";

const AddAssetModal = ({
	register,
	errors,
	currentData = null,
	setValue,
	control,
	dynamicAssetId,
	handleFileSelected,
	deleteFileHandler,
	watch,
}) => {
	const {
		handleAutocompleteChange,
		availableDate,
		handleAvailableDateChange,
		isAavailableDate,
		handleStatusChange,
		handleDriverCertificationsChange,
		handleTypeChange,
		insuranceStartDate,
		insuranceEndDate,
		handleIssueStartDateChange,
		handleIssueEndDateChange,
		deliveryDate,
		handleDeliveryDateChange,
		isDeliveryDate,
		licenceExpDate,
		vehicleRegExpDate,
		handleLicenceExpDateChange,
		handleVehicleRegExpDate,
	} = useAddAssestModal({ setValue, currentData });

	return (
		<div className={styles.addAssetArea}>
			<div>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<Typography variant="button" style={{ fontWeight: 600 }}>
						Driver Information
					</Typography>
					<div>
						<FormControl style={{ width: "400px" }}>
							<Controller
								name="assetId"
								control={control}
								defaultValue={currentData ? currentData.assetId : dynamicAssetId}
								render={({ field }) => (
									<>
										<TextField
											{...field}
											label="Asset Id"
											size="small"
											type="number"
											inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
											style={{ borderBottom: "none" }}
											onBlur={(e) => {
												const numericValue = e.target.value.replace(/[^0-9]/g, "");
												setValue("assetId", numericValue);
											}}
										/>
									</>
								)}
							/>
						</FormControl>
					</div>
				</Box>
				<Divider style={{ margin: "4px 0 16px 0" }} />

				<div className={styles.twoColumnGrid}>
					<FormControl style={{ marginBottom: "16px" }}>
						<TextField
							required
							label="Name"
							{...register("assignedDrivers", { required: true })}
							name="assignedDrivers"
							size="small"
							type="text"
							defaultValue={currentData ? currentData.assignedDrivers : ""}
							error={!!errors.assignedDrivers}
						/>
					</FormControl>

					<FormControl style={{ marginBottom: "16px" }}>
						<TextField
							required
							label="Phone Number"
							{...register("contactNumber", { required: true })}
							name="contactNumber"
							size="small"
							type="text"
							defaultValue={currentData ? currentData.contactNumber : ""}
							error={!!errors.contactNumber}
						/>
					</FormControl>
					<FormControl style={{ marginBottom: "16px" }}>
						<TextField
							required
							label="Email"
							{...register("email", { required: true })}
							name="email"
							size="small"
							type="text"
							defaultValue={currentData ? currentData.email : ""}
							error={!!errors.email}
						/>
					</FormControl>

					<FormControl style={{ marginBottom: "16px" }}>
						<TextField
							required
							label="Home State"
							{...register("driverHomeState", { required: true })}
							name="driverHomeState"
							size="small"
							type="text"
							defaultValue={currentData ? currentData.driverHomeState : ""}
							error={!!errors.driverHomeState}
						/>
					</FormControl>
					<FormControl>
						<TextField
							label="Company Name"
							{...register("companyName")}
							name="companyName"
							size="small"
							type="text"
							defaultValue={currentData ? currentData.companyName : ""}
							error={!!errors.companyName}
						/>
					</FormControl>
				</div>
			</div>
			<div style={{ marginTop: 32 }}>
				<Typography variant="button" style={{ fontWeight: 600 }}>
					Equipment Information
				</Typography>
				<Divider style={{ margin: "4px 0 16px 0" }} />

				<div className={styles.twoColumnGrid}>
					<FormControl style={{ marginBottom: "16px" }} size="small" error={!!errors.type} required>
						<InputLabel>Type</InputLabel>
						<Select
							label="Type"
							{...register("type", { required: true })}
							name="type"
							onChange={handleTypeChange}
							defaultValue={currentData ? currentData.type : ""}
							error={!!errors.type}
						>
							{TruckTypes.map((type) => (
								<MenuItem
									key={type}
									value={type}
									selected={currentData && currentData.type === type}
								>
									{type}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl style={{ marginBottom: "16px" }}>
						<TextField
							required
							label="Make"
							{...register("make", { required: true })}
							name="make"
							type="text"
							size="small"
							defaultValue={currentData ? currentData.make : ""}
							error={!!errors.make}
						/>
					</FormControl>

					<FormControl style={{ marginBottom: "16px" }}>
						<TextField
							required
							label="Model"
							{...register("model", { required: true })}
							name="model"
							type="text"
							size="small"
							defaultValue={currentData ? currentData.model : ""}
							error={!!errors.model}
						/>
					</FormControl>

					<FormControl style={{ marginBottom: "16px" }}>
						<TextField
							required
							label="Year"
							{...register("year", { required: true })}
							name="year"
							type="text"
							size="small"
							defaultValue={currentData ? currentData.year : ""}
							error={!!errors.year}
						/>
					</FormControl>
					<FormControl>
						<TextField
							required
							label="Dimension"
							{...register("dimension", { required: true })}
							name="dimension"
							type="text"
							size="small"
							defaultValue={currentData ? currentData.dimension : ""}
							error={!!errors.dimension}
						/>
					</FormControl>
					<FormControl>
						<TextField
							required
							label="Weight"
							{...register("weight", { required: true })}
							name="weight"
							type="text"
							size="small"
							defaultValue={currentData ? currentData.weight : ""}
							error={!!errors.weight}
						/>
					</FormControl>
				</div>
			</div>
			<div style={{ marginTop: 32 }}>
				<Typography variant="button" style={{ fontWeight: 600 }}>
					Emergency Contact Information
				</Typography>
				<Divider style={{ margin: "4px 0 16px 0" }} />
				<div className={styles.twoColumnGrid}>
					<FormControl>
						<TextField
							label="Emergency Contact"
							{...register("driverEmerContact")}
							name="driverEmerContact"
							defaultValue={currentData ? currentData.driverEmerContact : ""}
							type="text"
							size="small"
						/>
					</FormControl>
					<FormControl>
						<TextField
							label="Emergency Phone Number"
							{...register("driverEmerPhone")}
							name="driverEmerPhone"
							defaultValue={currentData ? currentData.driverEmerPhone : ""}
							type="text"
							size="small"
						/>
					</FormControl>
				</div>
			</div>
			<div style={{ marginTop: 32 }}>
				<Typography variant="button" style={{ fontWeight: 600 }}>
					Certifications & Others Information
				</Typography>
				<Divider style={{ margin: "4px 0 8px 0" }} />

				<div className={styles.twoColumnGrid} style={{ marginTop: "10px" }}>
					{/* <MultipleSelect
						size="small"
						placeholder="Driver's Cerifications"
						options={DriversCetifications}
						value={
							currentData && currentData.driverCirtifications
								? currentData.driverCirtifications?.split(",")
								: []
						}
						onChange={handleDriverCertificationsChange}
					/> */}
					<FormControl>
						<Autocomplete
							multiple
							id="tags-filled"
							options={DriversCetifications}
							defaultValue={
								currentData && currentData.driverCirtifications
									? currentData.driverCirtifications?.split(",")
									: []
							}
							size="small"
							freeSolo
							renderTags={(value, getTagProps) =>
								value.map((option, index) => (
									<Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
								))
							}
							disableCloseOnSelect={true}
							onChange={handleDriverCertificationsChange}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="outlined"
									label="Driver's Cerifications"
									placeholder="Driver's Cerifications"
								/>
							)}
						/>
					</FormControl>
					<FormControl>
						<TextField
							label="Insurance Issuer"
							{...register("insuranceIssuer")}
							name="insuranceIssuer"
							defaultValue={currentData ? currentData.insuranceIssuer : ""}
							type="text"
							size="small"
						/>
					</FormControl>
				</div>
				<div className={styles.twoColumnGrid} style={{ marginTop: "10px" }}>
					<FormControl>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								{...register("insuranceStartDate")}
								name="insuranceStartDate"
								label="Insurance Start Date"
								onChange={handleIssueStartDateChange}
								value={insuranceStartDate}
								slotProps={{ textField: { size: "small" } }}
							/>
						</LocalizationProvider>
					</FormControl>
					<FormControl>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								{...register("insuranceEndDate")}
								name="insuranceEndDate"
								label="Insurance End Date"
								onChange={handleIssueEndDateChange}
								value={insuranceEndDate}
								slotProps={{ textField: { size: "small" } }}
							/>
						</LocalizationProvider>
					</FormControl>
				</div>

				<div className={styles.twoColumnGrid} style={{ marginTop: "10px" }}>
					<FormControl>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								{...register("licenceExpDate")}
								name="licenceExpDate"
								label="Licence Expiration Date"
								onChange={handleLicenceExpDateChange}
								value={licenceExpDate}
								slotProps={{ textField: { size: "small" } }}
							/>
						</LocalizationProvider>
					</FormControl>
					<FormControl>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								{...register("vehicleRegExpDate")}
								name="vehicleRegExpDate"
								label="Vehicle Registration Expirate"
								onChange={handleVehicleRegExpDate}
								value={vehicleRegExpDate}
								slotProps={{ textField: { size: "small" } }}
							/>
						</LocalizationProvider>
					</FormControl>
				</div>

				<div className={styles.twoColumnGrid} style={{ marginTop: "10px" }}>
					<MultiFileUploader
						label="Identity Doc"
						height="120px"
						img={{ width: "50px", height: "54px" }}
						onFilesSelected={handleFileSelected}
						deleteFileHandler={deleteFileHandler}
						fileKey={currentData && currentData.identityDoc ? currentData.identityDoc : false}
						initialFiles={
							currentData && currentData.identityDoc
								? Array.isArray(currentData.identityDoc)
									? currentData.identityDoc
									: [currentData.identityDoc]
								: []
						}
						name="identityDoc"
					/>
					<MultiFileUploader
						label="Insurance Docs"
						height="120px"
						img={{ width: "50px", height: "54px" }}
						onFilesSelected={handleFileSelected}
						deleteFileHandler={deleteFileHandler}
						fileKey={currentData && currentData.insuranceDoc ? currentData.insuranceDoc : false}
						initialFiles={
							currentData && currentData.insuranceDoc
								? Array.isArray(currentData.insuranceDoc)
									? currentData.insuranceDoc
									: [currentData.insuranceDoc]
								: []
						}
						name="insuranceDoc"
					/>
				</div>
				<div className={styles.twoColumnGrid} style={{ marginTop: "10px" }}>
					<MultiFileUploader
						label="Driving License"
						height="120px"
						img={{ width: "50px", height: "54px" }}
						onFilesSelected={handleFileSelected}
						deleteFileHandler={deleteFileHandler}
						fileKey={currentData && currentData.drivingLicense ? currentData.drivingLicense : false}
						initialFiles={
							currentData && currentData.drivingLicense
								? Array.isArray(currentData.drivingLicense)
									? currentData.drivingLicense
									: [currentData.drivingLicense]
								: []
						}
						name="drivingLicense"
					/>
					<MultiFileUploader
						label="Van Pictures"
						height="120px"
						img={{ width: "50px", height: "54px" }}
						onFilesSelected={handleFileSelected}
						deleteFileHandler={deleteFileHandler}
						fileKey={currentData && currentData.vanPictures ? currentData.vanPictures : false}
						initialFiles={currentData && currentData.vanPictures ? currentData.vanPictures : ""}
						name="vanPictures"
					/>
				</div>
			</div>
			<div style={{ marginTop: 32 }}>
				<Typography variant="button" style={{ fontWeight: 600 }}>
					Location and Status
				</Typography>
				<Divider style={{ margin: "4px 0 8px 0" }} />

				<div className={styles.twoColumnGrid}>
					<div>
						<FormControl
							style={{ marginBottom: "16px", marginTop: -1 }}
							size="small"
							fullWidth
							error={!!errors.status}
							required
						>
							<PlacesAutocomplete
								placeholder="Current Location"
								handleAutocompleteChange={handleAutocompleteChange}
								register={register}
								autocompleteName="location"
								locationVal={currentData ? currentData.location : ""}
							/>
						</FormControl>

						<FormControl
							style={{ marginBottom: "16px" }}
							fullWidth
							size="small"
							error={!!errors.status}
							required
						>
							<InputLabel>Status</InputLabel>
							<Select
								label="Status"
								{...register("status", { required: true })}
								name="status"
								onChange={handleStatusChange}
								defaultValue={currentData ? currentData.status : ""}
								error={!!errors.status}
							>
								{Object.values(AssetStatus).map(
									(status) =>
										status !== AssetStatus.ON_HOLD && (
											<MenuItem
												key={status}
												value={status}
												selected={currentData && currentData.status === status}
											>
												{globalUtils.snakeCaseToCapitalize(status)}
											</MenuItem>
										)
								)}
							</Select>
						</FormControl>

						{isAavailableDate && watch("status") === "available_on" && (
							<FormControl fullWidth error={!!errors.availableDate} required>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DateTimePicker
										{...register("availableDate", { required: true })}
										name="availableDate"
										label="Available Date & Time"
										timeFormat={false}
										closeOnSelect={false}
										onChange={handleAvailableDateChange}
										value={availableDate}
										error={!!errors.availableDate}
										slotProps={{ textField: { size: "small" } }}
									/>
								</LocalizationProvider>
							</FormControl>
						)}

						{isDeliveryDate && watch("status") === "on_our_load" && (
							<FormControl fullWidth error={!!errors.deliveryDate} required>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DateTimePicker
										{...register("deliveryDate", { required: true })}
										name="deliveryDate"
										label="Delivery Date & Time"
										timeFormat={false}
										closeOnSelect={false}
										onChange={handleDeliveryDateChange}
										value={deliveryDate}
										error={!!errors.deliveryDate}
										slotProps={{ textField: { size: "small" } }}
									/>
								</LocalizationProvider>
							</FormControl>
						)}
					</div>

					<FormControl fullWidth>
						<TextField
							type="textarea"
							label="Notes"
							{...register("notes")}
							rows={5}
							multiline
							defaultValue={currentData ? currentData.notes : ""}
							placeholder="Enter your public notes here..."
						/>
					</FormControl>
				</div>
			</div>
		</div>
	);
};

export default AddAssetModal;
