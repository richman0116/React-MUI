import React from "react";
import styles from "../TeamList/Teamlist.module.scss";
import { FormControl, TextField, Typography, Divider, Box } from "@mui/material";
import TeamPermissionModal from "./TeamPermissionModal";

const AddTeamlistModal = ({ register, errors, currentData = null, watch, setValue }) => {
	return (
		<div className={styles.addAssetArea}>
			<div>
				<Typography variant="button" style={{ fontWeight: 500 }}>
					Team Information
				</Typography>
				<Divider style={{ margin: "4px 0 16px 0" }} />

				<div className={styles.twoColumnGrid}>
					<FormControl style={{ marginBottom: "16px" }}>
						<TextField
							required
							label="Team Title"
							{...register("title", { required: true })}
							name="title"
							size="small"
							type="text"
							defaultValue={currentData ? currentData.title : ""}
							error={!!errors.title}
						/>
					</FormControl>
				</div>
				<Box sx={{ mt: 2 }}>
					<Typography sx={{ fontWeight: "bold", mb: 1 }}>Permission: </Typography>
					<Box>
						<TeamPermissionModal
							watch={watch}
							setFormData={setValue}
							except={["User", "Group", "Team"]}
						/>
					</Box>
				</Box>
			</div>
		</div>
	);
};

export default AddTeamlistModal;
