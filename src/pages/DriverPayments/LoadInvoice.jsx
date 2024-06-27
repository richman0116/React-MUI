import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useGetDispatchedLoadsQuery, useUpdateOrderMutation } from "../../services/load";
import { toast } from "react-toastify";

const LoadInvoice = ({ currentData, setShowModalPaid }) => {
	const { control, handleSubmit } = useForm();
	const [updateLoad] = useUpdateOrderMutation();
	const { refetch: refetchLoads } = useGetDispatchedLoadsQuery();

	const onSubmit = (data) => {
		const formData = {
			paymentStatus: "Invoiced",
			brokerInvoicedInfo: data,
		};
		updateLoad({ id: currentData._id, payload: formData })
			.unwrap()
			.then(() => {
				refetchLoads();
				setShowModalPaid(false);
				toast("Load payment status updated successfully!");
			});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box display="flex" alignItems="center" gap={1}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Controller
						name="lastDate"
						control={control}
						defaultValue={null}
						render={({ field }) => (
							<DateTimePicker
								{...field}
								label="Overdue date"
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

export default LoadInvoice;
