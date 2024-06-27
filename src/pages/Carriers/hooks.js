import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	useGetcarriersQuery,
	useAddcarrierMutation,
	useUpdatecarrierMutation,
} from "../../services/carrier";

const useAddCarrier = () => {
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
	const [latestCarrier, setLatestCarrier] = useState(null);

	const { data: carriersData, isSuccess, isLoading, refetch } = useGetcarriersQuery();
	const [addCarrier, { isLoadingPost, isErrorPost, isSuccessPost, errorPost }] =
		useAddcarrierMutation();
	const [updateCarrier, { isLoadingUpdate, isErrorUpdate }] = useUpdatecarrierMutation();
	const onSubmit = async (data) => {
		// console.log(data);
		setDisableSubmit(true);
		try {
			if (currentData) {
				if (carriersData && carriersData.carriers && carriersData.loads.length > 0) {
					// Find the largest loadId from loadsData.loads
					const largestCarId = carriersData.carriers.reduce((maxCarId, load) => {
						const currentCarId = parseInt(load.loadId, 10);
						return currentCarId > maxCarId ? currentCarId : maxCarId;
					}, 0);
					const nextLoadId = largestCarId + 1;
					data.carrierId = String(nextLoadId).padStart(7, "0");
					await updateCarrier({ id: currentData._id, payload: data });
				}
			} else {
				await addCarrier(data).then((res) => {
					setLatestCarrier(res.data.carrier);
				});
			}
			await refetch();
			toast(currentData ? "Carrier updated successfully!" : "Carrier added successfully!");
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
		carriersData,
		onSubmit,
		setCurrentData,
		setShowModal,
		isLoading,
		latestCarrier,
		setLatestCarrier,
	};
};

export default useAddCarrier;
