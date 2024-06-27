import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CrmTable from "../../components/CrmTable";
import MUIModal from "../../components/MUIModal";
import AddTeamBody from "./AddTeamBody";
import { useGetUsersQuery, useStatusUpdateToActiveMutation } from "../../services/user";
import { Switch } from "@mui/material";

import styles from "./ManageUsers.module.scss";
import { toast } from "react-toastify";
import useInviteMember from "./hook";
import ChangeGroup from "./ChangeGroup";
import { useGetAllGroupsQuery } from "../../services/group";

const ManageUsers = () => {
	const {
		reset,
		register,
		currentData,
		watch,
		handleSubmit,
		setValue,
		control,
		errors,
		showModal,
		disableSubmit,
		onSubmit,
		setShowModal,
	} = useInviteMember();

	const { data: users, refetch, isLoading, isFetching } = useGetUsersQuery();
	const [statusUpdateToActive] = useStatusUpdateToActiveMutation();
	const { data: getGroupData, isFetching: isFetchingGroupData } = useGetAllGroupsQuery();

	let driversData = [];
	let teamsData = [];
	if (!isLoading) {
		const usersData = users?.users;

		if (usersData) {
			driversData = usersData.filter((user) => user.role === "driver");
			teamsData = usersData.filter((user) => user.role !== "driver");
		}
	}

	const [showDrivers, setShowDrivers] = useState(false);

	const [userStatus, setUserStatus] = React.useState(true);

	const handleActiveStatus = async (user) => {
		// Toggle the user's status
		const newStatus = !user.isActive;
		try {
			if (user?.role === "admin") {
				return toast("You cann't change Admin Status.");
			} else {
				await statusUpdateToActive({ id: user._id, status: newStatus });
				setUserStatus(newStatus);
				toast(`Status Changed to ${newStatus === true ? "Active" : "Inactive"}`);
			}
			refetch();
		} catch (error) {
			console.error("Error toggling user status:", error);
		}
	};

	const [UsersColumn, setUsersColumn] = useState([]);

	useEffect(() => {
		if (getGroupData) {
			setUsersColumn([
				{
					id: "name",
					label: "NAME",
					canBeSorted: true,
					render: (user) => {
						return (
							<div style={{ minWidth: "110px" }}>
								<div style={{ fontWeight: "bold" }}>{user?.userInfo?.name || user?.name}</div>
							</div>
						);
					},
				},
				{
					id: "email",
					label: "Email",
					canBeSorted: true,
					render: (user) => {
						return (
							<div style={{ minWidth: "110px" }}>
								<div>{user.email}</div>
							</div>
						);
					},
				},
				{
					id: "group",
					label: "GROUP",
					canBeSorted: true,
					render: (user) => {
						return <ChangeGroup getGroupData={getGroupData} user={user} />;
					},
				},
				{
					id: "status",
					label: "STATUS",
					canBeSorted: true,
					render: (user) => {
						const label = { inputProps: { "aria-label": "Switch demo" } };
						return (
							<div style={{ minWidth: "110px", display: "flex" }} className={styles.status}>
								<div className={styles.switchContainer}>
									{user && user.group && user.group.key && user.group.key === "super-admin" ? (
										<Switch {...label} disabled defaultChecked />
									) : (
										<Switch checked={user.isActive} onChange={() => handleActiveStatus(user)} />
									)}
								</div>
								<div style={{ fontStyle: "italic" }} className={styles.statusText}>
									{user.isActive ? (
										<span style={{ color: "#1976D2" }}>Active</span>
									) : (
										<span style={{ color: "#949494" }}>Inactive</span>
									)}
								</div>
							</div>
						);
					},
				},
			]);
		}
	}, [getGroupData]);

	return (
		<React.Fragment>
			<div style={{ display: "flex", justifyContent: "flex-end" }} className="topBtnContainer">
				<Button
					variant="outlined"
					size="small"
					className="m-1 mb-2"
					onClick={() => {
						setShowModal(true);
					}}
					sx={{ marginRight: "5px" }}
				>
					Invite
				</Button>
				{showDrivers ? (
					<Button
						onClick={() => setShowDrivers(false)}
						variant="contained"
						color="primary"
						size="small"
						className="m-1 mb-2"
					>
						View Team
					</Button>
				) : (
					<Button
						onClick={() => setShowDrivers(true)}
						variant="contained"
						color="primary"
						size="small"
						className="m-1 mb-2"
					>
						View Drivers
					</Button>
				)}
			</div>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<MUIModal
					showModal={showModal}
					setShowModal={setShowModal}
					modalTitle={` ${currentData ? "Add Group Members" : "Add Group"}`}
					secondaryBtnText={currentData ? "Update" : "Submit"}
					closeBtn="Cancel"
					secondaryBtnDisabled={disableSubmit}
					handleClickSecondaryBtn={handleSubmit(onSubmit)}
					isSubmit={true}
					modalClassName="wd-60"
					modalBodyComponent={
						<AddTeamBody
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
			{showDrivers ? (
				<CrmTable
					columns={UsersColumn}
					data={driversData}
					loading={isLoading || isFetchingGroupData}
				/>
			) : (
				<CrmTable
					columns={UsersColumn}
					data={teamsData}
					loading={isLoading || isFetching || isFetchingGroupData}
				/>
			)}
		</React.Fragment>
	);
};

export default ManageUsers;
