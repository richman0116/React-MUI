import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLazyGetDispatchedLoadsQuery, useUpdateOrderMutation } from "../../services/load";
import { toast } from "react-toastify";

const LoadInvoice = ({ currentData, setShowModalPaid }) => {
	const { control, handleSubmit } = useForm();
	const [updateLoad] = useUpdateOrderMutation();
	const [refetchLoads] = useLazyGetDispatchedLoadsQuery();

	const onSubmit = (data) => {
		const date = data.lastDate;
		data.lastDate = date.format("MM/DD/YYYY, hh:mm A");
		const formData = {
			paymentStatus: "Invoiced",
			lastBrokerPaymentStatus: "Invoiced",
			brokerInvoicedInfo: {
				lastDate: data.lastDate,
				invoicedFile: currentData?.brokerInvoicedInfo?.invoicedFile,
			},
		};
		updateLoad({ id: currentData._id, payload: formData })
			.unwrap()
			.then(() => {
				refetchLoads("?page=1&rowsPerPage=300");
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
					Mark As Last Date
				</Button>
			</Box>
		</form>
	);
};

export default LoadInvoice;
