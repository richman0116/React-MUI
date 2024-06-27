import React from "react";
import styles from "./Organizations.module.scss";
import {
	FormControl,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";


const AddOrganizationModal = ({
	errors,
	currentData = null,
	control,
	disable = false,
	setOrgStatus,
}) => {

	const handleChangeOrgStatus = (event) => {
		setOrgStatus(event.target.value);
	};


	return (
		<div className={styles.addOrganizationArea}>
			<div>
				{/* <div className={styles.displayColumn}> */}
				<div
					style={{ width: "300px", margin: "0 auto", marginBottom: "30px", textAlign: "center" }}
				>
					{/* <Typography
						variant="h6"
						component="div"
						style={{ marginBottom: "16px", color: "#4b4b4b", textAlign: "left" }}
					>
						Logo
					</Typography>
					<div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
						{organizationImage ? (
							<img
								src={URL.createObjectURL(organizationImage)}
								alt=""
								style={{ width: 80, height: 80, marginRight: "8px" }}
							/>
						) : (
							<Avatar sx={{ width: 80, height: 80, marginRight: "8px" }} />
						)}
					</div>
					<FormControl>
						<Controller
							name="organizationLogo"
							control={control}
							defaultValue={currentData ? currentData.organizationLogo : ""}
							// rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									// required
									size="small"
									type="file"
									error={!!errors.organizationLogo}
									disabled={disable}
									accept="image/*"
									onChange={handleImageChange}
								/>
							)}
						/>
					</FormControl> */}
					{/* <MultiFileUploader
            label="Logo"
            height="120px"
            img={{ width: "50px", height: "54px" }}
            onFilesSelected={handleFileSelected}
            deleteFileHandler={deleteFileHandler}
            fileKey={currentData && currentData.organizationLogo ? currentData.organizationLogo : false}
            initialFiles={currentData && currentData.organizationLogo ? currentData.organizationLogo : ""}
            name="organizationLogo"
          /> */}
					{/* <p>Upload Logo</p> */}
				</div>
				{/* <div className={styles.displayColumn}> */}
				<div className={styles.twoColumnGrid}>
					<FormControl style={{ margin: "16px 0px" }}>
						<Controller
							name="name"
							control={control}
							defaultValue={currentData ? currentData.name : ""}
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Full Name"
									size="small"
									type="text"
									error={!!errors.name}
									disabled={disable}
								/>
							)}
						/>
					</FormControl>
					<FormControl style={{ margin: "16px 0px" }}>
						<Controller
							name="companyName"
							control={control}
							defaultValue={currentData ? currentData.companyName : ""}
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Company Name"
									size="small"
									type="text"
									error={!!errors.companyName}
									disabled={disable}
								/>
							)}
						/>
					</FormControl>

					<FormControl>
						<Controller
							name="email"
							control={control}
							defaultValue={currentData ? currentData.email : ""}
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Email"
									size="small"
									type="text"
									error={!!errors.email}
									disabled={disable}
								/>
							)}
						/>
					</FormControl>
					<FormControl>
						<Controller
							name="phone"
							control={control}
							defaultValue={currentData ? currentData.phone : ""}
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Phone"
									size="small"
									type="text"
									error={!!errors.phone}
									disabled={disable}
								/>
							)}
						/>
					</FormControl>

					<FormControl style={{ margin: "16px 0px" }}>
						<Controller
							name="address1"
							control={control}
							defaultValue={currentData ? currentData.address1 : ""}
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="Address Line 1"
									size="small"
									type="text"
									error={!!errors.address1}
									disabled={disable}
								/>
							)}
						/>
					</FormControl>
					<FormControl style={{ margin: "16px 0px" }}>
						<Controller
							name="mcNumber"
							control={control}
							defaultValue={currentData ? currentData.mcNumber : ""}
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									required
									label="MC#"
									size="small"
									type="text"
									error={!!errors.mcNumber}
									disabled={disable}
								/>
							)}
						/>
					</FormControl>

					<FormControl>
						<Controller
							name="dot"
							control={control}
							defaultValue={currentData ? currentData.dot : ""}
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									label="DOT"
									size="small"
									type="text"
									error={!!errors.dot}
									disabled={disable}
								/>
							)}
						/>
					</FormControl>
					<FormControl>
						<Controller
							name="taxId"
							control={control}
							defaultValue={currentData ? currentData.taxId : ""}
							// rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									label="Tax ID"
									size="small"
									type="text"
									error={!!errors.taxId}
									disabled={disable}
								/>
							)}
						/>
					</FormControl>
					{currentData && (
						<FormControl style={{ margin: "16px 0px" }}>
							{/* <Controller */}
							{/* name="active" */}
							{/* control={control} */}
							{/* defaultValue={currentData ? currentData.active : true} */}
							{/* render={({ field }) => ( */}
							{/* <TextField
                  //   {...field}
                  //   label="Status"
                  //   size="small"
                  //   type="text"
                  //   error={!!errors.active}
                  //   disabled={disable}
                  // /> */}
							<Select
								// {...field}
								labelId="demo-simple-select-helper-label"
								id="demo-simple-select-helper"
								label="Status"
								size="small"
								defaultValue={currentData ? currentData.active : true}
								name="active"
								onChange={handleChangeOrgStatus}
								error={!!errors.active}
								disabled={disable}
							>
								<MenuItem value={true}>Active</MenuItem>
								<MenuItem value={false}>Not Active</MenuItem>
							</Select>
							{/* )} */}
							{/* /> */}
						</FormControl>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddOrganizationModal;
