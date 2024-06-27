import React from "react";
import {
	Button,
	Autocomplete,
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	TextField,
} from "@mui/material";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import styles from "./MakePayment.module.scss";
import usePaymentPreview from "./hooks/usePaymentPreview";
import ProgressLoader from "../../ProgressLoader/ProgressLoader";
import PaymentForm from "./PaymentForm";
import MUIModal from "../../MUIModal";

const PaymentPreview = ({ loadId = null, setOpen }) => {
	const {
		loadIds,
		isLoading,
		loadDetails,
		onChangeLoadId,
		register,
		watch,
		setValue,
		handleSubmit,
		onSubmit,
		showModal,
		setShowModal,
		errors,
		selectedPaymentType,
		setSelectedPaymentType,
		isUpdate,
		isFetching,
		addLoading,
		updateLoading,
	} = usePaymentPreview({ loadId: loadId, setOpen });

	if (isLoading) return <ProgressLoader />;

	return (
		<div>
			{!loadId && (
				<div className={styles.loadIdContainer}>
					<Autocomplete
						id="asynchronous-demo-des"
						onChange={(event, newValue) => {
							onChangeLoadId(newValue);
						}}
						isOptionEqualToValue={(option, value) => option._id == value?._id}
						getOptionLabel={(option) => option.loadId}
						options={loadIds ? loadIds : []}
						size="small"
						renderInput={(params) => <TextField {...params} required label="Load ID" />}
					/>
				</div>
			)}

			{isFetching && <ProgressLoader />}
			{!isFetching && loadDetails && loadDetails.load && (
				<>
					<List className={styles.PaymentPreview}>
						<ListItem className={styles.clickableListItem}>
							<ListItemAvatar>
								<Avatar>
									<TurnRightIcon color="success" />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={"Incoming"} secondary={"Customer/Broker Payment"} />
							<Button
								onClick={() => {
									setSelectedPaymentType("incoming");
									setShowModal(true);
								}}
								variant="contained"
								color="info"
							>
								{loadDetails.load.incomingPayment ? "Update" : "Create"} Payment
							</Button>
						</ListItem>
						<ListItem className={styles.clickableListItem}>
							<ListItemAvatar>
								<Avatar>
									<TurnLeftIcon color="error" />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Outgoing" secondary={"Carrier/Shipper Payment"} />
							<div className={styles.btnGroup}>
								<Button
									onClick={() => {
										setSelectedPaymentType("outgoing");
										setShowModal(true);
									}}
									variant="contained"
									color="info"
									className={styles.btn}
								>
									{loadDetails.load.outgoingPayment ? "Update" : "Create"} Payment
								</Button>
								<Button
									onClick={() => {
										window.open("https://www.bankofamerica.com/smallbusiness/", "_blank");
									}}
									variant="contained"
									color="error"
								>
									Bank Payment
								</Button>
							</div>
						</ListItem>
					</List>
					<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
						<MUIModal
							showModal={showModal}
							setShowModal={setShowModal}
							modalTitle={`${isUpdate ? "Update" : "Add"} ${
								selectedPaymentType === "outgoing" ? " Carrier" : " Customer"
							}  Payment`}
							closeBtn="Cancel"
							secondaryBtnText={isUpdate ? "Update" : "Create"}
							secondaryBtnDisabled={addLoading || updateLoading}
							handleClickSecondaryBtn={handleSubmit(onSubmit)}
							isSubmit={true}
							modalClassName="wd-80"
							modalBodyComponent={
								<PaymentForm
									pType={selectedPaymentType}
									setValue={setValue}
									load={loadDetails.load}
									register={register}
									errors={errors}
									watch={watch}
								/>
							}
						/>
					</form>
				</>
			)}
		</div>
	);
};

export default PaymentPreview;
