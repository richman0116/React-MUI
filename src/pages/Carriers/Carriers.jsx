import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Carriers.module.scss";
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
import useAddCarrier from "./hooks";
import MUIModal from "../../components/MUIModal";
import { EditNoteTwoTone } from "@mui/icons-material";
import { COLORS } from "../../shared/colors";
import AddCarrierModal from "./AddCarrierModal";

const Carriers = () => {
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
		carriersData,
		onSubmit,
		setCurrentData,
		setShowModal,
		isLoading,
	} = useAddCarrier();

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

	const [carrierColumn] = useState([
		{
			id: "carrierId",
			label: "Carrier ID",
			render: (carrier) => {
				return (
					<div style={{ minWidth: "60px" }}>
						<div>{carrier.carrierId}</div>
					</div>
				);
			},
		},

		{
			id: "name",
			label: "Carrier Name",
			canBeSorted: true,
			render: (carrier) => {
				return <div style={{ color: COLORS.ZERO_CRAYOLA }}>{carrier.name}</div>;
			},
		},

		{
			id: "type",
			label: "Carrier Type",
			canBeSorted: true,
			render: (carrier) => {
				return <div>{carrier.type}</div>;
			},
		},

		{
			id: "phone",
			label: "Carrier Phone",
			canBeSorted: true,
			render: (carrier) => {
				return <div>{carrier.phone}</div>;
			},
		},

		{
			id: "email",
			label: "Carrier Email",
			canBeSorted: true,
			render: (carrier) => {
				return <div>{carrier.email}</div>;
			},
		},
		{
			id: "units",
			label: "Total Unit",
			canBeSorted: true,
			render: (carrier) => {
				return <div>{carrier.nOfUnits}</div>;
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
			render: (carrier) => {
				return (
					<div className={styles.actionFlex}>
						<div>
							<IconButton
								onClick={() => handleEdit(carrier)}
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
					Add Carrier
				</Button>
			</div>

			<CrmTable
				columns={carrierColumn}
				data={carriersData ? carriersData.carriers : []}
				loading={isLoading}
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<MUIModal
					showModal={showModal}
					setShowModal={setShowModal}
					modalTitle={`${currentData ? "Update" : "Add"} Carrier`}
					closeBtn="Cancel"
					secondaryBtnText={currentData ? "Update" : "Submit"}
					secondaryBtnDisabled={disableSubmit}
					handleClickSecondaryBtn={handleSubmit(onSubmit)}
					isSubmit={true}
					modalClassName="wd-65"
					modalBodyComponent={
						<AddCarrierModal
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

export default Carriers;
