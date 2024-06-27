import React, { useEffect, useRef, useState } from "react";
import { useGetMeQuery } from "../../../services/user";
import { useGetAssetsQuery } from "../../../services/assets";
import { useGetCustomersQuery } from "../../../services/customer";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useForm } from "react-hook-form";
import {
	useAddOrderMutation,
	useDeleteFilesMutation,
	useGetLoadIdMaxQuery,
	useLazyGetQuotesQuery,
	useUpdateOrderMutation,
} from "../../../services/load";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config";
import ROUTES from "../../../routes";
import { useDispatch } from "react-redux";
import { setCurrentCustomerDt, setLoadsActiveFilter } from "../../../store/slice/globalSlice";

dayjs.extend(advancedFormat);

const useAddLoad = ({ latestCustomer, setLatestCustomer }) => {
	const {
		reset,
		register,
		setValue,
		handleSubmit,
		unregister,
		control,
		formState: { errors },
	} = useForm();

	const location = useLocation();
	const navigate = useNavigate();

	const [currentData, setCurrentData] = useState(null);
	const [disable, setDisable] = useState(false);

	const [isRender, setIsRender] = useState(false);
	const [isUpdated, setIsUpdated] = useState(false);

	const { data: currentUser } = useGetMeQuery();
	const { data: assetsData, refetch: assetRefetch } = useGetAssetsQuery();

	const fetchCurrentData = async (id) => {
		try {
			const accessToken = localStorage.getItem(config.accessTokenName);
			const headers = {
				Authorization: `Bearer ${accessToken}`,
			};
			const response = await axios.get(`${config.apiBaseUrl}/load/${id}`, { headers });
			setCurrentData(response.data.load);
			if (response.data.load.chainEmails) {
				setValue("chainEmails", response.data.load.chainEmails);
			} else {
				setValue("chainEmails", [currentUser.user.email]);
			}
			setIsRender(true);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const dispatch = useDispatch();

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const id = searchParams.get("id");

		if (id) {
			setIsUpdated(true);
			fetchCurrentData(id);
		} else {
			setIsUpdated(false);
			setIsRender(true);
			setValue("chainEmails", [currentUser.user.email]);
		}
	}, [location]);

	const [addOrder, { isLoading: isLoadingPost }] = useAddOrderMutation();

	const [updateOrder, { isLoading: isLoadingUpdate }] = useUpdateOrderMutation();
	const [deleteFiles] = useDeleteFilesMutation();

	const [delFiles, setDelFiles] = useState([]);

	const [disableCus, setDisableCus] = useState(false);

	const [loadFiles, setLoadFiles] = useState({
		rateCONFiles: [],
		BOLFiles: [],
		PODFiles: [],
	});

	const [triggerLoads, { data: loadsData, isLoading }] = useLazyGetQuotesQuery();

	const fileUpload = async (id, formData) => {
		try {
			const accessToken = localStorage.getItem(config.accessTokenName);
			const headers = {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "multipart/form-data",
			};

			await axios.put(`${config.apiBaseUrl}/load/upload/${id}`, formData, { headers });

			dispatch(setLoadsActiveFilter("active"));
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
	};

	const onSubmit = async (data) => {
		setDisable(true);
		let isError = false;

		try {
			data.createdBy = {
				id: currentUser.user._id,
				name: currentUser.user.name,
				email: currentUser.user.email,
			};

			data.isDriver = true;

			const formData = new FormData();
			Object.entries(loadFiles).forEach(([fieldName, files]) => {
				if (files && files.length) {
					files.forEach((file) => {
						formData.append(fieldName, file);
					});
				}
			});

			let uploadPromise;

			let res;
			if (currentData) {
				delFiles.forEach((file) => {
					const filteredFiles = currentData[file.fileName].filter((item) => {
						return !delFiles.some((delFile) => delFile.key === item.key);
					});
					data[file.fileName] = filteredFiles;
				});
				res = await updateOrder({ id: currentData._id, payload: data });
			} else {
				res = await addOrder(data);
			}

			// Proceed only if no error occurred
			if (res && !res.error) {
				if (!formData.keys().next().done) {
					uploadPromise = fileUpload(res.data.load._id, formData);
				}
			} else {
				isError = true;
				// Handle error from updateOrder or addOrder
				toast(res?.error?.data?.error, { type: "error" });
				throw new Error(res?.error?.data?.error);
			}

			// Wait for the fileUpload promise to resolve before moving on
			if (uploadPromise) {
				await uploadPromise;
			}
		} catch (error) {
			isError = true;
			toast(error?.payload?.data?.error);
			// Handle error...
		} finally {
			if (!isError) {
				refetch();
				if (delFiles.length) deleteFiles({ paths: delFiles.map((file) => file.key) });
				toast(currentData ? "Load updated successfully!" : "Load added successfully!");
				reset();
				assetRefetch();
				setDelFiles([]);

				// Move navigation to finally block to ensure it happens after fileUpload
				navigate(ROUTES.PATHS.LOADS);
			}
			setDisable(false);
			isError = false;
		}
	};

	const { data: customersData, refetch } = useGetCustomersQuery();

	const [selectedTruck, setSelectedTruck] = useState("");

	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [rpList, setRpList] = useState([]);
	const [currentRp, setCurrentRp] = useState(null);

	const inputRefCus = useRef(null);

	const handleFileSelected = (files, fileName) => {
		unregister(fileName);
		setLoadFiles((prevLoadFiles) => ({
			...prevLoadFiles,
			[fileName]: files,
		}));
	};

	const deleteFileHandler = (fileName, file) => {
		if (file !== false)
			setDelFiles((prevDelFiles) => [...prevDelFiles, { fileName: fileName, key: file.key }]);
		setLoadFiles((prevLoadFiles) => ({
			...prevLoadFiles,
			[fileName]: null,
		}));
	};

	const handleAutocompleteChangeCustomer = (e, value) => {
		if (value) {
			const formDt = {
				id: value._id,
				name: `${value.customerName ? value.customerName + " -" : ""} ${value.customerEmail}`,
				number: value.customerNumber,
				type: value.customerType,
			};
			setRpList(value.representatives);
			setValue("customer", formDt, { shouldValidate: true });
			setSelectedCustomer(value);
			setLatestCustomer(null);
			setCurrentRp(null);
			if (inputRefCus.current) {
				inputRefCus.current.blur();
			}
		}
	};

	useEffect(() => {
		if (setValue && currentData) {
			setValue("customer", currentData.customer, { shouldValidate: true });
			setValue("representativesCustomer", currentData.representativesCustomer, {
				shouldValidate: true,
			});
			setValue("isDriver", true);
			setValue("pickUpLocation", currentData.pickUpLocation, { shouldValidate: true });
			setValue("status", currentData.status, { shouldValidate: true });
			setValue("destination", currentData.destination, { shouldValidate: true });
			setValue("truckNumber", currentData.truckNumber, { shouldValidate: true });
		}
	}, [currentData]);

	useEffect(() => {
		if (customersData && currentData && !latestCustomer) {
			const cus = customersData.customers.find((v) => currentData.customer.id == v._id);
			const rp = cus?.representatives.length
				? cus.representatives.find((r) => currentData.representativesCustomer == r.phone)
				: null;
			setRpList(cus?.representatives);
			setCurrentRp(rp);
			setSelectedCustomer(cus);
		}
	}, [currentData, customersData]);

	useEffect(() => {
		if (latestCustomer) {
			refetch();
			const formDt = {
				id: latestCustomer._id,
				name: `${latestCustomer.customerName ? latestCustomer.customerName + " -" : ""} ${
					latestCustomer.customerEmail
				}`,
				number: latestCustomer.customerNumber,
			};
			setValue("customer", formDt, { shouldValidate: true });
			setRpList(latestCustomer.representatives);
			if (latestCustomer.representatives.length > 0) {
				const lastItemIndex = latestCustomer.representatives.length - 1;
				setCurrentRp(latestCustomer.representatives[lastItemIndex]);
				setValue("representativesCustomer", latestCustomer.representatives[lastItemIndex].phone, {
					shouldValidate: true,
				});
			} else {
				setCurrentRp(null);
			}
			setSelectedCustomer(latestCustomer);
		}
	}, [latestCustomer]);

	useEffect(() => {
		if (assetsData && currentData) {
			const asset = assetsData.assets.find((asset) => asset.assetId === currentData?.truckNumber);
			setSelectedTruck(asset);
		}
	}, [assetsData, currentData]);

	const { data: maxLoadId, refetch: refetchMaxLoad } = useGetLoadIdMaxQuery();

	useEffect(() => {
		refetchMaxLoad();
		const q = "?page=1&orderBy=loadId&order=desc&rowsPerPage=3&activeStatus=all";
		triggerLoads(q);
	}, []);

	const [dynamicLoadsId, setDynamicLoadsId] = useState("");

	useEffect(() => {
		if (maxLoadId && currentData) {
			const dyload = currentData.loadId;
			setDynamicLoadsId(dyload);
			setValue("loadId", dyload);
		} else if (maxLoadId) {
			setDynamicLoadsId(maxLoadId.maxLoadId);
			setValue("loadId", maxLoadId.maxLoadId);
		}
	}, [maxLoadId, currentData]);

	useEffect(() => {
		if (selectedCustomer) {
			dispatch(setCurrentCustomerDt(latestCustomer));
		}
	}, [selectedCustomer]);

	return {
		selectedCustomer,
		customersData,
		currentRp,
		rpList,
		setCurrentRp,
		assetsData,
		inputRefCus,
		handleAutocompleteChangeCustomer,
		selectedTruck,
		setSelectedTruck,
		register,
		errors,
		setValue,
		currentData,
		isRender,
		onSubmit,
		handleSubmit,
		isUpdated,
		handleFileSelected,
		deleteFileHandler,
		disable,
		dynamicLoadsId,
		control,
		disableCus,
		setDisableCus,
		isLoading,
	};
};

export default useAddLoad;
