import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	useGetAllBranchesQuery,
	useAddBranchMutation,
	useUpdateBranchMutation,
	useUpdateBranchFeaturesMutation,
	useUpdateBranchMemberMutation,
} from "../../../services/branch";

const useAccessManagement = () => {
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
	const [latestBranch, setLatestBranch] = useState(null);

	const { data: getTheData, isLoading, refetch } = useGetAllBranchesQuery();

	const [updateBranchFeature] = useUpdateBranchFeaturesMutation();

	const onSubmit = async (data) => {
		console.log(data);
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
		onSubmit,
		disableSubmit,
		setDisableSubmit,
		getTheData,
		currentData,
		setCurrentData,
		setShowModal,
		isLoading,
		latestBranch,
		setLatestBranch,
		updateBranchFeature,
	};
};

export default useAccessManagement;
