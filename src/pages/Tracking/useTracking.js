import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLazyGetQuotesQuery, useUpdateOrderMutation } from "../../services/load";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useTracking = () => {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
		control,
		unregister,
		watch,
	} = useForm();

	const [currentData, setCurrentData] = useState(null);
	const [isDirty, setIsDirty] = useState(false);
	const [updateOrder, { isLoading: isLoadingUpdate }] = useUpdateOrderMutation();
	const [triggerLoads] = useLazyGetQuotesQuery();
	const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQuery);
	const [showTrackModal, setShowTrackModal] = useState(false);

	const onSubmit = async (data) => {
		let isError = false;
		try {
			const res = await updateOrder({ id: currentData._id, payload: data }).unwrap();
			console.log(res);
			if (res.load) {
				setCurrentData({
					...currentData,
					status: res.load.status,
					statusHistory: res.load.statusHistory,
				});
			}
			toast("Tracking updated successfully!");
		} catch (error) {
			console.log(error);
			isError = true;
		} finally {
			if (!isError) {
				reset();
				triggerLoads(lastLoadsQuery);
				// setShowTrackModal(false);
			}
			isError = false;
		}
	};

	useEffect(() => {
		if (!showTrackModal) {
			setCurrentData(null);
		}
	}, [showTrackModal]);

	return {
		register,
		handleSubmit,
		reset,
		setValue,
		errors,
		control,
		unregister,
		watch,
		onSubmit,
		currentData,
		setCurrentData,
		isDirty,
		setIsDirty,
		isLoadingUpdate,
		showTrackModal,
		setShowTrackModal,
	};
};

export default useTracking;
