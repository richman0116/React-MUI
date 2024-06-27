import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatingLocation } from "../../../../store/slice/globalSlice";
import { findNearest } from "geolib";
import usZips from "us-zips/array";
import { getAddressCoordinates } from "../../../../utils/getAddressCoordinates";
import { formatDate, formatTime } from "../../../../utils/dateUtils";

const usePickUpInformation = ({ currentData = null, setValueGlobal }) => {
	const {
		reset,
		register,
		watch,
		control,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [pickUpInformation, setPickUpInformation] = useState(
		currentData ? currentData.pickUpList : []
	);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (setValueGlobal && pickUpInformation.length) {
			setValueGlobal("pickUpList", pickUpInformation, { shouldValidate: true });
		}
	}, [pickUpInformation.pickUpList]);

	const [pickDateOpen, setPickDateOpen] = React.useState(null);
	const [pickDateClose, setPickDateClose] = React.useState(null);
	const [currentIndex, setCurrentIndex] = React.useState(null);

	const handlePickUpDateChangeOpen = (date) => {
		setPickDateOpen(date);
		setValue("pickUpOpeningDateTime", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const handlePickUpDateChangeClose = (date) => {
		setPickDateClose(date);
		setValue("pickUpClosingDateTime", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const dispatch = useDispatch();

	const handleAutocompleteChange = async (event, newValue) => {
		if (newValue) {
			let lat = newValue.lat;
			let lon = newValue.lon;
			if (!lat || !lon) {
				const cord = await getAddressCoordinates(newValue.display_name);
				lat = cord.lat;
				lon = cord.lng;
			}
			setValue("geoCodePick", [lat, lon], { shouldValidate: true });
			setValue("pickUpLocation", newValue.display_name, {
				shouldValidate: true,
			});
		}
		dispatch(setUpdatingLocation(false));
	};

	const validatePickUpDate = (value) => {
		const dropDateValue = watch("dropOpeningDateTime");
		const pickUpDate = moment(value, "MM/DD/YYYY");
		const dropDate = moment(dropDateValue, "MM/DD/YYYY");

		if (pickUpDate.isValid() && dropDate.isValid() && pickUpDate.isAfter(dropDate)) {
			return "Pickup date must be less than the drop date";
		}

		return true;
	};

	useEffect(() => {
		if (!showModal) {
			setCurrentIndex(null);
		}
	}, [showModal]);

	const onSubmit = async (data) => {
		let currentPickup = [];
		if (currentIndex !== null) {
			const tempPickUpInformation = pickUpInformation;
			tempPickUpInformation[currentIndex] = {
				...data,
				pickUpOpeningDateTime: `${formatDate(data.pickUpOpeningDateTime)}, ${formatTime(
					data.pickUpOpeningDateTime
				)}`,
			};
			currentPickup = tempPickUpInformation;
			setPickUpInformation(tempPickUpInformation);
		} else {
			currentPickup = [...pickUpInformation, data];
			setPickUpInformation([...pickUpInformation, data]);
		}

		if (setValueGlobal && currentPickup.length) {
			setValueGlobal("pickUpList", currentPickup, { shouldValidate: true });
		}

		setPickDateOpen(null);
		setPickDateClose(null);
		setShowModal(false);
		reset();
	};

	return {
		register,
		errors,
		watch,
		control,
		reset,
		setValue,
		handleAutocompleteChange,
		handlePickUpDateChangeOpen,
		pickDateOpen,
		validatePickUpDate,
		pickDateClose,
		handlePickUpDateChangeClose,
		handleSubmit,
		onSubmit,
		pickUpInformation,
		setPickUpInformation,
		showModal,
		setShowModal,
		setPickDateOpen,
		setCurrentIndex,
		currentIndex,
	};
};

export default usePickUpInformation;
