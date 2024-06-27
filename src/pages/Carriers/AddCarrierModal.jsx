import React, { useState } from "react";
import styles from "./Carriers.module.scss";
import DynamicRepresentativeForm from "./DynamicRepresentativeForm";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import EquipmentForm from "./EquipmentForm";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { CarrierTypes } from "../../shared/constants";

dayjs.extend(advancedFormat);

const AddCarrierModal = ({ register, errors, currentData = null, setValue, watch }) => {
	const [totalUnits, setTotalUnits] = useState(0);

	const updateTotalUnits = (units) => {
		setTotalUnits(units);
		setValue("nOfUnits", units);
	};

	const updateInsDate = (value) => {
		setValue("insExpDate", value.format("YYYY-MM-DD"));
	};

	const handleCarrierTypeChange = (e) => {
		const seletedType = e.target.value;
		setValue("type", seletedType, { shouldValidate: true });
	};

	return (
		<div className={styles.addOrder}>
			<FormControl style={{ width: "100%" }}>
				<TextField
					required
					label="Carrier Name"
					{...register("name", { required: true })}
					name="name"
					size="small"
					type="text"
					defaultValue={currentData ? currentData.name : ""}
					error={!!errors.name}
				/>
			</FormControl>
			<div className={styles.twoColumnTwoRow}>
				<FormControl style={{ gridRow: "span 2" }}>
					<TextField
						id="outlined-multiline-static"
						label="Carrier Address"
						{...register("address")}
						multiline
						rows={4}
						name="address"
						size="small"
						defaultValue={currentData ? currentData.address : ""}
						error={!!errors.address}
					/>
				</FormControl>
				<FormControl>
					<TextField
						required
						label="Carrier Insurance"
						{...register("insurance", { required: true })}
						name="insurance"
						size="small"
						type="text"
						defaultValue={currentData ? currentData.insurance : ""}
						error={!!errors.insurance}
					/>
				</FormControl>
				<FormControl>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							{...register("insExpDate")}
							name="insExpDate"
							label="Insurance Expiration Date"
							onChange={(value) => updateInsDate(value)}
							value={currentData && currentData?.insExpDate ? dayjs(currentData.insExpDate) : null}
							isInvalid={errors.insExpDate ? true : false}
							slotProps={{ textField: { size: "small" } }}
						/>
					</LocalizationProvider>
				</FormControl>
			</div>
			<div className={styles.addOrderColumn}>
				<FormControl>
					<TextField
						required
						label="Carrier Phone Number"
						{...register("phone", { required: true })}
						name="phone"
						size="small"
						type="text"
						defaultValue={currentData ? currentData.phone : ""}
						error={!!errors.phone}
					/>
				</FormControl>
				<FormControl>
					<TextField
						required
						label="Checks Payable To"
						{...register("checksPayable", { required: true })}
						name="checksPayable"
						size="small"
						type="text"
						defaultValue={currentData ? currentData.checksPayable : ""}
						error={!!errors.checksPayable}
					/>
				</FormControl>

				<div className={styles.twoColumn}>
					<FormControl>
						<TextField
							required
							label="MC Number"
							{...register("mcNumber", { required: true })}
							name="mcNumber"
							size="small"
							type="text"
							defaultValue={currentData ? currentData.mcNumber : ""}
							error={!!errors.mcNumber}
						/>
					</FormControl>

					<FormControl>
						<TextField
							required
							label="Dot"
							{...register("dot", { required: true })}
							name="dot"
							size="small"
							type="text"
							defaultValue={currentData ? currentData.dot : ""}
							error={!!errors.dot}
						/>
					</FormControl>
				</div>

				<FormControl size="small" error={!!errors.type} required>
					<InputLabel>Carrier Type</InputLabel>
					<Select
						label="Carrier Type"
						{...register("type", { required: true })}
						name="type"
						onChange={handleCarrierTypeChange}
						defaultValue={currentData ? currentData.type : ""}
						error={!!errors.type}
					>
						{Object.values(CarrierTypes).map((type) => (
							<MenuItem key={type} value={type} selected={currentData && currentData.type === type}>
								{type}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<TextField
						required
						label="Number of Units"
						{...register("nOfUnits", { required: true })}
						name="nOfUnits"
						size="small"
						type="text"
						disabled
						value={totalUnits}
					/>
				</FormControl>

				<FormControl>
					<TextField
						required
						label="RMIS Info."
						{...register("rims", { required: true })}
						name="rims"
						size="small"
						type="text"
						defaultValue={currentData ? currentData.rims : ""}
						error={!!errors.rims}
					/>
				</FormControl>
			</div>
			{/* EQUIPMENT */}
			<div style={{ marginTop: 32 }}>
				<Typography variant="button">Equipments</Typography>
			</div>
			<Divider style={{ margin: "4px 0 16px 0" }} />
			<FormControl style={{ gridColumn: "1/-1", width: "100%" }}>
				<EquipmentForm
					{...register("equipments")}
					setValue={setValue}
					data={currentData && currentData?.equipments ? currentData.equipments : []}
					updateTotalUnits={updateTotalUnits}
				/>
			</FormControl>
			{/* Representatives */}
			<div style={{ marginTop: 32 }}>
				<Typography variant="button">Representatives</Typography>
			</div>
			<Divider style={{ margin: "4px 0 16px 0" }} />
			<FormControl style={{ gridColumn: "1/-1", width: "100%" }}>
				<DynamicRepresentativeForm
					{...register("representatives")}
					setValue={setValue}
					data={currentData && currentData.representatives ? currentData.representatives : []}
				/>
			</FormControl>
		</div>
	);
};

export default AddCarrierModal;
