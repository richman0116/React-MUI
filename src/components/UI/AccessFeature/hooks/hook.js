import React, { useState } from "react";
import {
	useGetAllBranchesQuery,
	useUpdateBranchFeaturesMutation,
	useUpdateGroupFeaturesMutation,
} from "../../../../services/branch";
import { toast } from "react-toastify";
import { useGetAllGroupsQuery } from "../../../../services/group";
import { useForm } from "react-hook-form";
import data from "../../../../shared/features.json";

const useAccessFeature = ({ branch, setOpen, group }) => {
	const { refetch: refetchGroup } = useGetAllGroupsQuery();
	const { refetch: refetchBranch } = useGetAllBranchesQuery();
	const [updateFeatureGroup, { isLoading: updateLodingGroup }] = useUpdateGroupFeaturesMutation();
	const [updateFeatureBranch, { isLoading: updateLodingBranch }] =
		useUpdateBranchFeaturesMutation();

	const { handleSubmit, watch, setValue } = useForm({
		defaultValues:
			group && group.accessFeatures
				? { accessFeatures: group.accessFeatures }
				: branch && branch.accessFeatures
				? { accessFeatures: branch.accessFeatures }
				: { accessFeatures: data },
	});

	const onSubmit = async (data) => {
		try {
			if (group && group._id) {
				await updateFeatureGroup({ id: group._id, payload: data });
				await refetchGroup();
			} else if (branch && branch._id) {
				await updateFeatureBranch({ id: branch._id, payload: data });
				await refetchBranch();
			}
			toast("Permission Added successfully!");
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		} finally {
			setOpen(false);
		}
	};

	return {
		handleSubmit,
		onSubmit,
		watch,
		setValue,
		updateLodingGroup,
		updateLodingBranch,
	};
};

export default useAccessFeature;
