import React from "react";
import styles from "./DeliveryInformation.module.scss";
import { Button, Card, CardContent, Typography, Box, IconButton, FormControl } from "@mui/material";
import useDeliveryInformation from "./hooks/useDeliveryInformation";
import AddDeliveryModal from "./AddDeliveryModal";
import MUIModal from "../../../MUIModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

const DeliveryInformation = ({ currentData = null, setValueGlobal, errorGlobal }) => {
	const {
		register,
		errors,
		watch,
		setValue,
		handleSubmit,
		onSubmit,
		control,
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
		setShowModal,
		setDropDateOpen,
		setCurrentIndex,
		currentIndex,
	} = useDeliveryInformation({ currentData, setValueGlobal });

	// THIS FUNCTION FOR DELETE ADD DELIVERY INFORMATION ;

	const removeAllData = (index) => {
		const removeData = deliveryInformation.filter((item, i) => i !== index);
		setDeliveryInformation(removeData);
		reset();
	};

	// THIS FUNCTION FOR EDIT ADD DELIVERY INFORMATION

	const editAllData = (index) => {
		setShowModal(true);

		const getTheData = deliveryInformation[index];
		setDropDateOpen(dayjs(getTheData.dropOpeningDateTime));
		Object.keys(getTheData).forEach((key) => {
			setValue(key, getTheData[key]);
		});
		setCurrentIndex(index);
	};

	// THIS FUNCTION FOR ADD DELIVERY INFORMATION

	const openDeliveryModal = () => {
		setDropDateOpen(null);
		setShowModal(true);
		reset();
	};

	return (
		<FormControl
			onSubmit={handleSubmit(onSubmit)}
			autoComplete="off"
			error={!!errorGlobal.destinationList}
		>
			<Card className={styles.deleveryInformation}>
				<CardContent>
					<Typography variant="h2" mb={2}>
						Delivery Information
					</Typography>
					<Box mb={2} style={{ display: "flex", justifyContent: "end" }}>
						<Button variant="contained" sx={{ bgcolor: "#000000" }} onClick={openDeliveryModal}>
							{deliveryInformation.length ? "Add Another DEL" : "Add DEL"}
						</Button>
					</Box>
					{deliveryInformation.map((dt, i) => {
						return (
							<Card className={styles.informationCard} key={i}>
								<CardContent className={styles.informationContent}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											gap: ".5rem",
										}}
									>
										<Typography variant="h6" fontSize={"1rem"}>
											DEL {i + 1}: {dt.destination}
										</Typography>

										<Box
											sx={{
												display: "flex",
												justifyContent: "flex-end",
												alignItems: "center",
												gap: ".5rem",
												mb: "1rem",
											}}
										>
											<IconButton
												sx={{
													"&:hover": { backgroundColor: "primary.main", color: "common.white" },
													backgroundColor: "black",
													color: "common.white",
												}}
												onClick={() => editAllData(i)}
											>
												<EditIcon sx={{ fontSize: "1rem" }} />
											</IconButton>

											<IconButton
												sx={{
													"&:hover": { backgroundColor: "primary.main", color: "common.white" },
													backgroundColor: "black",
													color: "common.white",
												}}
												onClick={() => removeAllData(i)}
											>
												<DeleteIcon sx={{ fontSize: "1rem" }} />
											</IconButton>
										</Box>
									</Box>

									<Typography>
										<p>
											<b>Delivery Time:</b> {dt.dropOpeningDateTime},<b>Bussiness Address:</b>{" "}
											{dt.dBussinessAddress},<b>Commodity:</b> {dt.dComodity},<b>pallets:</b>{" "}
											{dt.dPallets}, <b>weight:</b> {dt.dWeight}
										</p>
									</Typography>
								</CardContent>
							</Card>
						);
					})}
					{errorGlobal.destinationList && (
						<Typography variant="caption" color="error">
							Please add minimum one delivery information!
						</Typography>
					)}

					{/* {errorGlobal.destinationList && (
						<Form.Control.Feedback type="invalid">
							Please add minimum one delivery location!
						</Form.Control.Feedback>
					)} */}

					<MUIModal
						showModal={showModal}
						setShowModal={setShowModal}
						modalTitle={`${currentIndex !== null ? "Edit" : "Add"} DEL Information`}
						closeBtn="Cancel"
						secondaryBtnText={`${currentIndex !== null ? "Update" : "Add"} DEL`}
						handleClickSecondaryBtn={handleSubmit(onSubmit)}
						isSubmit={true}
						modalClassName="wd-768"
						modalBodyComponent={
							<AddDeliveryModal
								register={register}
								errors={errors}
								control={control}
								watch={watch}
								handleAutocompleteChangeDes={handleAutocompleteChangeDes}
								handleDropDateChangeOpen={handleDropDateChangeOpen}
								handleDropDateChangeClose={handleDropDateChangeClose}
								dropDateOpen={dropDateOpen}
								dropDateClose={dropDateClose}
								validateDropDate={validateDropDate}
							/>
						}
					/>
				</CardContent>
			</Card>
		</FormControl>
	);
};

export default DeliveryInformation;
