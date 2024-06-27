import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
	useGetLoadCountsAccQuery,
	useLazyGetDispatchedLoadsQuery,
	useUpdateOrderMutation,
} from "../../services/load";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { config } from "../../config";

const LoadPaid = ({ currentData, setShowModalPaid }) => {
	const { control, handleSubmit } = useForm();
	const [updateLoad] = useUpdateOrderMutation();
	const { refetch: refetchLoadCounts } = useGetLoadCountsAccQuery();
	const [refetchLoads] = useLazyGetDispatchedLoadsQuery();
	const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQueryBroker);

	const onSubmit = (data) => {
		const date = data.datePaid;
		data.datePaid = date.format("MM/DD/YYYY, hh:mm A");

		const payload = {
			paymentStatus: "Paid",
			lastBrokerPaymentStatus: "Paid",
			brokerPaidInfo: {
				datePaid: data.datePaid,
			},
		};

		if (data.brokerPaidProof) {
			const formData = new FormData();
			formData.append("paymentStatus", payload.paymentStatus);
			formData.append("lastBrokerPaymentStatus", payload.lastBrokerPaymentStatus);
			formData.append("brokerPaidInfo", JSON.stringify(payload.brokerPaidInfo));
			formData.append("file", data.brokerPaidProof);
			const accessToken = localStorage.getItem(config.accessTokenName);

			axios({
				method: "put",
				url: `${config.apiBaseUrl}/load/${currentData._id}/update-load-file`,
				data: formData,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
				.then(() => {
					refetchLoads(lastLoadsQuery, false);
					refetchLoadCounts();
					setShowModalPaid(false);
					toast("Load payment status updated successfully with file!");
				})
				.catch((error) => {
					console.error("Failed to update load with file:", error);
					toast("Error updating load payment status with file.");
				});
		} else {
			updateLoad({
				id: currentData._id,
				payload: payload,
			})
				.unwrap()
				.then(() => {
					refetchLoads(lastLoadsQuery, false);
					setShowModalPaid(false);
					toast("Load payment status updated successfully!");
				})
				.catch((error) => {
					console.error("Failed to update load:", error);
					toast("Error updating load payment status.");
				});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box display="flex" alignItems="center" gap={1}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Controller
						name="datePaid"
						control={control}
						defaultValue={null}
						render={({ field }) => (
							<DateTimePicker
								{...field}
								label="Date Paid"
								slotProps={{ textField: { size: "small" } }}
								inputFormat="MM/dd/yyyy"
								renderInput={(params) => <TextField size="small" {...params} />}
							/>
						)}
					/>
				</LocalizationProvider>
				<Controller
					name="brokerPaidProof"
					control={control}
					defaultValue={null}
					render={({ field: { onChange, onBlur, name, ref } }) => (
						<TextField
							type="file"
							onChange={(e) => {
								const file = e.target.files[0];
								onChange(file);
								console.log(file);
							}}
							onBlur={onBlur}
							name={name}
							inputRef={ref}
							InputLabelProps={{ shrink: true }}
							size="small"
							label="Upload Proof of Payment"
							variant="outlined"
						/>
					)}
				/>
				<Button type="submit" variant="contained" color="primary">
					Mark As Paid
				</Button>
			</Box>
		</form>
	);
};

export default LoadPaid;
