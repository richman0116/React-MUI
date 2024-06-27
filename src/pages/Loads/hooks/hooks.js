// import React, { useEffect, useRef, useState } from "react";
// import { useGetMeQuery } from "../../../services/user";
// import { useGetAssetsQuery } from "../../../services/assets";
// import { getGeocode, getLatLng } from "use-places-autocomplete";
// import { useGetCustomersQuery } from "../../../services/customer";
// import moment from "moment-timezone";
// import dayjs from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";
// import { useGetcarriersQuery } from "../../../services/carrier";

// dayjs.extend(advancedFormat);

// const useAddLoadsModal = ({
// 	register,
// 	currentData = null,
// 	setValue,
// 	watch,
// 	latestCustomer,
// 	latestCarrier,
// 	setLatestCustomer,
// 	setLatestCarrier,
// }) => {
// 	const { data: assetsData } = useGetAssetsQuery();
// 	const { data: customersData, refetch } = useGetCustomersQuery();
// 	const { data: carriersData, refetch: refetchCar } = useGetcarriersQuery();
// 	const { data: currentUser } = useGetMeQuery();

// 	const [pickDateOpen, setPickDateOpen] = React.useState(
// 		currentData ? dayjs(currentData.pickUpOpeningDateTime) : null
// 	);
// 	const [pickDateClose, setPickDateClose] = React.useState(
// 		currentData ? dayjs(currentData.pickUpClosingDateTime) : null
// 	);
// 	const [dropDateOpen, setDropDateOpen] = React.useState(
// 		currentData ? dayjs(currentData.dropOpeningDateTime) : null
// 	);
// 	const [dropDateClose, setDropDateClose] = React.useState(
// 		currentData ? dayjs(currentData.dropClosingDateTime) : null
// 	);
// 	const [isDriver, setIsDriver] = useState(currentData ? currentData.isDriver : false);

// 	const [selectedTruck, setSelectedTruck] = useState("");

// 	const [selectedCustomer, setSelectedCustomer] = useState(null);
// 	const [rpList, setRpList] = useState([]);
// 	const [currentRp, setCurrentRp] = useState(null);

// 	const [selectedCarrier, setSelectedCarrier] = useState(null);
// 	const [rpListCarrier, setRpListCarrier] = useState([]);
// 	const [currentRpCarrier, setCurrentRpCarrier] = useState(null);

// 	const inputRefCus = useRef(null);
// 	const inputRefCar = useRef(null);

// 	const handleAutocompleteChangeCustomer = (e, value) => {
// 		if (value) {
// 			const formDt = {
// 				id: value._id,
// 				name: `${value.customerName ? value.customerName + " -" : ""} ${value.customerEmail}`,
// 				number: value.customerNumber,
// 			};
// 			setRpList(value.representatives);
// 			setValue("customer", formDt, { shouldValidate: true });
// 			setSelectedCustomer(value);
// 			setLatestCustomer(null);
// 			if (inputRefCus.current) {
// 				inputRefCus.current.blur();
// 			}
// 		}
// 	};

// 	const handleAutocompleteChangeCarrier = (e, value) => {
// 		if (value) {
// 			const formDt = {
// 				id: value._id,
// 				name: `${value.name ? value.name + " -" : ""} ${value.email}`,
// 				phone: value.phone,
// 			};
// 			setRpListCarrier(value.representatives);
// 			setValue("carrier", formDt, { shouldValidate: true });
// 			setSelectedCarrier(value);
// 			setLatestCarrier(null);
// 			if (inputRefCar.current) {
// 				inputRefCar.current.blur();
// 			}
// 		}
// 	};

// 	useEffect(() => {
// 		if (setValue && currentData) {
// 			setValue("customer", currentData.customer, { shouldValidate: true });
// 			setValue("carrier", currentData.carrier, { shouldValidate: true });
// 			setValue("representativesCustomer", currentData.representativesCustomer, {
// 				shouldValidate: true,
// 			});
// 			setValue("representativesCarrier", currentData.representativesCarrier, {
// 				shouldValidate: true,
// 			});
// 			setValue("pickUpLocation", currentData.pickUpLocation, { shouldValidate: true });
// 			setValue("destination", currentData.destination, { shouldValidate: true });
// 			setValue("truckNumber", currentData.truckNumber, { shouldValidate: true });
// 			setValue("truckType", currentData.truckType, { shouldValidate: true });
// 		}
// 	}, [currentData]);

// 	useEffect(() => {
// 		if (currentData && carriersData) {
// 			const cari = carriersData.carriers.find((v) => currentData.carrier.phone == v.phone);
// 			const rp = cari.representatives.length
// 				? cari.representatives.find((r) => currentData.representativesCarrier == r.phone)
// 				: null;
// 			setRpListCarrier(cari.representatives);
// 			setCurrentRpCarrier(rp);
// 			setSelectedCarrier(cari);
// 		}
// 	}, [currentData, carriersData]);

// 	useEffect(() => {
// 		if (customersData && currentData) {
// 			const cus = customersData.customers.find(
// 				(v) => currentData.customer.number == v.customerNumber
// 			);
// 			const rp = cus.representatives.length
// 				? cus.representatives.find((r) => currentData.representativesCustomer == r.phone)
// 				: null;
// 			setRpList(cus.representatives);
// 			setCurrentRp(rp);
// 			setSelectedCustomer(cus);
// 		}
// 	}, [currentData, customersData]);

// 	useEffect(() => {
// 		if (latestCustomer) {
// 			refetch();
// 			const formDt = {
// 				id: latestCustomer._id,
// 				name: `${latestCustomer.customerName ? latestCustomer.customerName + " -" : ""} ${
// 					latestCustomer.customerEmail
// 				}`,
// 				number: latestCustomer.customerNumber,
// 			};
// 			setValue("customer", formDt, { shouldValidate: true });
// 			setRpList(latestCustomer.representatives);
// 		}
// 	}, [latestCustomer]);

// 	useEffect(() => {
// 		if (latestCarrier) {
// 			refetchCar();
// 			const formDt = {
// 				id: latestCarrier._id,
// 				name: `${latestCarrier.name ? latestCarrier.name + " -" : ""} ${latestCarrier.email}`,
// 				number: latestCarrier.phone,
// 			};
// 			setValue("carrier", formDt, { shouldValidate: true });
// 			setRpListCarrier(latestCarrier.representatives);
// 		}
// 	}, [latestCarrier]);

// 	useEffect(() => {
// 		if (assetsData && currentData) {
// 			const asset = assetsData.assets.find((asset) => asset.assetId === currentData?.truckNumber);
// 			setSelectedTruck(asset);
// 		}
// 	}, [assetsData, currentData]);

// 	const handlePickUpDateChangeOpen = (date) => {
// 		setPickDateOpen(date);
// 		setValue("pickUpOpeningDateTime", date.format("YYYY-MM-DD, hh:mm A"), { shouldValidate: true });
// 	};

// 	const handlePickUpDateChangeClose = (date) => {
// 		setPickDateClose(date);
// 		setValue("pickUpClosingDateTime", date.format("YYYY-MM-DD, hh:mm A"), { shouldValidate: true });
// 	};

// 	const handleDropDateChangeOpen = (date) => {
// 		setDropDateOpen(date);
// 		setValue("dropOpeningDateTime", date.format("YYYY-MM-DD, hh:mm A"), { shouldValidate: true });
// 	};

// 	const handleDropDateChangeClose = (date) => {
// 		setDropDateClose(date);
// 		setValue("dropClosingDateTime", date.format("YYYY-MM-DD, hh:mm A"), { shouldValidate: true });
// 	};

// 	const handleAutocompleteChangeDes = async (event, newValue) => {
// 		if (newValue) {
// 			setValue("destination", newValue.description, { shouldValidate: true });
// 			const address = newValue.description;
// 			const results = await getGeocode({ address });
// 			const { lat, lng } = await getLatLng(results[0]);
// 			setValue("geoCodeDes", [lat, lng], { shouldValidate: true });
// 		}
// 	};

// 	const validatePickUpDate = (value) => {
// 		const dropDateValue = watch("dropOpeningDateTime");
// 		const pickUpDate = moment(value, "MM/DD/YYYY");
// 		const dropDate = moment(dropDateValue, "MM/DD/YYYY");

// 		if (pickUpDate.isValid() && dropDate.isValid() && pickUpDate.isAfter(dropDate)) {
// 			return "Pickup date must be less than the drop date";
// 		}

// 		return true;
// 	};

// 	const validateDropDate = (value) => {
// 		const pickUpDateValue = watch("pickUpClosingDateTime");
// 		const pickUpDate = moment(pickUpDateValue, "MM/DD/YYYY");
// 		const dropDate = moment(value, "MM/DD/YYYY");

// 		if (pickUpDate.isValid() && dropDate.isValid() && dropDate.isBefore(pickUpDate)) {
// 			return "Drop date must be greater than the pickup date";
// 		}

// 		return true;
// 	};

// 	const handleAutocompleteChange = async (event, newValue) => {
// 		if (newValue) {
// 			setValue("pickUpLocation", newValue.description, { shouldValidate: true });
// 			const address = newValue.description;
// 			const results = await getGeocode({ address });
// 			const { lat, lng } = await getLatLng(results[0]);
// 			setValue("geoCodePick", [lat, lng], { shouldValidate: true });
// 		}
// 	};

// 	const handleIsDriverChange = (event) => {
// 		setIsDriver(event.target.checked);
// 		setValue("isDriver", event.target.checked);
// 	};

// 	return {
// 		selectedCustomer,
// 		selectedCarrier,
// 		customersData,
// 		carriersData,
// 		currentRp,
// 		currentRpCarrier,
// 		rpList,
// 		rpListCarrier,
// 		setCurrentRp,
// 		setCurrentRpCarrier,
// 		handleAutocompleteChange,
// 		handleAutocompleteChangeDes,
// 		assetsData,
// 		validatePickUpDate,
// 		validateDropDate,
// 		pickDateOpen,
// 		pickDateClose,
// 		dropDateOpen,
// 		dropDateClose,
// 		currentUser,
// 		isDriver,
// 		handleIsDriverChange,
// 		inputRefCus,
// 		handleAutocompleteChangeCustomer,
// 		inputRefCar,
// 		handleAutocompleteChangeCarrier,
// 		handlePickUpDateChangeOpen,
// 		handlePickUpDateChangeClose,
// 		handleDropDateChangeOpen,
// 		handleDropDateChangeClose,
// 		selectedTruck,
// 		setSelectedTruck,
// 	};
// };

// export default useAddLoadsModal;
