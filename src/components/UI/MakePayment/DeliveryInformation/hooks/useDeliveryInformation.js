import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUpdatingLocation } from "../../../../../store/slice/globalSlice";
import { getAddressCoordinates } from "../../../../../utils/getAddressCoordinates";
import { formatDate, formatTime } from "../../../../../utils/dateUtils";

const useDeliveryInformation = ({ currentData = null, setValueGlobal }) => {
	const {
		reset,
		register,
		watch,
		setValue,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();

	const [deliveryInformation, setDeliveryInformation] = useState(
		currentData ? currentData.destinationList : []
	);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (setValueGlobal && deliveryInformation.length) {
			setValueGlobal("destinationList", deliveryInformation, { shouldValidate: true });
		}
	}, [deliveryInformation]);

	const [dropDateOpen, setDropDateOpen] = React.useState(null);
	const [dropDateClose, setDropDateClose] = React.useState(null);
	const [currentIndex, setCurrentIndex] = React.useState(null);

	const handleDropDateChangeOpen = (date) => {
		setDropDateOpen(date);
		setValue("dropOpeningDateTime", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const handleDropDateChangeClose = (date) => {
		setDropDateClose(date);
		setValue("dropClosingDateTime", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const dispatch = useDispatch();

	const handleAutocompleteChangeDes = async (event, newValue) => {
		if (newValue) {
			let lat = newValue.lat;
			let lon = newValue.lon;
			if (!lat || !lon) {
				const cord = await getAddressCoordinates(newValue.display_name);
				lat = cord.lat;
				lon = cord.lng;
			}
			setValue("geoCodeDes", [lat, lon], { shouldValidate: true });
			setValue("destination", newValue.display_name, {
				shouldValidate: true,
			});
		}
		dispatch(setUpdatingLocation(false));
	};

	const validateDropDate = (value) => {
		const pickUpDateValue = watch("pickUpClosingDateTime");
		const pickUpDate = moment(pickUpDateValue, "MM/DD/YYYY");
		const dropDate = moment(value, "MM/DD/YYYY");

		if (pickUpDate.isValid() && dropDate.isValid() && dropDate.isBefore(pickUpDate)) {
			return "Drop date must be greater than the pickup date";
		}

		return true;
	};

	useEffect(() => {
		if (!showModal) {
			setCurrentIndex(null);
		}
	}, [showModal]);

	const onSubmit = async (data) => {
		let currentDel = [];
		if (currentIndex !== null) {
			const tempPickUpInformation = deliveryInformation;
			tempPickUpInformation[currentIndex] = {
				...data,
				dropOpeningDateTime: `${formatDate(data.dropOpeningDateTime)}, ${formatTime(
					data.dropOpeningDateTime
				)}`,
			};
			currentDel = tempPickUpInformation;
			setDeliveryInformation(tempPickUpInformation);
		} else {
			currentDel = [...deliveryInformation, data];
			setDeliveryInformation([...deliveryInformation, data]);
		}
		if (setValueGlobal && currentDel.length) {
			setValueGlobal("destinationList", currentDel, { shouldValidate: true });
		}
		reset();
		setDropDateOpen(null);
		setDropDateClose(null);
		setShowModal(false);
	};

	return {
		register,
		errors,
		watch,
		handleSubmit,
		onSubmit,
		handleAutocompleteChangeDes,
		validateDropDate,
		dropDateOpen,
		handleDropDateChangeOpen,
		dropDateClose,
		handleDropDateChangeClose,
		deliveryInformation,
		setDeliveryInformation,
		showModal,
		reset,
		setValue,
		control,
		setShowModal,
		setDropDateOpen,
		setCurrentIndex,
		currentIndex,
	};
};

export default useDeliveryInformation;
