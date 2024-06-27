// // import { Form, InputGroup } from "@themesberg/react-bootstrap";
// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import styles from "./Loads.module.scss";
// import moment from "moment-timezone";
// import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
// import {
// 	Autocomplete,
// 	Card,
// 	CardContent,
// 	FormControl,
// 	FormControlLabel,
// 	FormLabel,
// 	IconButton,
// 	InputAdornment,
// 	OutlinedInput,
// 	Radio,
// 	RadioGroup,
// 	Stack,
// 	Switch,
// 	TextField,
// 	Typography,
// 	styled,
// } from "@mui/material";
// import PlacesAutocomplete from "../../components/PlacesAutocomplete";
// import AddIcon from "@mui/icons-material/Add";
// import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { TruckTypes } from "../../shared/constants";
// // import useAddCustomer from "../Customers/hooks";
// // import AddCustomerModal from "../Customers/AddCustomerModal";
// import MUIModal from "../../components/MUIModal";
// import useAddLoadsModal  from "./hooks/hooks";
// // import useAddCarrier from "../Carriers/hooks";
// // import AddCarrierModal from "../Carriers/AddCarrierModal";

// const SquareIconButton = styled(IconButton)(({ theme }) => ({
// 	backgroundColor: "#4caf50",
// 	color: "#fff",
// 	height: "40px",
// 	borderRadius: "4px",
// 	marginLeft: "2px",
// 	"&:hover": {
// 		backgroundColor: "#4caf50",
// 	},
// }));

// const Wrapper = styled("div")({
// 	display: "flex",
// 	alignItems: "center",
// 	width: "100%",
// });

// const InputWrapper = styled("div")({
// 	flex: 1,
// 	paddingLeft: "2px",
// });
// const AddLoadModal = ({ register, errors, currentData = null, setValue, watch, control }) => {
// 	const {
// 		register: registerAddCustomer,
// 		watch: watchAddCustomer,
// 		handleSubmit,
// 		setValue: setValueAddCustomer,
// 		control: controlAddCustomer,
// 		errors: errorsAddCustomer,
// 		showModal,
// 		disableSubmit,
// 		onSubmit,
// 		setShowModal,
// 		latestCustomer,
// 		setLatestCustomer,
// 	} = useAddCustomer();

// 	const {
// 		register: registerAddCarrier,
// 		watch: watchAddCarrier,
// 		handleSubmit: handleSubmitCarrier,
// 		setValue: setValueAddCarrier,
// 		control: controlAddCarrier,
// 		errors: errorsAddCarrier,
// 		showModal: showModalCarrier,
// 		disableSubmit: disableSubmitCarrier,
// 		onSubmit: onSubmitCarrier,
// 		setShowModal: setShowModalCarrier,
// 		latestCarrier,
// 		setLatestCarrier,
// 	} = useAddCarrier();

// 	const {
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
// 	} =  useAddLoadsModal({
// 		register,
// 		errors,
// 		currentData,
// 		setValue,
// 		watch,
// 		control,
// 		latestCustomer,
// 		latestCarrier,
// 		setLatestCustomer,
// 		setLatestCarrier,
// 	});

// 	return (
// 		<div className={styles.addOrder}>
// 			<div className={styles.addOrderColumn}>
// 				<Card className={styles.customerInfo}>
// 					<CardContent>
// 						<h2>Customer Information</h2>
// 						<FormControl className="mb-2">
// 							<FormLabel>Customer Name</FormLabel>
// 							<Wrapper>
// 								<InputWrapper>
// 									<Autocomplete
// 										disablePortal
// 										{...register("customer", {
// 											required: true,
// 										})}
// 										name="customer"
// 										size="small"
// 										value={latestCustomer || selectedCustomer || null}
// 										isInvalid={errors.customer ? true : false}
// 										autoComplete="off"
// 										ref={inputRefCus}
// 										isOptionEqualToValue={(option, value) => {
// 											return option.customerNumber === value.customerNumber;
// 										}}
// 										getOptionLabel={(option) =>
// 											option.customerName
// 												? `${option.customerName}${
// 														option.customerNumber.length ? " (" + option.customerNumber + ")" : ""
// 												  }`
// 												: ""
// 										}
// 										options={
// 											customersData && customersData.customers ? customersData.customers : []
// 										}
// 										renderInput={(params) => (
// 											<TextField
// 												autoComplete="off"
// 												placeholder="Customer Name"
// 												{...params}
// 												label=""
// 												InputProps={{
// 													...params.InputProps,
// 													autoComplete: "off",
// 												}}
// 											/>
// 										)}
// 										onChange={handleAutocompleteChangeCustomer}
// 									/>
// 								</InputWrapper>
// 								<SquareIconButton onClick={() => setShowModal(true)} size="small">
// 									<AddIcon />
// 								</SquareIconButton>
// 							</Wrapper>
// 							{/* {errors.customer && (
// 								<Form.Control.Feedback type="invalid">
// 									Please select a customer name.
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>

// 						<FormControl className="mb-2">
// 							<FormLabel>Representative</FormLabel>
// 							<Autocomplete
// 								{...register("representativesCustomer", {
// 									required: true,
// 								})}
// 								name="representativesCustomer"
// 								id="free-solo-demo"
// 								size="small"
// 								value={currentRp}
// 								isInvalid={errors.representativesCustomer ? true : false}
// 								isOptionEqualToValue={(option, value) => {
// 									return option.phone === value.phone;
// 								}}
// 								getOptionLabel={(option) => `${option.name}(${option.phone})`}
// 								options={rpList}
// 								renderInput={(params) => (
// 									<TextField placeholder="Representative Name" {...params} label="" />
// 								)}
// 								onChange={(e, value) => {
// 									if (value) {
// 										setValue("representativesCustomer", value.phone, { shouldValidate: true });
// 										setCurrentRp(value);
// 									} else {
// 										setValue("representativesCustomer", null, { shouldValidate: true });
// 									}
// 								}}
// 							/>
// 							{/* {errors.representativesCustomer && (
// 								<Form.Control.Feedback type="invalid">
// 									Please select a customer representative.
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 						<FormControl className="mb-2">
// 							<FormLabel>Reference Number</FormLabel>

// 							<TextField
// 								type="text"
// 								required
// 								{...register("referenceNumber")}
// 								name="referenceNumber"
// 								defaultValue={currentData ? currentData.referenceNumber : ""}
// 								isInvalid={errors.referenceNumber ? true : false}
// 								error={!!errors.referenceNumber}
// 								helperText={errors.referenceNumber?.message}
// 							/>

// 							{/* {errors.referenceNumber && (
// 								<Form.Control.Feedback type="invalid">
// 									Please add an option Reference Number
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>

// 						<FormControl className="mb-2">
// 							<FormLabel>Customer Rate</FormLabel>
// 							<FormControl fullWidth sx={{ m: 0 }}>
// 								<OutlinedInput
// 									type="number"
// 									required
// 									{...register("customerRate", { required: true })}
// 									name="customerRate"
// 									size="small"
// 									defaultValue={currentData ? currentData.customerRate : ""}
// 									isInvalid={errors.customerRate ? true : false}
// 									id="outlined-adornment-amount"
// 									startAdornment={<InputAdornment position="start">$</InputAdornment>}
// 									style={{ borderBottom: "none" }}
// 								/>
// 							</FormControl>

// 							{/* {errors.customerRate && (
// 								<Form.Control.Feedback type="invalid">
// 									Please add customer rate
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 					</CardContent>
// 				</Card>

// 				<Card className={styles.carrierInfo}>
// 					<CardContent>
// 						<div className={styles.carrierTitleSec}>
// 							<Typography variant="h2">Carrier/Driver Information</Typography>
// 							<FormControl>
// 								<FormControlLabel
// 									control={
// 										<Switch
// 											{...register("isDriver")}
// 											checked={isDriver}
// 											onChange={handleIsDriverChange}
// 											name="isDriver"
// 										/>
// 									}
// 									label="Driver"
// 								/>
// 							</FormControl>
// 						</div>

// 						{!watch("isDriver") ? (
// 							<>
// 								<FormControl className="mb-2">
// 									<FormLabel>Carrier Name</FormLabel>
// 									<Wrapper>
// 										<InputWrapper>
// 											<Autocomplete
// 												{...register("carrier", {
// 													required: true,
// 												})}
// 												name="carrier"
// 												size="small"
// 												value={latestCarrier || selectedCarrier || null}
// 												isInvalid={errors.carrier ? true : false}
// 												isOptionEqualToValue={(option, value) => {
// 													return option.phone === value.phone;
// 												}}
// 												ref={inputRefCar}
// 												getOptionLabel={(option) =>
// 													`${option.name}${option.phone.length ? "(" + option.phone + ")" : ""}`
// 												}
// 												options={carriersData && carriersData.carriers ? carriersData.carriers : []}
// 												renderInput={(params) => (
// 													<TextField placeholder="Carrier Name" {...params} label="" />
// 												)}
// 												onChange={handleAutocompleteChangeCarrier}
// 											/>
// 										</InputWrapper>
// 										<SquareIconButton onClick={() => setShowModalCarrier(true)} size="small">
// 											<AddIcon />
// 										</SquareIconButton>
// 									</Wrapper>
// 									{/* {errors.carrier && (
// 										<Form.Control.Feedback type="invalid">
// 											Please select a carrier.
// 										</Form.Control.Feedback>
// 									)} */}
// 								</FormControl>
// 								<FormControl className="mb-2">
// 									<FormLabel>Representative</FormLabel>
// 									<Autocomplete
// 										{...register("representativesCarrier")}
// 										name="representativesCarrier"
// 										size="small"
// 										value={currentRpCarrier}
// 										isInvalid={errors.representativesCarrier ? true : false}
// 										isOptionEqualToValue={(option, value) => {
// 											return option.phone === value.phone;
// 										}}
// 										getOptionLabel={(option) => `${option.name}(${option.phone})`}
// 										options={rpListCarrier}
// 										renderInput={(params) => (
// 											<TextField placeholder="Representative Name" {...params} label="" />
// 										)}
// 										onChange={(e, value) => {
// 											if (value) {
// 												setValue("representativesCarrier", value.phone, { shouldValidate: true });
// 												setCurrentRpCarrier(value);
// 											} else {
// 												setValue("representativesCarrier", null, { shouldValidate: true });
// 											}
// 										}}
// 									/>
// 									{/* {errors.representativesCarrier && (
// 										<Form.Control.Feedback type="invalid">
// 											Please select a carrier representative.
// 										</Form.Control.Feedback>
// 									)} */}
// 								</FormControl>
// 							</>
// 						) : (
// 							<>
// 								<FormControl className="mb-2">
// 									<FormLabel>Truck Number</FormLabel>
// 									<div>
// 										<Autocomplete
// 											{...register("truckNumber", { required: true })}
// 											name="truckNumber"
// 											required
// 											isInvalid={errors.truckNumber ? true : false}
// 											id="asynchronous-demo-des"
// 											onChange={(event, newValue) => {
// 												setValue("truckNumber", newValue.assetId, { shouldValidate: true });
// 												setSelectedTruck(newValue);
// 											}}
// 											value={selectedTruck}
// 											isOptionEqualToValue={(option, value) => {
// 												return option.assetId == value;
// 											}}
// 											getOptionLabel={(option) =>
// 												`${option.assetId} ${
// 													option.assignedDrivers ? "-" + option.assignedDrivers : ""
// 												}`
// 											}
// 											options={assetsData && assetsData.assets ? assetsData.assets : []}
// 											size="small"
// 											renderInput={(params) => <TextField {...params} placeholder="Truck Number"
// 											error={!!errors.truckNumber}
// 											helperText={errors.truckNumber?.message}
// 											/>

// 										}

// 										/>
// 									</div>
// 									{/* {errors.truckNumber && (
// 										<Form.Control.Feedback type="invalid">
// 											Please select an option Truck Number
// 										</Form.Control.Feedback>
// 									)} */}
// 								</FormControl>
// 							</>
// 						)}

// 						<FormControl className="mb-2">
// 							<FormLabel>Truck Type</FormLabel>

// 							<Autocomplete
// 								{...register("truckType", { required: true })}
// 								name="truckType"
// 								required
// 								isInvalid={errors.truckType ? true : false}
// 								id="asynchronous-demo-des"
// 								onChange={(event, newValue) => {
// 									setValue("truckType", newValue, { shouldValidate: true });
// 								}}
// 								defaultValue={currentData ? currentData.truckType : ""}
// 								isOptionEqualToValue={(option, value) => option === value}
// 								getOptionLabel={(option) => option}
// 								options={TruckTypes}
// 								size="small"
// 								renderInput={(params) => <TextField {...params} placeholder="Truck Type"
// 								error={!!errors.truckType}
// 								helperText={errors.truckType?.message}

// 								/>}
// 							/>

// 							{/* {errors.truckType && (
// 								<Form.Control.Feedback type="invalid">
// 									Please add a truck type
// 								</Form.Control.Feedback>
// 							)} */}

// 						</FormControl>
// 						<FormControl className="mb-2">
// 							<FormLabel>Carriers / Driver Rate</FormLabel>
// 							<FormControl fullWidth sx={{ m: 0 }}>
// 								<OutlinedInput
// 									type="number"
// 									required
// 									{...register("driverRate", { required: true })}
// 									name="driverRate"
// 									defaultValue={currentData ? currentData.driverRate : ""}
// 									isInvalid={errors.driverRate ? true : false}
// 									size="small"
// 									id="outlined-adornment-amount"
// 									startAdornment={<InputAdornment position="start">$</InputAdornment>}
// 									style={{ borderBottom: "none" }}
// 									error={!!errors.driverRate}
// 									helperText={errors.driverRate?.message}
// 								/>
// 							</FormControl>

// 							{/* {errors.driverRate && (
// 								<Form.Control.Feedback type="invalid">Please add driver rate</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 					</CardContent>
// 				</Card>

// 				<Card className={styles.pickUpInformation}>
// 					<CardContent>
// 						<h2>Pick Up Information</h2>
// 						<Stack className="mb-2" spacing={2}>
// 							<FormLabel>Pick Up Location</FormLabel>
// 							<PlacesAutocomplete
// 								currentData={currentData}
// 								handleAutocompleteChange={handleAutocompleteChange}
// 								register={register}
// 								autocompleteName="pickUpLocation"

// 							/>
// 							{/* {errors.pickUpLocation && (
// 								<Form.Control.Feedback type="invalid">
// 									Please select pick up location
// 								</Form.Control.Feedback>
// 							)} */}
// 						</Stack>
// 						<div className={`${styles.timePicker} ${styles.twoColumn}`}>
// 							<FormControl className="mb-2">
// 								<FormLabel>Pick Up Opening Date/Time</FormLabel>

// 								<LocalizationProvider dateAdapter={AdapterDayjs}>
// 									<DateTimePicker
// 										{...register("pickUpOpeningDateTime", {
// 											required: true,
// 										})}
// 										name="pickUpOpeningDateTime"
// 										timeFormat={false}
// 										closeOnSelect={false}
// 										onChange={handlePickUpDateChangeOpen}
// 										value={pickDateOpen}
// 									/>
// 								</LocalizationProvider>
// 								{/* {errors.pickUpOpeningDateTime && (
// 									<Form.Control.Feedback type="invalid">
// 										{errors.pickUpOpeningDateTime.type === "required"
// 											? "please provide a valid pick up date."
// 											: errors.pickUpOpeningDateTime?.message}
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 							<FormControl className="mb-2">
// 								<FormLabel>Pick Up Closing Date/Time</FormLabel>

// 								<LocalizationProvider dateAdapter={AdapterDayjs}>
// 									<DateTimePicker
// 										{...register("pickUpClosingDateTime", {
// 											required: true,
// 											validate: validatePickUpDate,
// 										})}
// 										name="pickUpClosingDateTime"
// 										value={pickDateClose}
// 										timeFormat={false}
// 										closeOnSelect={false}
// 										onChange={handlePickUpDateChangeClose}
// 									/>
// 								</LocalizationProvider>
// 								{/* {errors.pickUpClosingDateTime && (
// 									<Form.Control.Feedback type="invalid">
// 										{errors.pickUpClosingDateTime.type === "required"
// 											? "please provide a valid pick up date."
// 											: errors.pickUpClosingDateTime?.message}
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 						</div>
// 						<FormControl>
// 							<FormLabel>Bussiness Name*</FormLabel>

// 							<TextField
// 								type="text"
// 								required
// 								{...register("pBussinessName", { required: true })}
// 								name="pBussinessName"
// 								defaultValue={currentData ? currentData.pBussinessName : ""}
// 								isInvalid={errors.pBussinessName ? true : false}
// 							/>

// 							{/* {errors.pBussinessName && (
// 								<Form.Control.Feedback type="invalid">
// 									This field is required.
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 						<FormControl>
// 							<FormLabel>Bussiness Address*</FormLabel>

// 							<TextField
// 								type="text"
// 								required
// 								{...register("pBussinessAddress", { required: true })}
// 								name="pBussinessAddress"
// 								defaultValue={currentData ? currentData.pBussinessAddress : ""}
// 								isInvalid={errors.pBussinessAddress ? true : false}
// 							/>

// 							{/* {errors.pBussinessAddress && (
// 								<Form.Control.Feedback type="invalid">
// 									This field is required.
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 						<div className={styles.twoColumn}>
// 							<FormControl>
// 								<FormLabel>City*</FormLabel>

// 								<TextField
// 									type="text"
// 									required
// 									{...register("pCity", { required: true })}
// 									name="pCity"
// 									defaultValue={currentData ? currentData.pCity : ""}
// 									isInvalid={errors.pCity ? true : false}
// 								/>

// 								{/* {errors.pCity && (
// 									<Form.Control.Feedback type="invalid">
// 										This field is required.
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 							<FormControl>
// 								<FormLabel>State*</FormLabel>

// 								<TextField
// 									type="text"
// 									required
// 									{...register("pState", { required: true })}
// 									name="pState"
// 									defaultValue={currentData ? currentData.pState : ""}
// 									isInvalid={errors.pState ? true : false}
// 								/>

// 								{/* {errors.pState && (
// 									<Form.Control.Feedback type="invalid">
// 										This field is required.
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 						</div>
// 					</CardContent>
// 				</Card>

// 				<Card className={styles.deleveryInformation}>
// 					<CardContent>
// 						<h2>Delivery Information</h2>
// 						<Stack className="mb-2" spacing={2}>
// 							<label>Destination</label>
// 							<PlacesAutocomplete
// 								currentData={currentData}
// 								handleAutocompleteChange={handleAutocompleteChangeDes}
// 								register={register}
// 								autocompleteName="destination"
// 							/>
// 							{/* {errors.destination && (
// 								<Form.Control.Feedback type="invalid">
// 									Please select destination
// 								</Form.Control.Feedback>
// 							)} */}
// 						</Stack>
// 						<div className={`${styles.timePicker} ${styles.twoColumn}`}>
// 							<FormControl className="mb-2">
// 								<FormLabel>Drop of Opening Date/Time</FormLabel>

// 								<LocalizationProvider dateAdapter={AdapterDayjs}>
// 									<DateTimePicker
// 										{...register("dropOpeningDateTime", {
// 											required: true,
// 											validate: validateDropDate,
// 										})}
// 										name="dropOpeningDateTime"
// 										value={dropDateOpen}
// 										timeFormat={false}
// 										closeOnSelect={false}
// 										onChange={handleDropDateChangeOpen}
// 									/>
// 								</LocalizationProvider>
// 								{/* {errors.dropOpeningDateTime && (
// 									<Form.Control.Feedback type="invalid">
// 										{errors.dropOpeningDateTime.type === "required"
// 											? "please provide a valid drop of date and time."
// 											: errors.dropOpeningDateTime?.message}
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 							<FormControl className="mb-2">
// 								<FormLabel>Drop of Closing Date/Time</FormLabel>

// 								<LocalizationProvider dateAdapter={AdapterDayjs}>
// 									<DateTimePicker
// 										{...register("dropClosingDateTime", {
// 											required: true,
// 										})}
// 										name="dropClosingDateTime"
// 										value={dropDateClose}
// 										timeFormat={false}
// 										closeOnSelect={false}
// 										onChange={handleDropDateChangeClose}
// 									/>
// 								</LocalizationProvider>
// 								{/* {errors.dropClosingDateTime && (
// 									<Form.Control.Feedback type="invalid">
// 										{errors.dropClosingDateTime.type === "required"
// 											? "please provide a valid drop of date."
// 											: errors.dropClosingDateTime?.message}
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 						</div>
// 						<FormControl>
// 							<FormLabel>Bussiness Name*</FormLabel>

// 							<TextField
// 								type="text"
// 								required
// 								{...register("dBussinessName", { required: true })}
// 								name="dBussinessName"
// 								defaultValue={currentData ? currentData.dBussinessName : ""}
// 								isInvalid={errors.dBussinessName ? true : false}
// 							/>

// 							{/* {errors.dBussinessName && (
// 								<Form.Control.Feedback type="invalid">
// 									This field is required.
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 						<FormControl>
// 							<FormLabel>Bussiness Address*</FormLabel>

// 							<TextField
// 								type="text"
// 								required
// 								{...register("dBussinessAddress", { required: true })}
// 								name="dBussinessAddress"
// 								defaultValue={currentData ? currentData.dBussinessAddress : ""}
// 								isInvalid={errors.dBussinessAddress ? true : false}
// 							/>

// 							{/* {errors.dBussinessAddress && (
// 								<Form.Control.Feedback type="invalid">
// 									This field is required.
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 						<div className={styles.twoColumn}>
// 							<FormControl>
// 								<FormLabel>City*</FormLabel>

// 								<TextField
// 									type="text"
// 									required
// 									{...register("dCity", { required: true })}
// 									name="dCity"
// 									defaultValue={currentData ? currentData.dCity : ""}
// 									isInvalid={errors.dCity ? true : false}
// 								/>

// 								{/* {errors.dCity && (
// 									<Form.Control.Feedback type="invalid">
// 										This field is required.
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 							<FormControl>
// 								<FormLabel>State*</FormLabel>

// 								<TextField
// 									type="text"
// 									required
// 									{...register("dState", { required: true })}
// 									name="dState"
// 									defaultValue={currentData ? currentData.dState : ""}
// 									isInvalid={errors.dState ? true : false}
// 								/>

// 								{/* {errors.dState && (
// 									<Form.Control.Feedback type="invalid">
// 										This field is required.
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 						</div>
// 					</CardContent>
// 				</Card>

// 				<Card className={styles.comodityDisp}>
// 					<CardContent>
// 						<Typography variant="h2">Commodity and Dispatcher</Typography>
// 						<FormControl className="mb-2">
// 							<FormLabel>Commodity</FormLabel>
// 							<TextField
// 								type="text"
// 								required
// 								placeholder="please enter commodity"
// 								{...register("comodity")}
// 								name="comodity"
// 								defaultValue={currentData ? currentData.comodity : ""}
// 								isInvalid={errors.comodity ? true : false}
// 							/>

// 							{/* {errors.comodity && (
// 								<Form.Control.Feedback type="invalid">Please enter commodity</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>

// 						<FormControl className="mb-2">
// 							<FormLabel id="demo-row-radio-buttons-group-label">Load Type</FormLabel>
// 							<RadioGroup
// 								{...register("loadType")}
// 								row
// 								aria-labelledby="demo-row-radio-buttons-group-label"
// 								name="loadType"
// 								defaultValue={
// 									currentData && currentData.loadType === "full-load" ? "full-load" : "LTL"
// 								}
// 							>
// 								<FormControlLabel value="full-load" control={<Radio />} label="Full Load" />
// 								<FormControlLabel value="LTL" control={<Radio />} label="LTL" />
// 							</RadioGroup>
// 						</FormControl>

// 						<div className={styles.twoColumn}>
// 							<FormControl className="mb-2">
// 								<FormLabel>Pallets</FormLabel>

// 								<TextField
// 									type="number"
// 									required
// 									placeholder=""
// 									min={0}
// 									{...register("pallets")}
// 									name="pallets"
// 									defaultValue={currentData ? currentData.pallets : ""}
// 									isInvalid={errors.pallets ? true : false}
// 								/>

// 								{/* {errors.pallets && (
// 									<Form.Control.Feedback type="invalid">
// 										Please select an option pallets
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>

// 							<FormControl className="mb-2">
// 								<FormLabel>Weight</FormLabel>

// 								<TextField
// 									type="number"
// 									min={0}
// 									required
// 									placeholder=""
// 									{...register("weight")}
// 									name="weight"
// 									defaultValue={currentData ? currentData.weight : ""}
// 									isInvalid={errors.weight ? true : false}
// 								/>

// 								{/* {errors.weight && (
// 									<Form.Control.Feedback type="invalid">
// 										Please select an option weight
// 									</Form.Control.Feedback>
// 								)} */}
// 							</FormControl>
// 						</div>

// 						<FormControl className="mb-2">
// 							<FormLabel>Dispatcher</FormLabel>
// 							<TextField
// 								type="text"
// 								placeholder="name@example.com"
// 								{...register("dispatcher")}
// 								name="dispatcher"
// 								required
// 								isInvalid={errors.dispatcher ? true : false}
// 								defaultValue={currentData ? currentData.dispatcher : currentUser?.user.email}
// 							/>

// 							{/* {errors.dispatcher && (
// 								<Form.Control.Feedback type="invalid">
// 									Please choose a dispatcher.
// 								</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 					</CardContent>
// 				</Card>

// 				<Card className={styles.attachmentNotes}>
// 					<CardContent>
// 						<Typography variant="h2">Attachment and Notes</Typography>
// 						<FormControl className="mb-2">
// 							<FormLabel>Attach CON</FormLabel>

// 							<TextField
// 								type="file"
// 								{...register("con")}
// 								required
// 								name="con"
// 								isInvalid={errors.con ? true : false}
// 							/>
// 							{/* {errors.con && (
// 								<Form.Control.Feedback type="invalid">Please choose a file.</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>

// 						<FormControl className="mb-2">
// 							<FormLabel>Attach BOL</FormLabel>

// 							<TextField
// 								type="file"
// 								{...register("bol")}
// 								name="bol"
// 								isInvalid={errors.bol ? true : false}
// 								required
// 							/>
// 							{/* {errors.bol && (
// 								<Form.Control.Feedback type="invalid">Please choose a file.</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>

// 						<FormControl className="mb-2">
// 							<FormLabel>Attach POD</FormLabel>

// 							<TextField
// 								type="file"
// 								{...register("pod")}
// 								name="pod"
// 								isInvalid={errors.pod ? true : false}
// 								required
// 							/>
// 							{/* {errors.pod && (
// 								<Form.Control.Feedback type="invalid">Please choose a file.</Form.Control.Feedback>
// 							)} */}
// 						</FormControl>
// 						<div className={styles.oneColumn}>
// 							<FormControl className={styles.fullWidth}>
// 								<FormLabel>Notes Private</FormLabel>
// 								<TextField
// 									{...register("notesPrivate")}
// 									as="textarea"
// 									rows="4"
// 									defaultValue={currentData ? currentData.notesPrivate : ""}
// 									placeholder="Enter your private notes here..."
// 								/>
// 							</FormControl>
// 						</div>
// 					</CardContent>
// 				</Card>
// 			</div>

// 			<form onSubmit={handleSubmit(onSubmit)}>
// 				<MUIModal
// 					showModal={showModal}
// 					setShowModal={setShowModal}
// 					modalTitle={"Add Customer"}
// 					closeBtn="Cancel"
// 					secondaryBtnText={"Submit"}
// 					secondaryBtnDisabled={disableSubmit}
// 					handleClickSecondaryBtn={handleSubmit(onSubmit)}
// 					isSubmit={true}
// 					modalClassName="wd-80"
// 					modalBodyComponent={
// 						<AddCustomerModal
// 							setValue={setValueAddCustomer}
// 							currentData={null}
// 							register={registerAddCustomer}
// 							errors={errorsAddCustomer}
// 							watch={watchAddCustomer}
// 							control={controlAddCustomer}
// 						/>
// 					}
// 				/>
// 			</form>

// 			<form onSubmit={handleSubmitCarrier(onSubmitCarrier)}>
// 				<MUIModal
// 					showModal={showModalCarrier}
// 					setShowModal={setShowModalCarrier}
// 					modalTitle={"Add Carrier"}
// 					closeBtn="Cancel"
// 					secondaryBtnText={"Submit"}
// 					secondaryBtnDisabled={disableSubmitCarrier}
// 					handleClickSecondaryBtn={handleSubmitCarrier(onSubmitCarrier)}
// 					isSubmit={true}
// 					modalClassName="wd-80"
// 					modalBodyComponent={
// 						<AddCarrierModal
// 							setValue={setValueAddCarrier}
// 							currentData={null}
// 							register={registerAddCarrier}
// 							errors={errorsAddCarrier}
// 							watch={watchAddCarrier}
// 							control={controlAddCarrier}
// 						/>
// 					}
// 				/>
// 			</form>
// 		</div>
// 	);
// };

// export default AddLoadModal;
