import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	// eslint-disable-next-line import/named
	useGetDispatchedLoadsQuery,
	useGetLoadIdsQuery,
	useLazyGetLoadByIdQuery,
} from "../../../../services/load";
import {
	useAddPaymentMutation,
	useLazyGetPaymentsQuery,
	useUpdatePaymentMutation,
} from "../../../../services/payment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../../routes";

const usePaymentPreview = ({ loadId = null, setOpen }) => {
	const { data: loadIds, isLoading } = useGetLoadIdsQuery();
	const [trigger, { data: loadDetails, isFetching }] = useLazyGetLoadByIdQuery();
	const { refetch } = useGetDispatchedLoadsQuery();
	const [showModal, setShowModal] = useState(false);
	const [selectedPaymentType, setSelectedPaymentType] = useState("");
	const [isUpdate, setIsUpdate] = useState(false);
	const navigate = useNavigate();

	const {
		reset,
		register,
		watch,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [addPayment, { isLoading: addLoading }] = useAddPaymentMutation();
	const [updatePayment, { isLoading: updateLoading }] = useUpdatePaymentMutation();
	const [triggerPayments] = useLazyGetPaymentsQuery();

	useEffect(() => {
		if (loadId) {
			trigger(loadId);
		}
	}, [loadId]);

	useEffect(() => {
		if (loadDetails && loadDetails.load) {
			const updt = !(
				(!loadDetails.load.incomingPayment && selectedPaymentType === "incoming") ||
				(!loadDetails.load.outgoingPayment && selectedPaymentType === "outgoing")
			);
			setIsUpdate(updt);
		}
	}, [loadDetails, selectedPaymentType]);

	const onSubmit = async (data) => {
		try {
			if (data) {
				if (!isUpdate) {
					await addPayment({ id: loadDetails.load._id, payload: data });
					toast("Payment added successfully!");
				} else {
					await updatePayment({ id: loadDetails.load._id, payload: data });
					toast("Payment update successfully!");
				}
				trigger(loadDetails.load._id);
				triggerPayments("");
				setShowModal(false);
				setOpen(false);
				reset();
				refetch();
				navigate(ROUTES.PATHS.DISPATCHED_LOADS);
			}
		} catch (error) {
			console.error("Error adding payment:", error);
			toast.error("An error occurred. Please try again later.");
		}
	};

	const onChangeLoadId = async (newValue) => {
		await trigger(newValue._id);
	};

	return {
		loadIds,
		isLoading,
		loadDetails,
		onChangeLoadId,
		register,
		watch,
		setValue,
		handleSubmit,
		onSubmit,
		showModal,
		setShowModal,
		errors,
		selectedPaymentType,
		setSelectedPaymentType,
		isUpdate,
		isFetching,
		addLoading,
		updateLoading,
	};
};

export default usePaymentPreview;
