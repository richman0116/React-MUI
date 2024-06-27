import React from "react";
import styles from "./PickUpInformation.module.scss";
import { Card, CardContent, Typography, Button, Box, IconButton, FormControl } from "@mui/material";
import MUIModal from "../../MUIModal";
import AddPickUpModal from "./AddPickUpModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import usePickUpInformation from "./hooks/usePickUpInformation";

const PickUpInformation = ({ currentData = null, setValueGlobal, errorGlobal }) => {
	const {
		register,
		errors,
		watch,
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
		control,
		setCurrentIndex,
		currentIndex,
	} = usePickUpInformation({ currentData, setValueGlobal });

	// THIS FUNCTION FOR REMOVE PICKUP-INFORMATION
	const removeAllData = (index) => {
		const removeData = pickUpInformation.filter((item, i) => i !== index);
		setPickUpInformation(removeData);
		reset();
	};

	// THIS FUNCTION FOR EDIT PICKUP-INFORMATION
	const editAllData = (index) => {
		setShowModal(true);

		const getTheData = pickUpInformation[index];
		setPickDateOpen(dayjs(getTheData.pickUpOpeningDateTime));

		Object.keys(getTheData).forEach((key) => {
			setValue(key, getTheData[key]);
		});
		setCurrentIndex(index);
	};

	// THIS FUNCTION FOR ADD PICKUP-INFORMATION

	const openPickUpModal = () => {
		setPickDateOpen(null);
		setShowModal(true);
		reset();
	};

	return (
		<div className="pickUpInformationArea">
			<FormControl
				fullWidth
				onSubmit={handleSubmit(onSubmit)}
				autoComplete="off"
				error={!!errorGlobal.pickUpList}
			>
				<Card className={styles.pickUpInformation}>
					<CardContent>
						<Typography mb={2} variant="h2">
							Pick Up Information
						</Typography>
						<Box mb={2} style={{ display: "flex", justifyContent: "end" }}>
							<Button variant="contained" sx={{ bgcolor: "#000000" }} onClick={openPickUpModal}>
								{pickUpInformation.length ? "Add Another Pick Up" : "Add Pick Up"}
							</Button>
						</Box>

						{pickUpInformation.map((dt, i) => {
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
											<Typography variant="h6" component={"h6"} fontSize={"1rem"}>
												PU {i + 1}: {dt.pickUpLocation}
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
												<b>Pickup Time:</b> {dt.pickUpOpeningDateTime}, <b>Bussiness Address:</b>{" "}
												{dt.pBussinessAddress},<b>Commodity:</b> {dt.pComodity},<b>pallets:</b>{" "}
												{dt.pPallets}, <b>weight:</b> {dt.pWeight}
											</p>
										</Typography>
									</CardContent>
								</Card>
							);
						})}

						{errorGlobal.pickUpList && (
							<Typography variant="caption" color="error">
								Please add minimum one pick up information!
							</Typography>
						)}

						<MUIModal
							showModal={showModal}
							setShowModal={setShowModal}
							modalTitle={`${currentIndex !== null ? "Edit" : "Add"} Pick Up Information`}
							closeBtn="Cancel"
							secondaryBtnText={`${currentIndex !== null ? "Update" : "Add"} Pick Up`}
							handleClickSecondaryBtn={handleSubmit(onSubmit)}
							isSubmit={true}
							modalClassName="wd-768"
							modalBodyComponent={
								<AddPickUpModal
									register={register}
									errors={errors}
									watch={watch}
									control={control}
									handleAutocompleteChange={handleAutocompleteChange}
									handlePickUpDateChangeOpen={handlePickUpDateChangeOpen}
									handlePickUpDateChangeClose={handlePickUpDateChangeClose}
									pickDateOpen={pickDateOpen}
									pickDateClose={pickDateClose}
									validatePickUpDate={validatePickUpDate}
								/>
							}
						/>
					</CardContent>
				</Card>
			</FormControl>
		</div>
	);
};

export default PickUpInformation;
