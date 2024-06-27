import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	useAddCustomerMutation,
	useGetCustomersQuery,
	useUpdateCustomerMutation,
} from "../../services/customer";
import { useSelector } from "react-redux";

const useAddCustomer = () => {
	const {
		reset,
		register,
		watch,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm();

	const [showModal, setShowModal] = useState(false);
	const [disableSubmit, setDisableSubmit] = useState(false);
	const [currentData, setCurrentData] = useState(null);
	const currentCustomerDt = useSelector((state) => state.global.currentCustomerDt);
	const [latestCustomer, setLatestCustomer] = useState(null);

	const { data: customersData, isSuccess, isLoading, refetch } = useGetCustomersQuery();
	const [addCustomer, { isLoadingPost, isErrorPost, isSuccessPost, errorPost }] =
		useAddCustomerMutation();
	const [updateCustomer, { isLoadingUpdate, isErrorUpdate }] = useUpdateCustomerMutation();
	const onSubmit = async (data) => {
		setDisableSubmit(true);
		try {
			if (currentData) {
				await updateCustomer({ id: currentData._id, payload: data });
			} else if (currentCustomerDt) {
				await updateCustomer({
					id: currentCustomerDt._id ? currentCustomerDt._id : currentCustomerDt.id,
					payload: data,
				}).then((res) => {
					setLatestCustomer(res.data.customer);
				});
			} else {
				await addCustomer(data).then((res) => {
					setLatestCustomer(res.data.customer);
				});
			}
			await refetch();
			toast(
				currentData || currentCustomerDt
					? "Customer updated successfully!"
					: "Customer added successfully!"
			);
			setShowModal(false);
			reset();
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		} finally {
			setDisableSubmit(false);
		}
	};
	return {
		reset,
		register,
		watch,
		handleSubmit,
		setValue,
		control,
		errors,
		showModal,
		disableSubmit,
		currentData,
		customersData,
		onSubmit,
		setCurrentData,
		setShowModal,
		isLoading,
		latestCustomer,
		setLatestCustomer,
		setDisableSubmit,
	};
};

export default useAddCustomer;
