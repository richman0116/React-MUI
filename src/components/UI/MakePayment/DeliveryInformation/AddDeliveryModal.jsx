import React from "react";
import {
	CircularProgress,
	FormControl,
	FormHelperText,
	Grid,
	Input,
	InputLabel,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import PlacesAutocomplete from "../../../PlacesAutocomplete";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styles from "./DeliveryInformation.module.scss";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
const AddDeliveryModal = ({
	register,
	errors,
	watch,
	handleAutocompleteChangeDes,
	dropDateOpen,
	handleDropDateChangeOpen,
	dropDateClose,
	handleDropDateChangeClose,
	control,
}) => {
	const updatingLocation = useSelector((state) => state.global.updatingLocation);
	return (
		<div className={styles.pickUpContainer}>
			<div style={{ marginBottom: "1rem" }} className={`${styles.customTextArea}`}>
				{/* Business Address Field */}
				<FormControl fullWidth variant="outlined">
					<InputLabel htmlFor="bussiness-address">Bussiness Address</InputLabel>
					<Controller
						name="dBussinessAddress"
						control={control}
						defaultValue=""
						rules={{
							required: "Please select an option Bussiness Address",
						}}
						render={({ field }) => (
							<Input
								{...field}
								{...register("dBussinessAddress", {
									required: {
										value: true,
										message: "Please select an option Bussiness Address",
									},
								})}
								id="bussiness-address"
								type="textarea"
								rows={3}
								multiline
								placeholder="Enter business address"
							/>
						)}
					/>
					{errors.dBussinessAddress && (
						<FormHelperText error>{errors.dBussinessAddress.message}</FormHelperText>
					)}
					{/* {updatingLocation && (
						<CircularProgress
							size={24}
							sx={{
								position: "absolute",
								top: "10px",
								right: "10px",
							}}
						/>
					)} */}
				</FormControl>
			</div>

			<Grid style={{ marginBottom: "1rem" }} container spacing={1}>
				<Grid item xs={12}>
					{/* Destination Field */}
					<PlacesAutocomplete
						handleAutocompleteChange={handleAutocompleteChangeDes}
						register={register}
						autocompleteName="destination"
						locationVal={watch("destination")}
						placeholder="Destination"
					/>
					{errors.destination && (
						<FormHelperText style={{ color: "#D32F2F" }}>Please select destination</FormHelperText>
					)}
				</Grid>
			</Grid>

			{/* Time and Commodity Field */}
			<Grid style={{ marginBottom: "1rem" }} container spacing={1}>
				<Grid item xs={6} className={`${styles.timePicker}`}>
					{/* Drop-off Date/Time Field */}
					<FormControl fullWidth={true}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								{...register("dropOpeningDateTime", {
									required: {
										value: true,
										message: "please provide a valid drop of date and time.",
									},
								})}
								name="dropOpeningDateTime"
								value={dropDateOpen}
								timeFormat={false}
								format="MM/DD/YYYY, hh:mm A"
								closeOnSelect={false}
								onChange={handleDropDateChangeOpen}
								label="Drop of Date/Time"
								slotProps={{ popper: { placement: "right" } }}
							/>
						</LocalizationProvider>
						{errors.dropOpeningDateTime && (
							<Typography variant="caption" color="error">
								{errors.dropOpeningDateTime.message}
							</Typography>
						)}
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl fullWidth>
						<TextField
							type="text"
							label="Commodity"
							placeholder="please enter commodity"
							{...register("dComodity")}
							size="small"
							name="dComodity"
							error={!!errors.dComodity}
							helperText={errors.dComodity?.message}
						/>
					</FormControl>
				</Grid>
			</Grid>

			<Grid style={{ marginBottom: "1rem" }} container spacing={1}>
				<Grid item xs={6}>
					{/* Pallets Field */}
					<FormControl fullWidth>
						<TextField
							type="number"
							label="Pallets"
							size="small"
							min={0}
							{...register("dPallets")}
							name="dPallets"
							error={!!errors.dPallets}
							helperText={errors.dPallets?.message}
						/>
					</FormControl>
				</Grid>

				{/* Weight Field */}
				<Grid item xs={6}>
					<FormControl fullWidth>
						<TextField
							type="number"
							min={0}
							size="small"
							label="Weight"
							{...register("dWeight")}
							name="dWeight"
							error={!!errors.dWeight}
							helperText={errors.dWeight?.message}
						/>
					</FormControl>
				</Grid>
			</Grid>
		</div>
	);
};

export default AddDeliveryModal;
