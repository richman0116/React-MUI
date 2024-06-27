import React from "react";
import styles from "./AddLoads.module.scss";
import {
	Autocomplete,
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	IconButton,
	InputAdornment,
	Radio,
	RadioGroup,
	TextField,
	Typography,
	styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LoadStatus } from "../../shared/constants";
import useAddCustomer from "../Customers/hooks";
import AddCustomerModal from "../Customers/AddCustomerModal";
import MUIModal from "../../components/MUIModal";
import BackBtn from "../../components/BackBtn/BackBtn";
import PickUpInformation from "../../components/UI/PickUpInformation";
import DeliveryInformation from "../../components/UI/MakePayment/DeliveryInformation";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import useAddLoad from "./hooks/hooks";
import { Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCustomerDt } from "../../store/slice/globalSlice";
import MultiFileUploader from "../../components/MultFileUploader/MultiFileUploader";

const SquareIconButton = styled(IconButton)(({ theme }) => ({
	backgroundColor: "#000000",
	opacity: "0.8",
	color: "#fff",
	height: "40px",
	borderRadius: "4px",
	marginLeft: "2px",
	"&:hover": {
		backgroundColor: "#000000",
	},
}));

const Wrapper = styled("div")({
	display: "flex",
	alignItems: "strech",
	width: "100%",
});

const InputWrapper = styled("div")({
	flex: 1,
	paddingLeft: "2px",
});

const AddLoad = () => {
	const {
		register: registerAddCustomer,
		watch: watchAddCustomer,
		handleSubmit: handleSubmitCustomer,
		setValue: setValueAddCustomer,
		control: controlAddCustomer,
		errors: errorsAddCustomer,
		reset: resetCustomerForm,
		showModal,
		disableSubmit,
		onSubmit: onSubmitCustomer,
		setShowModal,
		latestCustomer,
		setLatestCustomer,
		setDisableSubmit,
	} = useAddCustomer();

	const {
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
	} = useAddLoad({
		latestCustomer,
		setLatestCustomer,
	});

	const dispatch = useDispatch();
	const currentCustomerDt = useSelector((state) => state.global.currentCustomerDt);

	if (!isRender || (isUpdated && !currentData) || isLoading) {
		return <CircularProgress />;
	}

	const pickValidate = (val) => {
		if (val && val.length) {
			return true;
		}
		return "pick up location is mandatory!";
	};

	const delValidate = (val) => {
		if (val && val.length) {
			return true;
		}
		return "delivery location is mandatory!";
	};

	return (
		<div className={styles.addOrder}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<div>
					<BackBtn />
				</div>
				<div>
					<FormControl style={{ width: "400px" }}>
						<Controller
							name="loadId"
							control={control}
							defaultValue={currentData ? currentData.loadId : dynamicLoadsId}
							render={({ field }) => (
								<>
									<TextField
										{...field}
										label="Load Id"
										type="number"
										size="small"
										style={{ borderBottom: "none" }}
										inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
										onBlur={(e) => {
											const numericValue = e.target.value.replace(/[^0-9]/g, "");
											setValue("loadId", numericValue);
										}}
									/>
								</>
							)}
						/>
					</FormControl>
					<p style={{ fontSize: "10px", opacity: 0.6 }}>
						Load Id will be generated automatically or you can add manually.
					</p>
				</div>
			</div>

			<FormControl fullWidth>
				<div className={styles.addOrderColumn}>
					<Card className={styles.customerInfo}>
						<CardContent>
							<Typography variant="h2" component={"h2"} fontSize={"1.5rem"}>
								Customer Information
							</Typography>
							<Box sx={{ display: "flex", gap: 1 }}>
								<FormControl fullWidth sx={{ m: "1rem 0 1rem 0" }}>
									<Wrapper>
										<InputWrapper>
											<Autocomplete
												disablePortal
												{...register("customer", {
													required: {
														value: true,
														message: "Please select a customer name.",
													},
												})}
												name="customer"
												size="small"
												value={latestCustomer || selectedCustomer || null}
												isInvalid={errors.customer ? true : false}
												autoComplete="off"
												ref={inputRefCus}
												isOptionEqualToValue={(option, value) => {
													return option.customerNumber === value.customerNumber;
												}}
												getOptionLabel={(option) =>
													option.customerName
														? `${option.customerName}${
																option.customerNumber.length
																	? " (" + option.customerNumber + ")"
																	: ""
														  }`
														: ""
												}
												options={
													customersData && customersData.customers ? customersData.customers : []
												}
												renderInput={(params) => (
													<TextField
														error={!!errors.customer}
														helperText={errors.customer?.message}
														autoComplete="off"
														required
														{...params}
														label="Customer Name"
														InputProps={{
															...params.InputProps,
															autoComplete: "off",
														}}
													/>
												)}
												onChange={handleAutocompleteChangeCustomer}
											/>
										</InputWrapper>

										<SquareIconButton
											onClick={() => {
												dispatch(setCurrentCustomerDt(null));
												setDisableCus(false);
												setShowModal(true);
											}}
											size="small"
										>
											<AddIcon />
										</SquareIconButton>
									</Wrapper>
								</FormControl>
								<Grid container>
									<Grid item xs={10}>
										<FormControl fullWidth sx={{ m: "1rem 0" }}>
											<Autocomplete
												{...register("representativesCustomer", {
													required: {
														value: true,
														message: "Please select a representative.",
													},
												})}
												name="representativesCustomer"
												id="free-solo-demo"
												size="small"
												value={currentRp}
												isOptionEqualToValue={(option, value) => {
													return option && value && option.phone === value.phone;
												}}
												getOptionLabel={(option) => `${option.name}(${option.phone})`}
												options={rpList}
												renderInput={(params) => (
													<TextField
														{...params}
														error={!!errors.representativesCustomer}
														helperText={errors.representativesCustomer?.message}
														label="Representative"
														required
													/>
												)}
												onChange={(e, value) => {
													if (value) {
														setValue("representativesCustomer", value.phone, {
															shouldValidate: true,
														});
														setCurrentRp(value);
													} else {
														setValue("representativesCustomer", null, { shouldValidate: true });
													}
												}}
											/>
										</FormControl>
									</Grid>
									<Grid item xs={2}>
										<SquareIconButton
											disabled={!selectedCustomer}
											style={{ marginTop: "15px" }}
											onClick={() => {
												dispatch(setCurrentCustomerDt(selectedCustomer));
												setDisableCus(true);
												setShowModal(true);
												resetCustomerForm();
											}}
											size="small"
										>
											<AddIcon />
										</SquareIconButton>
									</Grid>
								</Grid>
							</Box>
							<Grid container spacing={1}>
								<Grid item xs={6}>
									<FormControl fullWidth sx={{ m: "1rem 0" }}>
										<TextField
											size="small"
											type="text"
											required
											label="Reference Number"
											{...register("referenceNumber", {
												required: {
													value: true,
													message: "Please add an option Reference Number",
												},
											})}
											name="referenceNumber"
											defaultValue={currentData ? currentData.referenceNumber : ""}
											error={!!errors.referenceNumber}
											helperText={errors.referenceNumber?.message}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={6}>
									<FormControl fullWidth sx={{ m: "1rem 0" }}>
										<TextField
											type="number"
											required
											label="Customer Rate"
											{...register("customerRate", {
												required: {
													value: true,
													message: "Please add customer rate",
												},
											})}
											error={!!errors.customerRate}
											helperText={errors.customerRate?.message}
											name="customerRate"
											size="small"
											defaultValue={currentData ? currentData.customerRate : ""}
											id="outlined-adornment-amount"
											startAdornment={<InputAdornment position="start">$</InputAdornment>}
											style={{ borderBottom: "none" }}
										/>
									</FormControl>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					<Card className={styles.carrierInfo}>
						<CardContent>
							<div className={styles.carrierTitleSec}>
								<Typography variant="h2" component={"h2"} fontSize={"1.5rem"}>
									Driver Information
								</Typography>
							</div>

							<FormControl fullWidth sx={{ m: "1rem 0 1rem 0" }}>
								<div>
									<Autocomplete
										{...register("truckNumber", {
											required: {
												value: true,
												message: "Please select an option Truck Number",
											},
										})}
										name="truckNumber"
										required
										id="asynchronous-demo-des"
										onChange={(event, newValue) => {
											setValue("truckNumber", newValue.assetId, { shouldValidate: true });
											setSelectedTruck(newValue);
										}}
										value={selectedTruck ? selectedTruck : null}
										isOptionEqualToValue={(option, value) => {
											return option.assetId == value;
										}}
										getOptionLabel={(option) =>
											`${option.assetId} ${
												option.assignedDrivers ? "-" + option.assignedDrivers : ""
											}`
										}
										options={assetsData && assetsData.assets ? assetsData.assets : []}
										size="small"
										renderInput={(params) => (
											<TextField
												{...params}
												required
												label="Truck Number"
												error={!!errors.truckNumber}
												helperText={errors.truckNumber?.message}
											/>
										)}
									/>
								</div>
							</FormControl>

							<FormControl fullWidth sx={{ m: "1rem 0 1rem 0" }}>
								<FormControl fullWidth>
									<TextField
										type="number"
										required
										label="Carriers / Driver Rate"
										{...register("driverRate", {
											required: {
												value: true,
												message: "Please add driver rate",
											},
										})}
										name="driverRate"
										defaultValue={currentData ? currentData.driverRate : ""}
										isInvalid={errors.driverRate ? true : false}
										size="small"
										id="outlined-adornment-amount"
										startAdornment={<InputAdornment position="start">$</InputAdornment>}
										style={{ borderBottom: "none" }}
										error={!!errors.driverRate}
										helperText={errors.driverRate?.message}
									/>
								</FormControl>
							</FormControl>
						</CardContent>
					</Card>

					<PickUpInformation
						{...register("pickUpList", {
							validate: pickValidate,
						})}
						currentData={currentData}
						setValueGlobal={setValue}
						errorGlobal={errors}
					/>

					<DeliveryInformation
						{...register("destinationList", {
							validate: delValidate,
						})}
						currentData={currentData}
						setValueGlobal={setValue}
						errorGlobal={errors}
					/>
				</div>

				<Card className={`${styles.attachmentNotes}`}>
					<CardContent>
						<Typography variant="h2" component={"h2"} fontSize={"1.5"}>
							Attachment and Others
						</Typography>

						<div style={{ gap: 15 }} className={styles.threeColumn}>
							<FormControl fullWidth sx={{ m: "1rem 0 1rem 0" }}>
								<Autocomplete
									{...register("status", {
										required: {
											value: true,
											message: "Please select load status",
										},
									})}
									name="status"
									required
									id="asynchronous-demo-des"
									onChange={(event, newValue) => {
										setValue("status", newValue, { shouldValidate: true });
									}}
									defaultValue={currentData ? currentData.status : ""}
									isOptionEqualToValue={(option, value) => option === value}
									getOptionLabel={(option) => option}
									options={LoadStatus}
									size="small"
									renderInput={(params) => (
										<TextField
											{...params}
											required
											label="Load Status"
											error={!!errors.status}
											helperText={errors.status?.message}
										/>
									)}
								/>
							</FormControl>
							<FormControl sx={{ mb: 2 }}>
								<FormLabel id="demo-row-radio-buttons-group-label">Load Type</FormLabel>
								<RadioGroup
									{...register("loadType")}
									row
									aria-labelledby="demo-row-radio-buttons-group-label"
									name="loadType"
									defaultValue={currentData && currentData.loadType === "LTL" ? "LTL" : "full-load"}
								>
									<FormControlLabel value="full-load" control={<Radio />} label="Full Load" />
									<FormControlLabel value="LTL" control={<Radio />} label="LTL" />
								</RadioGroup>
							</FormControl>
						</div>

						<div>
							<h4 style={{ padding: 0, marginBottom: "5px" }}>Attachments</h4>
						</div>
						<div className={styles.threeColumn}>
							<MultiFileUploader
								height="120px"
								img={{ width: "50px", height: "54px" }}
								label="CON"
								onFilesSelected={handleFileSelected}
								deleteFileHandler={deleteFileHandler}
								fileKey={currentData && currentData.rateCONFiles ? currentData.rateCONFiles : false}
								initialFiles={
									currentData && currentData.rateCONFiles
										? Array.isArray(currentData.rateCONFiles)
											? currentData.rateCONFiles
											: [currentData.rateCONFiles]
										: []
								}
								name="rateCONFiles"
							/>
							<MultiFileUploader
								height="120px"
								img={{ width: "50px", height: "54px" }}
								label="BOL"
								onFilesSelected={handleFileSelected}
								deleteFileHandler={deleteFileHandler}
								initialFile={currentData && currentData.BOLFiles ? currentData.BOLFiles : ""}
								initialFiles={
									currentData && currentData.BOLFiles
										? Array.isArray(currentData.BOLFiles)
											? currentData.BOLFiles
											: [currentData.BOLFiles]
										: []
								}
								name="BOLFiles"
							/>
							<MultiFileUploader
								height="120px"
								img={{ width: "50px", height: "54px" }}
								label="POD"
								onFilesSelected={handleFileSelected}
								deleteFileHandler={deleteFileHandler}
								fileKey={currentData && currentData.PODFiles ? currentData.PODFiles : false}
								initialFiles={
									currentData && currentData.PODFiles
										? Array.isArray(currentData.PODFiles)
											? currentData.PODFiles
											: [currentData.PODFiles]
										: []
								}
								name="PODFiles"
							/>
						</div>

						<div className={styles.oneColumn}>
							<FormControl fullWidth>
								<TextField
									type="textarea"
									label="Public Notes"
									{...register("notesPrivate")}
									error={!!errors.notesPrivate}
									helperText={errors.notesPrivate?.message}
									rows={5}
									multiline
									defaultValue={currentData ? currentData.notesPrivate : ""}
									placeholder="Enter your public notes here..."
								/>
							</FormControl>
						</div>
						<div className={styles.oneColumn}>
							<FormControl fullWidth>
								<Controller
									name="chainEmails"
									control={control}
									render={({ field }) => (
										<Autocomplete
											{...field}
											multiple
											freeSolo
											options={[]}
											renderTags={(value, getTagProps) =>
												value.map((option, index) => (
													<Chip
														key={index}
														variant="outlined"
														label={option}
														{...getTagProps({ index })}
													/>
												))
											}
											renderInput={(params) => (
												<TextField
													{...params}
													variant="outlined"
													label="Chain Emails"
													placeholder="Add emails..."
													error={!!errors.chainEmails}
													helperText={
														errors.chainEmails?.message ||
														"Type and press enter to add multiple emails as needed"
													}
												/>
											)}
											onChange={(_, data) => field.onChange(data)}
										/>
									)}
								/>
							</FormControl>
						</div>
					</CardContent>
				</Card>

				<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "30px" }}>
					<LoadingButton
						variant="contained"
						onClick={handleSubmit(onSubmit)}
						disabled={disable}
						loading={disable}
						endIcon={<SendIcon />}
						loadingPosition="end"
					>
						<span>{isUpdated ? "Update Load" : "Add Load"}</span>
					</LoadingButton>
				</div>
			</FormControl>

			<FormControl onSubmit={handleSubmitCustomer(onSubmitCustomer)}>
				<MUIModal
					showModal={showModal}
					setShowModal={setShowModal}
					modalTitle={currentCustomerDt ? "Update Customer Representative" : "Add Customer"}
					closeBtn="Cancel"
					secondaryBtnText={currentCustomerDt ? "Update" : "Submit"}
					secondaryBtnDisabled={disableSubmit}
					handleClickSecondaryBtn={handleSubmitCustomer(onSubmitCustomer)}
					isSubmit={true}
					modalClassName="wd-80"
					modalBodyComponent={
						<AddCustomerModal
							setValue={setValueAddCustomer}
							currentData={currentCustomerDt}
							register={registerAddCustomer}
							setDisableSubmit={setDisableSubmit}
							errors={errorsAddCustomer}
							watch={watchAddCustomer}
							control={controlAddCustomer}
							disable={disableCus}
						/>
					}
				/>
			</FormControl>
		</div>
	);
};

export default AddLoad;
