import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { FormControl, FormControlLabel, FormGroup, Paper, Typography } from "@mui/material";
import data from "../../shared/features.json";
import { useGetMeQuery } from "../../services/user";

const TeamPermissionModal = ({ watch, setFormData, except = [] }) => {
	const { data: userData } = useGetMeQuery();
	const handleAllChange = (event, category) => {
		const updatedCategory = { ...watch("accessFeatures")[category] };
		for (const key in updatedCategory) {
			updatedCategory[key] = event.target.checked;
		}
		setFormData("accessFeatures", { ...watch("accessFeatures"), [category]: updatedCategory });
	};

	const handleCheckboxChange = (event, category, key) => {
		const updatedCategory = { ...watch("accessFeatures")[category] };
		updatedCategory[key] = event.target.checked;
		const isEveryPropertyTrue = Object.entries(updatedCategory).every(
			([key, value]) => key === "All" || value === true
		);
		updatedCategory["All"] = isEveryPropertyTrue;
		const finalVal = { ...watch("accessFeatures"), [category]: updatedCategory };
		setFormData("accessFeatures", finalVal);
	};

	const renderCheckboxes = (category) => {
		const categoryData = watch("accessFeatures")[category] || {};
		if (userData.user.accessFeatures && userData.user.accessFeatures[category]) {
			Object.entries(userData.user.accessFeatures[category]).forEach(([key, value]) => {
				if (value) {
					categoryData[key] = categoryData && categoryData[key] ? categoryData[key] : false;
				} else {
					delete categoryData[key];
				}
			});
		}

		return (
			categoryData &&
			Object.entries(categoryData).map(([key]) => (
				<FormControlLabel
					key={key}
					control={
						<Checkbox
							checked={categoryData[key]}
							onChange={(event) =>
								key === "All"
									? handleAllChange(event, category)
									: handleCheckboxChange(event, category, key)
							}
						/>
					}
					label={key}
				/>
			))
		);
	};

	return (
		userData && (
			<FormControl fullWidth component="fieldset">
				<FormGroup>
					{Object.entries(data).map(
						([category]) =>
							!except.includes(category) && (
								<Paper
									key={category}
									style={{
										marginBottom: "1rem",
										padding: "0.5rem 1rem",
										display: "flex",
										flexWrap: "wrap",
										alignItems: "center",
										gap: "10px",
									}}
									variant="outlined"
								>
									<Typography
										sx={{ fontWeight: "bold", m: 0, p: 0, minWidth: "150px" }}
										variant="subtitle1"
										gutterBottom
									>
										{category} :
									</Typography>
									{renderCheckboxes(category)}
								</Paper>
							)
					)}
				</FormGroup>
			</FormControl>
		)
	);
};

export default TeamPermissionModal;
