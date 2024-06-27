import React, { useState } from "react";
import styles from "../AccessManagement/AccessManagement.module.scss";
import { Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import MUIModal from "../../components/MUIModal";
import AddTeamlistModal from "./AddTeamlistModal";
import useTeamList from "../TeamList/hooks/hook";
import AddUserSelectModal from "./AddUserSelectModal";
import AccessFeature from "../../components/UI/AccessFeature/AccessFeature";
import CollapsibleTable from "./CollapsableTable";

const TeamList = () => {
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
		setCurrentData,
		getTheData,
		onSubmit,
		setShowModal,
	} = useTeamList();


	const [showUserMembersModal, setshowUserMembersModal] = useState(false);
	const [showPermissionModal, setShowPermisstionModal] = useState(false);
	const [branch, setBranch] = useState();


	const HandelerTeamMemberEdit = (data) => {
		setshowUserMembersModal(true);
		setShowPermisstionModal(false);
		setCurrentData(data);
		setShowModal(true);
		reset();
	};

	const handelCreateTeam = () => {
		setShowPermisstionModal(false);
		setshowUserMembersModal(false);
		setCurrentData(null);
		reset();
		setShowModal(true);
	};

	return (
		<>
			<div className={styles.orderArea}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						mb: "1rem",
						justifyContent: "flex-end",
					}}
				>
					<Box
						sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem" }}
					>
						<FormControl variant="outlined" size="small">
							<InputLabel htmlFor="outlined-adornment-password">Search User</InputLabel>
							<OutlinedInput
								sx={{ height: "45px" }}
								size="small"
								id="outlined-adornment-password"
								type="search"
								endAdornment={
									<InputAdornment position="end">
										<Search />
									</InputAdornment>
								}
								label="Search Team"
							/>
						</FormControl>
						<Button
							variant="contained"
							sx={{
								width: "130px",
								height: "45px",
								fontWeight: "600",
								textTransform: "capitalize",
							}}
							color="primary"
							onClick={handelCreateTeam}
							size="small"
						>
							Create Team
						</Button>
					</Box>
				</Box>
				<CollapsibleTable
					data={getTheData ? getTheData.branchs : []}
					setShowPermisstionModal={setShowPermisstionModal}
					setshowUserMembersModal={setshowUserMembersModal}
					HandelerTeamMemberEdit={HandelerTeamMemberEdit}
					branch={branch}
					reset={reset}
					setShowModal={setShowModal}
					setBranch={setBranch}
				/>
				<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
					<MUIModal
						showModal={showModal}
						setShowModal={setShowModal}
						modalTitle={`${currentData ? "Manage Team Members" : "Create Team"} `}
						closeBtn="Cancel"
						secondaryBtnText={currentData ? "Update Team" : "Submit"}
						secondaryBtnDisabled={disableSubmit}
						secondaryBtnLoading={disableSubmit}
						handleClickSecondaryBtn={handleSubmit(onSubmit)}
						isSubmit={true}
						modalClassName="wd-60"
						modalBodyComponent={
							showUserMembersModal === true ? (
								<AddUserSelectModal
									showManageMembersModal={showUserMembersModal}
									setValue={setValue}
									memberData={currentData && currentData?.users ? currentData?.users : []}
									register={register}
									errors={errors}
									watch={watch}
									control={control}
								/>
							) : (
								<AddTeamlistModal
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
					<AccessFeature
						setOpen={setShowPermisstionModal}
						open={showPermissionModal}
						branch={branch}
					/>
				)}
			</div>
		</>
	);
};

export default TeamList;
