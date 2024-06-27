import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useInviteMemberMutation } from "../../services/user";

const useInviteMember = () => {
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
	const [latestGroup, setLatestGroup] = useState(null);
	const [inviteMember] = useInviteMemberMutation();

	const onSubmit = async (data) => {
		const dataToSend = data;
		setDisableSubmit(true);
		const res = await inviteMember(dataToSend);
		if (res.data && res.data.sucess) {
			toast(dataToSend && `Invitation sent successfully to - ${data.recipentMail}`);
			reset();
			setShowModal(false);
		} else {
			toast.error("Invited sent failed!");
		}
		setDisableSubmit(false);
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
		onSubmit,
		setShowModal,
		latestGroup,
		setLatestGroup,
	};
};
export default useInviteMember;
