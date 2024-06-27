import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
	useAddOrganizationMutation,
	useGetOrganizationsQuery,
	useUpdateOrganizationMutation,
} from "../../services/organization";

const useAddOrganization = () => {
	const {
		reset,
		register,
		watch,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
		unregister,
	} = useForm();

	const [showModal, setShowModal] = useState(false);
	const [disableSubmit, setDisableSubmit] = useState(false);
	const [currentData, setCurrentData] = useState(null);
	const [orgStatus, setOrgStatus] = useState(true);
	// const currentOrganizationDt = useSelector((state) => state.global.currentOrganizationDt);

	const { data: organizationsData, isSuccess, isLoading, refetch } = useGetOrganizationsQuery();
	const [addOrganization, { isLoadingPost, isErrorPost, isSuccessPost, errorPost }] =
		useAddOrganizationMutation();
	const [updateOrganization, { isLoadingUpdate, isErrorUpdate }] = useUpdateOrganizationMutation();

	const onSubmit = async (data) => {
		console.log("Organization Data Submitted - ", data);
		setDisableSubmit(true);
		try {
			let res;
			if (currentData) {
				res = await updateOrganization({
					id: currentData._id,
					payload: { ...data, active: orgStatus },
				});
			} else {
				res = await addOrganization(data);
			}
			console.log(res);
			if (res && res.sucess) {
				await refetch();
				toast(
					currentData ? "Organization updated successfully!" : "Organization added successfully!"
				);
				setShowModal(false);
				reset();
			} else {
				toast.error("An error occurred. Please try again later.");
			}
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
		organizationsData,
		onSubmit,
		setCurrentData,
		setShowModal,
		isLoading,
		// latestCustomer,
		// setLatestCustomer,
		setDisableSubmit,
		unregister,
		orgStatus,
		setOrgStatus,
	};
};

export default useAddOrganization;
