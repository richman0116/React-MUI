import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLazyGetDispatchedLoadsQuery, useUpdateOrderMutation } from "../../services/load";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const LoadPaid = ({ currentData, setShowModalPaid }) => {
	const { control, handleSubmit } = useForm();
	const [updateLoad] = useUpdateOrderMutation();
	const [refetchLoads] = useLazyGetDispatchedLoadsQuery();
	const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQueryBroker);

	const onSubmit = (data) => {
		const formData = {
			paymentStatus: "DriverPaid",
			lastDriverPaymentStatus: "DriverPaid",
			driverPaidInfo: data,
		};
		updateLoad({ id: currentData._id, payload: formData })
			.unwrap()
			.then(() => {
				refetchLoads(lastLoadsQuery, false);
				setShowModalPaid(false);
				toast("Load payment status updated successfully!");
			});
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
				<Button type="submit" variant="contained" color="primary">
					Mark As Paid
				</Button>
			</Box>
		</form>
	);
};

export default LoadPaid;
