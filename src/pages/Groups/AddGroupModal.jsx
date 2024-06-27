import React from "react";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import TeamPermissionModal from "../TeamList/TeamPermissionModal";

const AddGroupModal = ({ errors, currentData = null, setValue, control, watch }) => {
	const generateKeyFromTitle = (title) => {
		return title.toLowerCase().replace(/\s+/g, "-");
	};

	const handleTitleChange = (e) => {
		const title = e.target.value;
		setValue("title", title, { shouldValidate: true });
		const key = generateKeyFromTitle(title);
		setValue("key", key, { shouldValidate: true });
	};

	return (
		<div>
			<Box>
				<FormControl sx={{ width: "280px", marginRight: "10px" }}>
					<Controller
						name="title"
						control={control}
						defaultValue={currentData?.title || ""}
						rules={{ required: true }}
						render={({ field }) => (
							<TextField
								{...field}
								required
								fullWidth
								label="Give a name to your Group"
								size="small"
								type="text"
								error={!!errors.title}
								onChange={(e) => {
									field.onChange(e);
									handleTitleChange(e);
								}}
							/>
						)}
					/>
				</FormControl>
				<FormControl>
					<Controller
						name="key"
						control={control}
						defaultValue={currentData?.key || ""}
						rules={{ required: true }}
						render={({ field }) => (
							<TextField
								{...field}
								required
								fullWidth
								label="Key"
								size="small"
								type="text"
								disabled
								error={!!errors.key}
							/>
						)}
					/>
				</FormControl>
				<Box sx={{ mt: 2 }}>
					<Typography sx={{ fontWeight: "bold", mb: 1 }}>Permission: </Typography>
					<Box>
						<TeamPermissionModal watch={watch} setFormData={setValue} />
					</Box>
				</Box>
			</Box>
		</div>
	);
};

export default AddGroupModal;
