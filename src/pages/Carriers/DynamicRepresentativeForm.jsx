import React, { useState, useEffect } from "react";
import { Button, IconButton, TextField, Grid, Box, Alert, Rating } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { COLORS } from "../../shared/colors";
const styles = {
	deleteButton: {
		borderRadius: "50%",
		backgroundColor: "red",
		color: "white",
		boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
	},
};

const DynamicRepresentativeForm = ({ data, setValue }) => {
	const [representatives, setRepresentatives] = useState(data);
	const [phoneErrors, setPhoneErrors] = useState([]);

	const handleRepresentativeChange = (index, field, value) => {
		const updatedRepresentatives = [...representatives];
		updatedRepresentatives[index][field] = value;
		setRepresentatives(updatedRepresentatives);

		// Validate phone number
		if (field === "phone") {
			const errors = [...phoneErrors];
			if (!value) {
				errors[index] = "Phone number is required";
			} else {
				errors[index] = "";
			}
			setPhoneErrors(errors);
		}
	};

	useEffect(() => {
		setValue("representatives", representatives, { shouldValidate: true });
	}, [representatives]);

	// const handleAddressChange = (index, field, value) => {
	// 	const updatedRepresentatives = [...representatives];
	// 	updatedRepresentatives[index].address[field] = value;
	// 	setRepresentatives(updatedRepresentatives);
	// };

	const addRepresentative = () => {
		const newRepresentative = {
			name: "",
			phone: "",
			email: "",
			rating: 3,
		};
		setRepresentatives([...representatives, newRepresentative]);
		setPhoneErrors([...phoneErrors, ""]);
	};

	const removeRepresentative = (index) => {
		const updatedRepresentatives = [...representatives];
		updatedRepresentatives.splice(index, 1);
		setRepresentatives(updatedRepresentatives);
	};

	return (
		<div>
			{representatives.length <= 0 && (
				<Alert style={{ marginBottom: "16px", color: COLORS.SECONDARY }} severity="info">
					Empty representative!
				</Alert>
			)}
			{representatives.map((representative, index) => (
				<Box key={index} sx={{ marginBottom: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} md>
							<TextField
								label="Name"
								variant="outlined"
								size="small"
								value={representative.name}
								onChange={(e) => handleRepresentativeChange(index, "name", e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md>
							<TextField
								label="Email"
								variant="outlined"
								size="small"
								value={representative.email}
								onChange={(e) => handleRepresentativeChange(index, "email", e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md>
							<TextField
								label="Phone*"
								variant="outlined"
								size="small"
								value={representative.phone}
								onChange={(e) => handleRepresentativeChange(index, "phone", e.target.value)}
								fullWidth
								error={!!phoneErrors[index]}
							/>
						</Grid>

						<Grid item xs={12} md={2} style={{ display: "flex", alignItems: "center" }}>
							<Rating
								name="no-value"
								value={representative.rating}
								onChange={(e, newValue) => {
									handleRepresentativeChange(index, "rating", e.target.value);
								}}
							/>
						</Grid>

						<Grid item xs={12} md={0.5}>
							<IconButton onClick={() => removeRepresentative(index)} aria-label="Delete">
								<DeleteIcon style={{ color: COLORS.INTERNATIONAL_ORANGE }} />
							</IconButton>
						</Grid>
					</Grid>
				</Box>
			))}
			<Button
				style={{ textTransform: "capitalize" }}
				size="small"
				variant="contained"
				startIcon={<AddIcon />}
				onClick={addRepresentative}
				color="secondary"
			>
				Add Representative
			</Button>
		</div>
	);
};

export default DynamicRepresentativeForm;
