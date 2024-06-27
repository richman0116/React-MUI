import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const useAddAssestModal = ({ setValue, currentData }) => {
	const handleTypeChange = (e) => {
		const selectedStatus = e.target.value;
		setValue("type", selectedStatus, { shouldValidate: true });
	};

	const handleAutocompleteChange = async (event, newValue) => {
		if (newValue) {
			setValue("location", newValue.display_name, { shouldValidate: true });
			let lat = newValue.lat;
			let lon = newValue.lon;
			setValue("geoCode", [lat, lon], { shouldValidate: true });
		}
	};

	const [availableDate, setAvailableDate] = React.useState(
		currentData ? dayjs(currentData.availableDate) : null
	);

	const [deliveryDate, setDeliveryDate] = React.useState(
		currentData ? dayjs(currentData.deliveryDate) : null
	);

	const [insuranceStartDate, setInsuranceStartDate] = React.useState(
		currentData && currentData.insuranceStartDate ? dayjs(currentData.insuranceStartDate) : null
	);

	const [insuranceEndDate, setInsuranceEndDate] = React.useState(
		currentData && currentData.insuranceEndDate ? dayjs(currentData.insuranceEndDate) : null
	);

	const [licenceExpDate, setLicenceExpDate] = React.useState(
		currentData && currentData.licenceExpDate ? dayjs(currentData.licenceExpDate) : null
	);

	const [vehicleRegExpDate, setVehicleRegExpDate] = React.useState(
		currentData && currentData.vehicleRegExpDate ? dayjs(currentData.vehicleRegExpDate) : null
	);

	const handleAvailableDateChange = (date) => {
		setAvailableDate(date);
		setValue("availableDate", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const handleDeliveryDateChange = (date) => {
		setDeliveryDate(date);
		setValue("deliveryDate", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const handleIssueStartDateChange = (date) => {
		setInsuranceStartDate(date);
		setValue("insuranceStartDate", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const handleIssueEndDateChange = (date) => {
		setInsuranceEndDate(date);
		setValue("insuranceEndDate", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const handleLicenceExpDateChange = (date) => {
		setLicenceExpDate(date);
		console.log(date);
		setValue("licenceExpDate", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const handleVehicleRegExpDate = (date) => {
		setVehicleRegExpDate(date);
		setValue("vehicleRegExpDate", date.format("MM/DD/YYYY, hh:mm A"), { shouldValidate: true });
	};

	const [isAavailableDate, setIsAvailableDate] = useState(
		currentData ? !!currentData.availableDate : false
	);

	const [isDeliveryDate, setIsDeliveryDate] = useState(
		currentData ? !!currentData.deliveryDate : false
	);

	const handleStatusChange = (e) => {
		const selectedStatus = e.target.value;
		setValue("status", selectedStatus, { shouldValidate: true });
		if (selectedStatus === "available_on") {
			setIsAvailableDate(true);
		} else {
			setIsAvailableDate(false);
		}
		if (selectedStatus === "on_our_load") {
			setIsDeliveryDate(true);
		} else {
			setIsDeliveryDate(false);
		}
	};

	/* 	function generateUniqueId() {
		const timestamp = Date.now().toString(); // Get the current timestamp as a string
		const uniqueId = timestamp.slice(-8); // Take the last 8 digits of the timestamp

		return uniqueId;
	} */

	const handleDriverCertificationsChange = (event, options) => {
		setValue("driverCirtifications", options.join(","));
	};

	useEffect(() => {
		if (setValue && currentData) {
			setValue("location", currentData.location, { shouldValidate: true });
			setValue("owner", currentData.owner, { shouldValidate: true });
			setValue("availableDate", currentData?.availableDate, { shouldValidate: true });
			setValue("insuranceStartDate", currentData?.insuranceStartDate, { shouldValidate: true });
			setValue("insuranceEndDate", currentData?.insuranceEndDate, { shouldValidate: true });
			setValue("licenceExpDate", currentData?.licenceExpDate, { shouldValidate: true });
			setValue("vehicleRegExpDate", currentData?.vehicleRegExpDate, { shouldValidate: true });
		}
	}, [currentData]);

	return {
		handleAutocompleteChange,
		availableDate,
		handleAvailableDateChange,
		isAavailableDate,
		handleStatusChange,
		handleDriverCertificationsChange,
		handleTypeChange,
		insuranceStartDate,
		insuranceEndDate,
		handleIssueStartDateChange,
		handleIssueEndDateChange,
		deliveryDate,
		handleDeliveryDateChange,
		isDeliveryDate,
		licenceExpDate,
		vehicleRegExpDate,
		handleLicenceExpDateChange,
		handleVehicleRegExpDate,
	};
};

export default useAddAssestModal;
