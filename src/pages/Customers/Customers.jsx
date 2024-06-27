import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Customer.module.scss";
import AddCustomerModal from "./AddCustomerModal";
import CrmTable from "../../components/CrmTable";
import PersonIcon from "@mui/icons-material/Person";
import {
	Avatar,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from "@mui/material";
import useAddCustomer from "./hooks";
import MUIModal from "../../components/MUIModal";
import { EditNoteTwoTone } from "@mui/icons-material";
import { COLORS } from "../../shared/colors";

const Customers = () => {
	const {
		reset,
		register,
		watch,
		handleSubmit,
		setValue,
		control,
		errors,
		showModal,
		disableSubmit,
		currentData,
		customersData,
		onSubmit,
		setCurrentData,
		setShowModal,
		isLoading,
	} = useAddCustomer();

	const handleEdit = (data) => {
		reset();
		setCurrentData(data);
		setShowModal(true);
	};

	const renderRepresentatives = (customer) => {
		return (
			<List>
				{customer.representatives.map((r, index) => (
					<ListItem key={index} disableGutters>
						<ListItemAvatar>
							<Avatar sx={{ width: 26, height: 26 }}>
								<PersonIcon fontSize="small" />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={r.name}
							secondary={
								<>
									<Typography variant="body2" component="span" sx={{ color: COLORS.EERIE_BLACK }}>
										{r.phone} | {r.email}
									</Typography>
								</>
							}
							style={{ marginLeft: -14 }}
						/>
					</ListItem>
				))}
			</List>
		);
	};

	const [customerColumn] = useState([
		{
			id: "customerId",
			label: "Customer ID",
			render: (customer) => {
				return (
					<div style={{ minWidth: "60px" }}>
						<div>{customer.customerId}</div>
					</div>
				);
			},
		},

		{
			id: "customerName",
			label: "Customer Name",
			canBeSorted: true,
			render: (customer) => {
				return <div style={{ color: COLORS.ZERO_CRAYOLA }}>{customer.customerName}</div>;
			},
		},

		{
			id: "customerNumber",
			label: "Customer Phone",
			canBeSorted: true,
			render: (customer) => {
				return <div>{customer.customerNumber}</div>;
			},
		},

		{
			id: "customerEmail",
			label: "Customer Email",
			canBeSorted: true,
			render: (customer) => {
				return <div>{customer.customerEmail}</div>;
			},
		},
		{
			id: "representatives",
			label: "Representatives",
			canBeSorted: true,
			render: renderRepresentatives,
		},

		{
			id: "action",
			label: "Action",
			render: (customer) => {
				return (
					<div className={styles.actionRow}>
						<div>
							<IconButton
								onClick={() => handleEdit(customer)}
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
		<div className={styles.orderArea}>
			<div className={styles.orderTop}>
				<Button
					variant="contained"
					onClick={() => {
						setCurrentData(null);
						reset();
						setShowModal(true);
					}}
					size="small"
					startIcon={<FontAwesomeIcon icon={faPlus} />}
				>
					Add Customer
				</Button>
			</div>

			<CrmTable
				columns={customerColumn}
				data={customersData ? customersData.customers : []}
				loading={isLoading}
				//   filterQuery={filterQuery}
				// defaultSortedColumn="updatedAt"
				//   onSelectAll={(data, checked) => {
				//     onAllRowClick(checked);
				//   }}
				//   onSelectRow={(data, checked) => {
				//     events.userClickedSelectedItem(
				//       heapEventsConstants.leads_crm_selected_guest,
				//       data.name
				//     );
				//     onRowClick(data, checked);
				//   }}
				//   onScrollBottom={handleScrollBottom}
				//   hasMore={guests.length < guestCount}
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<MUIModal
					showModal={showModal}
					setShowModal={setShowModal}
					modalTitle={`${currentData ? "Update" : "Add"} Customer`}
					closeBtn="Cancel"
					secondaryBtnText={currentData ? "Update" : "Submit"}
					secondaryBtnDisabled={disableSubmit}
					handleClickSecondaryBtn={handleSubmit(onSubmit)}
					isSubmit={true}
					modalClassName="wd-65"
					modalBodyComponent={
						<AddCustomerModal
							setValue={setValue}
							currentData={currentData}
							register={register}
							errors={errors}
							watch={watch}
							control={control}
						/>
					}
				/>
			</form>
		</div>
	);
};

export default Customers;
