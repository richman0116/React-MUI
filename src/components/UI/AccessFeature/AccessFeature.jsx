import React from "react";
import MUIModal from "../../MUIModal";
import TeamPermissionModal from "../../../pages/TeamList/TeamPermissionModal";
import useAccessFeature from "./hooks/hook";

const AccessFeature = ({ open, setOpen, branch, group }) => {
	const { handleSubmit, onSubmit, watch, setValue, updateLodingGroup, updateLodingBranch } =
		useAccessFeature({
			branch,
			setOpen,
			group,
		});

	console.log(group, branch);
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<MUIModal
				modalBodyComponent={
					<TeamPermissionModal
						watch={watch}
						setFormData={setValue}
						except={branch ? ["Group", "Team", "User"] : []}
					/>
				}
				showModal={open}
				setShowModal={setOpen}
				modalTitle={"Update Feature Permission"}
				closeBtn="Cancel"
				isSubmit={true}
				secondaryBtnText={"Update Permission"}
				handleClickSecondaryBtn={handleSubmit(onSubmit)}
				secondaryBtnDisabled={updateLodingGroup || updateLodingBranch}
				secondaryBtnLoading={updateLodingGroup || updateLodingBranch}
				contentClass="p-2"
				modalClassName="wd-60"
			/>
		</form>
	);
};

export default AccessFeature;
