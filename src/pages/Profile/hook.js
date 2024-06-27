import { useForm } from "react-hook-form";
import { config } from "../../config";
import { useGetMeQuery } from "../../services/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const useEditProfile = () => {
	const {
		reset,
		register,
		watch,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm();

	const [disableSubmit, setDisableSubmit] = useState(false);
	const [currentData, setCurrentData] = useState(null);
	const [img, setImg] = useState(null);

	const accessToken = localStorage.getItem(config.accessTokenName) || "";
	const { data: userData, refetch } = useGetMeQuery(accessToken);

	useEffect(() => {
		if (userData && userData.user && userData.user.avatar && userData.user.avatar.location) {
			setImg(userData.user.avatar.location);
		}
	}, [userData]);

	const onSubmit = async (data) => {
		setDisableSubmit(true);
		try {
			const formData = new FormData();
			if (data.phone) {
				formData.append("phone", data.phone);
			}

			if (data.organizationLogo && data.organizationLogo instanceof File) {
				formData.append("file", data.organizationLogo, data.organizationLogo.name);
			}

			try {
				const accessToken = localStorage.getItem(config.accessTokenName);
				const response = await axios({
					method: "put",
					url: `${config.apiBaseUrl}/user/${userData.user._id}`,
					data: formData,
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				if (response.data && !response.error) {
					refetch();
					toast("Updated successful!");
					setDisableSubmit(false);
				} else {
					console.error("Update failed:", response.error);
					toast("Failed to update user data.");
					setDisableSubmit(false);
				}
			} catch (error) {
				console.error("Error:", error);
				throw error;
			}
		} catch (error) {
			// Handle any errors that occur during the update process
			console.error("An error occurred:", error);
			alert("An unexpected error occurred while updating user data.");
			setDisableSubmit(false);
		}
	};

	return {
		userData,
		reset,
		register,
		watch,
		handleSubmit,
		setValue,
		control,
		errors,
		disableSubmit,
		currentData,
		onSubmit,
		setCurrentData,
		img,
		setImg,
	};
};
export default useEditProfile;
