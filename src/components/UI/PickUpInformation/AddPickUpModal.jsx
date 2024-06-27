import React from "react";
import styles from "./PickUpInformation.module.scss";
import {
	FormControl,
	FormHelperText,
	Grid,
	Input,
	InputLabel,
	TextField,
	Typography,
} from "@mui/material";
import PlacesAutocomplete from "../../PlacesAutocomplete";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";

const AddPickUpModal = ({
	register,
	errors,
	watch,
	control,
	handleAutocompleteChange,
	handlePickUpDateChangeOpen,
	pickDateOpen,
	// validatePickUpDate,
}) => {
	const updatingLocation = useSelector((state) => state.global.updatingLocation);
	return (
		<div className={styles.pickUpContainer}>
			<div style={{ marginBottom: "1rem" }} className={`${styles.customTextArea}`}>
				<FormControl fullWidth variant="outlined">
					<InputLabel htmlFor="bussiness-address">Bussiness Address</InputLabel>
					<Controller
						name="pBussinessAddress"
						control={control}
						defaultValue=""
						rules={{
							required: "Please select an option Bussiness Address",
						}}
						render={({ field }) => (
							<Input
								{...field}
								{...register("pBussinessAddress", {
									required: {
										value: true,
										message: "Please select an option Bussiness Address",
									},
								})}
								id="bussiness-address"
								type="textarea"
								disabled={updatingLocation}
								rows={3}
								multiline
								placeholder="Enter business address"
							/>
						)}
					/>
					{errors.pBussinessAddress && (
						<FormHelperText error>{errors.pBussinessAddress.message}</FormHelperText>
					)}
				</FormControl>
			</div>

			<Grid style={{ marginBottom: "1rem" }} container spacing={1}>
				<Grid item xs={12}>
					<PlacesAutocomplete
						handleAutocompleteChange={handleAutocompleteChange}
						register={register}
						autocompleteName="pickUpLocation"
						locationVal={watch("pickUpLocation")}
						placeholder="Pick Up Location"
					/>

					{errors.pickUpLocation && (
						<FormHelperText sx={{ color: "#D32F2F" }}>
							Please select pick up location
						</FormHelperText>
					)}
				</Grid>
			</Grid>

			<Grid style={{ marginBottom: "1rem" }} container spacing={1}>
				<Grid item xs={6} className={`${styles.timePicker}`}>
					<FormControl fullWidth size="small">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								{...register("pickUpOpeningDateTime", {
									required: {
										value: true,
										message: "please provide a valid pick up date and time.",
									},
								})}
								name="pickUpOpeningDateTime"
								timeFormat={false}
								format="MM/DD/YYYY, hh:mm A"
								closeOnSelect={false}
								onChange={handlePickUpDateChangeOpen}
								value={pickDateOpen}
								label="Pick Up Date/Time"
								slotProps={{ popper: { placement: "right" } }}
							/>
						</LocalizationProvider>
						{errors.pickUpOpeningDateTime && (
							<Typography variant="caption" color="error">
								{errors.pickUpOpeningDateTime.message}
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
							{...register("pComodity")}
							size="small"
							name="pComodity"
							isInvalid={errors.pComodity ? true : false}
							error={!!errors.pComodity}
							helperText={errors.pComodity?.message}
						/>
					</FormControl>
				</Grid>
			</Grid>

			<Grid container spacing={1}>
				<Grid item xs={6}>
					<FormControl fullWidth>
						<TextField
							size="small"
							type="number"
							placeholder=""
							label="Pallets"
							min={0}
							{...register("pPallets")}
							name="pPallets"
							error={!!errors.pPallets}
							helperText={errors.pPallets?.message}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl fullWidth>
						<TextField
							size="small"
							type="number"
							min={0}
							placeholder=""
							label="Weight"
							{...register("pWeight")}
							name="pWeight"
							error={!!errors.pWeight}
							helperText={errors.pWeight?.message}
						/>
					</FormControl>
				</Grid>
			</Grid>
		</div>
	);
};

export default AddPickUpModal;
