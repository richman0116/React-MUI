import React, { useState, useEffect } from "react";
import { useLazyGetPaymentsQuery } from "../../../services/payment";
import { useGetcarriersQuery } from "../../../services/carrier";
import { useGetCustomersQuery } from "../../../services/customer";
import { useGetAssetsQuery } from "../../../services/assets";

const usePayments = () => {
	const [paymentOpen, setPaymentOpen] = useState(false);
	const [trigger, { data: paymentsData, isFetching }] = useLazyGetPaymentsQuery();
	const [activeButton, setActiveButton] = useState("all");
	const { data: carriers } = useGetcarriersQuery();
	const { data: customers } = useGetCustomersQuery();
	const { data: assets } = useGetAssetsQuery();
	const [loadId, setLoadId] = useState(null);

	const handleEdit = (loadId) => {
		setLoadId(loadId);
		setPaymentOpen(true);
	};

	const [selectedCustomerId, setSelectedCustomerId] = React.useState([]);
	const [selectedCarrierId, setSelectedCarrierId] = React.useState([]);
	const [selectedAssetId, setSelectedAssetId] = React.useState([]);

	const handleChange = (event, type) => {
		if (type === "customer") setSelectedCustomerId(event.target.value);
		if (type === "carrier") setSelectedCarrierId(event.target.value);
		if (type === "asset") setSelectedAssetId(event.target.value);
	};

	useEffect(() => {
		let query = "";
		if (activeButton === "incoming") query = "?paymentType=incoming";
		if (activeButton === "outgoing") query = "?paymentType=outgoing";

		if (selectedCarrierId.length) {
			query = query.length
				? `${query}&&carrierId=${selectedCarrierId.join(",")}`
				: `?carrierId=${selectedCarrierId.join(",")}`;
		}
		if (selectedCustomerId.length) {
			query = query.length
				? `${query}&&customerId=${selectedCustomerId.join(",")}`
				: `?customerId=${selectedCustomerId.join(",")}`;
		}
		if (selectedAssetId.length) {
			query = query.length
				? `${query}&&customerId=${selectedAssetId.join(",")}`
				: `?customerId=${selectedAssetId.join(",")}`;
		}
		trigger(query);
	}, [selectedCarrierId, selectedCustomerId, activeButton, selectedAssetId]);

	const callGetPayments = async () => {
		await trigger("");
	};

	useEffect(() => {
		callGetPayments();
	}, []);

	// Define a function to handle button clicks
	const handleButtonClick = (buttonLabel) => {
		setActiveButton(buttonLabel);
	};

	return {
		paymentOpen,
		setPaymentOpen,
		handleButtonClick,
		paymentsData,
		isFetching,
		activeButton,
		carriers,
		selectedCustomerId,
		handleChange,
		customers,
		selectedCarrierId,
		selectedAssetId,
		assets,
		loadId,
		handleEdit,
		setLoadId,
	};
};

export default usePayments;
