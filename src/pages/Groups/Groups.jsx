import React, { useState } from "react";
import styles from "./Groups.module.scss";
import CrmTable from "../../components/CrmTable";
import { useGetAllGroupsQuery } from "../../services/group";
import { Box, Button, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useAddGroup from "./hooks";
import MUIModal from "../../components/MUIModal";
import AddGroupModal from "./AddGroupModal";
import ManageUsersModal from "./ManageUsersModal";
import { PersonAddAlt1, Settings } from "@mui/icons-material";
import AccessFeature from "../../components/UI/AccessFeature/AccessFeature";

const Groups = () => {
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
	} = useAddGroup();

	const { data: groupData, isLoading, refetch } = useGetAllGroupsQuery();
	// const {  data:users } = useGetUsersQuery();
	// console.log(groupData);
	const handleEdit = (data) => {
		reset();
		setCurrentData(data);
		setShowModal(true);
	};
	const [showManageMembersModal, setShowManageMembersModal] = useState(false);
	const [showPermissionModal, setShowPermisstionModal] = useState(false);
	const [group, setGroup] = useState();
	const [GroupsColumn] = useState([
		{
			id: "name",
			label: "NAME",
			canBeSorted: true,
			render: (group) => {
				return (
					<div style={{ minWidth: "110px" }}>
						<div>{group.title}</div>
					</div>
				);
			},
		},

		{
			id: "totalUsers",
			label: "Total Users",
			canBeSorted: true,
			render: (group) => {
				return (
					<div style={{ minWidth: "110px" }}>
						<p>{group?.totalUsers || 0}</p>
					</div>
				);
			},
		},

		{
			id: "action",
			label: "Action",
			canBeSorted: true,
			render: (group) => {
				return (
					<div
						style={{
							display: "flex",
							gap: "1rem",
							justifyContent: "flex-start",
							alignItems: "center",
						}}
					>
						{/* <Tooltip title="Manage Users">
							<IconButton
								onClick={() => {
									setShowManageMembersModal(true);
									handleEdit(group);
									setShowModal(true);
								}}
							>
								<PersonAddAlt1 />
							</IconButton>
						</Tooltip> */}

						<Tooltip title="Permissions">
							<Button
								variant="outlined"
								size="small"
								onClick={() => {
									setShowPermisstionModal(true);
									setGroup(group);
								}}
								startIcon={<Settings />}
							>
								Permission
							</Button>
						</Tooltip>
					</div>
				);
			},
		},
	]);
	return (
		<div className={styles.orderArea}>
			<Stack className={styles.orderTop} direction="row" spacing={1}>
				<Button
					variant="contained"
					onClick={() => {
						setShowManageMembersModal(false);
						setCurrentData(null);
						reset();
						setShowModal(true);
					}}
					size="small"
					startIcon={<FontAwesomeIcon icon={faPlus} />}
				>
					Add Group
				</Button>
			</Stack>
			<CrmTable
				columns={GroupsColumn}
				data={groupData ? groupData.groups : []}
				loading={isLoading}
			/>

			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<MUIModal
					showModal={showModal}
					setShowModal={setShowModal}
					modalTitle={`${currentData ? "Add Group Member" : "Add Group"} `}
					closeBtn="Cancel"
					secondaryBtnText={currentData ? "Update" : "Submit"}
					secondaryBtnDisabled={disableSubmit}
					handleClickSecondaryBtn={handleSubmit(onSubmit)}
					isSubmit={true}
					modalClassName="wd-80"
					modalBodyComponent={
						showManageMembersModal === true ? (
							<ManageUsersModal
								showManageMembersModal={showManageMembersModal}
								setValue={setValue}
								memberData={currentData && currentData?.members ? currentData?.members : []}
								register={register}
								errors={errors}
								watch={watch}
								control={control}
							/>
						) : (
							<AddGroupModal
								setValue={setValue}
								currentData={currentData}
								register={register}
								errors={errors}
								watch={watch}
								control={control}
							/>
						)
					}
				/>
			</form>

			{showPermissionModal === true && (
				<AccessFeature setOpen={setShowPermisstionModal} open={showPermissionModal} group={group} />
			)}
		</div>
	);
};

export default Groups;
