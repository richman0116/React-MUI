import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	useGetAllBranchesQuery,
	useAddBranchMutation,
	// useUpdateBranchMutation,
	useUpdateBranchMemberMutation,
} from "../../../services/branch";
import data from "../../../shared/features.json";

const useTeamList = () => {
	const [currentData, setCurrentData] = useState(null);
	const {
		reset,
		register,
		watch,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			accessFeatures: currentData && currentData.accessFeatures ? currentData.accessFeatures : data,
		},
	});

	useEffect(() => {
		if (currentData && currentData.accessFeatures) {
			setValue("accessFeatures", currentData.accessFeatures);
		}
	}, [currentData]);

	const [showModal, setShowModal] = useState(false);
	const [disableSubmit, setDisableSubmit] = useState(false);

	const { data: getTheData, isLoading, refetch } = useGetAllBranchesQuery();
	// const [updateBranch] = useUpdateBranchMutation();
	const [addBranch] = useAddBranchMutation();
	const [updateBranchMember] = useUpdateBranchMemberMutation();

	const onSubmit = async (data) => {
		setDisableSubmit(true);
		try {
			if (currentData) {
				await updateBranchMember({ id: currentData._id, payload: data });
			} else {
				await addBranch(data);
			}
			await refetch();

			toast(currentData ? "Team Member Added successfully!" : "Team created successfully!");
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
		getTheData,
		onSubmit,
		currentData,
		setCurrentData,
		setShowModal,
		isLoading,
	};
};

export default useTeamList;
