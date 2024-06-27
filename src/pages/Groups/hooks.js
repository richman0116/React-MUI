import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	useUpdateGroupMemberMutation,
	useAddGroupMutation,
	useGetAllGroupsQuery,
} from "../../services/group";
import data from "../../shared/features.json";

const useAddGroup = () => {
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

	const [showModal, setShowModal] = useState(false);
	const [disableSubmit, setDisableSubmit] = useState(false);
	const [latestGroup, setLatestGroup] = useState(null);

	const { data: groupData, isLoading, refetch } = useGetAllGroupsQuery();
	const [addGroup, { isLoadingPost, isErrorPost, isSuccessPost, errorPost }] =
		useAddGroupMutation();
	const [updateGroupMember, { isLoadingUpdate, isErrorUpdate }] = useUpdateGroupMemberMutation();

	const onSubmit = async (data) => {
		setDisableSubmit(true);
		try {
			if (currentData) {
				await updateGroupMember({ id: currentData._id, payload: data });
			} else {
				await addGroup(data);
			}
			toast(currentData ? "Group Member Added successfully!" : "Group created successfully!");
			setShowModal(false);
			reset();
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		} finally {
			setDisableSubmit(false);
			await refetch();
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
		groupData,
		onSubmit,
		setCurrentData,
		setShowModal,
		isLoading,
		latestGroup,
		setLatestGroup,
	};
};

export default useAddGroup;
