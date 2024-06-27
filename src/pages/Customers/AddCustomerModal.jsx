import React, { useEffect, useState } from "react";
import styles from "../Assets/Assets.module.scss";
import DynamicRepresentativeForm from "./DynamicRepresentativeForm";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {
	Button,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { CustomerTypes } from "../../shared/constants";
import globalUtils from "../../utils/globalUtils";
import { Controller } from "react-hook-form";

dayjs.extend(advancedFormat);

const AddCustomerModal = ({
	register,
	errors,
	currentData = null,
	setValue,
	watch,
	control,
	setDisableSubmit,
	disable = false,
}) => {
	const handleCustomerTypeChange = (e) => {
		const seletedType = e.target.value;
		setValue("customerType", seletedType, { shouldValidate: true });
	};

	const [isApprove, setIsApprove] = useState(
		currentData?.isApproved && currentData.isApproved === true ? "true" : "false"
	);

	useEffect(() => {
		setValue("isApproved", isApprove);
	}, []);

	const handleApprovalChange = (event, newApproval) => {
		setIsApprove(newApproval);
		newApproval === "true" ? setValue("isApproved", true) : setValue("isApproved", false);
	};

	return (
		<div className={styles.addAssetArea}>
			<div className={styles.twoColumnGrid}>
				<FormControl>
					<Controller
						name="customerName"
						control={control}
						defaultValue={currentData ? currentData.customerName : ""}
						rules={{ required: true }}
						render={({ field }) => (
							<TextField
								{...field}
								required
								label="Customer Name"
								size="small"
								type="text"
								error={!!errors.customerName}
								disabled={disable}
							/>
						)}
					/>
				</FormControl>

				<FormControl
					style={{ marginBottom: "16px" }}
					size="small"
					error={!!errors.customerType}
					disabled={disable}
					required
				>
					<InputLabel>Customer Type</InputLabel>
					<Controller
						name="customerType"
						control={control}
						defaultValue={currentData ? currentData.customerType : ""}
						rules={{ required: true }}
						render={({ field }) => (
							<Select {...field} label="Customer Type" onChange={handleCustomerTypeChange}>
								{Object.values(CustomerTypes).map((CustomerType) => (
									<MenuItem key={CustomerType} value={CustomerType}>
										{globalUtils.snakeCaseToCapitalize(CustomerType)}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</FormControl>

				{watch && watch("customerType") === CustomerTypes.BROKER && (
					<>
						<FormControl style={{ marginBottom: "16px" }}>
							<TextField
								label="MC Number"
								{...register("mcNumber")}
								name="mcNumber"
								disabled={disable}
								size="small"
								type="text"
								defaultValue={currentData ? currentData.mcNumber : ""}
							/>
						</FormControl>
						<FormControl style={{ marginBottom: "16px" }}>
							<ToggleButtonGroup
								value={isApprove}
								disabled={disable}
								exclusive
								onChange={handleApprovalChange}
								size="small"
								aria-label="isApprove"
							>
								<ToggleButton
									value={"false"}
									aria-label="not approved"
									style={{ backgroundColor: isApprove === "false" ? "lightcoral" : "inherit" }}
								>
									Not Approved
								</ToggleButton>
								<ToggleButton
									value={"true"}
									aria-label="approved"
									style={{ backgroundColor: isApprove === "true" ? "lightgreen" : "inherit" }}
								>
									Approved
								</ToggleButton>
							</ToggleButtonGroup>
						</FormControl>
					</>
				)}

				<FormControl
					style={{ marginBottom: "16px" }}
					size="small"
					error={!!errors.customerNumber}
					required
				>
					<Controller
						name="customerNumber"
						control={control}
						defaultValue={currentData ? currentData.customerNumber : ""}
						rules={{ required: true }}
						render={({ field }) => (
							<TextField
								{...field}
								disabled={disable}
								label="Customer Number"
								type="text"
								size="small"
							/>
						)}
					/>
				</FormControl>
				<FormControl style={{ marginBottom: "16px" }}>
					<TextField
						label="Customer Email"
						{...register("customerEmail")}
						name="customerEmail"
						size="small"
						disabled={disable}
						type="text"
						defaultValue={currentData ? currentData.customerEmail : ""}
					/>
				</FormControl>
				<FormControl style={{ marginBottom: "16px" }}>
					<TextField
						label="Customer Address"
						{...register("customerAddress")}
						name="customerAddress"
						size="small"
						disabled={disable}
						type="text"
						defaultValue={currentData ? currentData.customerAddress : ""}
					/>
				</FormControl>
			</div>
			<div style={{ marginTop: 16 }}>
				<Typography variant="button">Representatives</Typography>
			</div>
			<Divider style={{ margin: "4px 0 16px 0" }} />
			<div>
				<FormControl style={{ gridColumn: "1/-1", width: "100%" }}>
					<DynamicRepresentativeForm
						{...register("representatives")}
						setValue={setValue}
						setDisableSubmit={setDisableSubmit}
						data={currentData && currentData.representatives ? currentData.representatives : []}
					/>
				</FormControl>
			</div>
		</div>
	);
};

export default AddCustomerModal;
