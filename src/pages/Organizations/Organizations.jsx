import React, { useState } from "react";
import styles from "./Organizations.module.scss";
import { EditNoteTwoTone, Search } from "@mui/icons-material";
import {
	Box,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
} from "@mui/material";
import CrmTable from "../../components/CrmTable";
import { COLORS } from "../../shared/colors";
import MUIModal from "../../components/MUIModal";
import AddOrganizationModal from "./AddOrganizationModal";
import useAddOrganization from "./hooks";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const Organizations = () => {
	const [customersData, setCustomersData] = useState([
		{
			organizationLogo:
				"https://cdn.vectorstock.com/i/500p/53/84/way-to-sun-logo-organization-vector-375384.jpg",
			organizationName: "Organization - 1",
			organizationMoto: "organization moto",
		},
		{
			organizationLogo:
				"https://images-platform.99static.com//8RR06k1ZK5Qolk9l3MolKM-VQnM=/437x216:1063x842/fit-in/500x500/99designs-contests-attachments/100/100001/attachment_100001517",
			organizationName: "Organization - 2",
			organizationMoto: "organization moto 2",
		},
	]);

	const {
		reset,
		register,
		unregister,
		watch,
		handleSubmit,
		setValue,
		control,
		errors,
		showModal,
		disableSubmit,
		currentData,
		organizationsData,
		onSubmit,
		setCurrentData,
		setShowModal,
		isLoading,
		orgStatus,
		setOrgStatus,
	} = useAddOrganization();

	console.log("organizationsData- ", organizationsData);

	const [assetFiles, setAssetFiles] = useState({
		identityDoc: [],
		insuranceDoc: [],
		drivingLicense: [],
		vanPictures: [],
	});
	const [delFiles, setDelFiles] = useState([]);

	// const handleFileSelected = (files, fileName) => {
	// 	unregister(fileName);
	// 	setAssetFiles((prevLoadFiles) => ({
	// 		...prevLoadFiles,
	// 		[fileName]: files,
	// 	}));
	// };
	const handleFileSelected = (files, fileName) => {
		if (files.length > 1) {
			console.error("Only one file can be uploaded.");
			return;
		}

		unregister(fileName);
		setAssetFiles((prevLoadFiles) => ({
			...prevLoadFiles,
			[fileName]: files[0], // Ensure only the first file is taken
		}));
	};

	const deleteFileHandler = (fileName, file) => {
		if (file !== false)
			setDelFiles((prevDelFiles) => [...prevDelFiles, { fileName: fileName, key: file.key }]);
		setAssetFiles((prevLoadFiles) => ({
			...prevLoadFiles,
			[fileName]: null,
		}));
	};

	const handleEdit = (data) => {
		console.log("Edit Clicked");
		reset();
		setCurrentData(data);
		setShowModal(true);
	};

	const [customerColumn] = useState([
		{
			id: "organizationLogo",
			label: "Organization Logo",
			canBeSorted: true,
			render: (organization) => {
				return (
					<div style={{ color: COLORS.ZERO_CRAYOLA }}>
						{/* <img src={organization.organizationLogo} alt="Organization logo" style={{ height: "45px" }} /> */}
						<ImageOutlinedIcon />
					</div>
				);
			},
		},
		{
			id: "organizationName",
			label: "Organization Name",
			canBeSorted: true,
			render: (organization) => {
				return <div style={{ color: COLORS.ZERO_CRAYOLA }}>{organization.companyName}</div>;
			},
		},
		{
			id: "organizationContact",
			label: "Contact",
			canBeSorted: true,
			render: (organization) => {
				return (
					<div>
						<p>{organization?.name}</p>
						<p>{organization?.phone}</p>
					</div>
				);
			},
		},
		{
			id: "organizationAddress",
			label: "Address",
			canBeSorted: true,
			render: (organization) => {
				return (
					<div>
						<p>{organization?.address1}</p>
					</div>
				);
			},
		},
		{
			id: "organizationAddress",
			label: "DOT & MC",
			canBeSorted: true,
			render: (organization) => {
				return (
					<div>
						<p>{organization?.dot}</p>
						<p>{organization?.mcNumber}</p>
					</div>
				);
			},
		},
		{
			id: "createdDate",
			label: "Registered Date",
			canBeSorted: true,
			render: (organization) => {
				return <div>{organization?.createdAt}</div>;
			},
		},
		{
			id: "organizationStatus",
			label: "Status",
			canBeSorted: true,
			render: (organization) => {
				return <div>{organization?.active === true ? "Active" : "Not Active"}</div>;
			},
		},
		{
			id: "action",
			label: "Action",
			render: (organization) => {
				return (
					<div className={styles.actionRow}>
						<div>
							<IconButton
								onClick={() => handleEdit(organization)}
								aria-label="edit"
								style={{ color: COLORS.CRAYOLA }}
							>
								<EditNoteTwoTone />
							</IconButton>
						</div>
					</div>
				);
			},
		},
	]);

	return (
		<>
			<div className={styles.orderArea}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						mb: "1rem",
						justifyContent: "flex-end",
					}}
				>
					<Box
						sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem" }}
					>
						<FormControl variant="outlined" size="small">
							<InputLabel htmlFor="outlined-adornment-password">Search Organization</InputLabel>
							<OutlinedInput
								sx={{ height: "45px" }}
								size="small"
								id="outlined-adornment-password"
								type="search"
								endAdornment={
									<InputAdornment position="end">
										<Search />
									</InputAdornment>
								}
								label="Search Team"
							/>
						</FormControl>
						<Button
							variant="contained"
							sx={{
								width: "160px",
								height: "45px",
								fontWeight: "600",
								textTransform: "capitalize",
							}}
							color="primary"
							onClick={() => {
								setCurrentData(null);
								reset();
								setShowModal(true);
							}}
							size="small"
						>
							Create Organization
						</Button>
					</Box>
				</Box>
				<CrmTable
					columns={customerColumn}
					data={organizationsData ? organizationsData : []}
					loading={isLoading}
				/>
				<form onSubmit={handleSubmit(onSubmit)}>
					<MUIModal
						showModal={showModal}
						setShowModal={setShowModal}
						modalTitle={`${currentData ? "Update" : "Add"} Organization`}
						closeBtn="Cancel"
						secondaryBtnText={currentData ? "Update" : "Submit"}
						secondaryBtnDisabled={disableSubmit}
						handleClickSecondaryBtn={handleSubmit(onSubmit)}
						isSubmit={true}
						modalClassName="wd-65"
						modalBodyComponent={
							<AddOrganizationModal
								setValue={setValue}
								currentData={currentData}
								register={register}
								errors={errors}
								watch={watch}
								control={control}
								setOrgStatus={setOrgStatus}
								// handleFileSelected={handleFileSelected}
								// deleteFileHandler={deleteFileHandler}
							/>
						}
					/>
				</form>
			</div>
		</>
	);
};

export default Organizations;
