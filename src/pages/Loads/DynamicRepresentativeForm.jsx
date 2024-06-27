import React, { useState, useEffect } from "react";
import { Button, IconButton, TextField, Grid, Box } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
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

	const handleRepresentativeChange = (index, field, value) => {
		const updatedRepresentatives = [...representatives];
		updatedRepresentatives[index][field] = value;
		setRepresentatives(updatedRepresentatives);
	};

	useEffect(() => {
		setValue("representatives", representatives, { shouldValidate: true });
	}, [representatives]);

	const handleAddressChange = (index, field, value) => {
		const updatedRepresentatives = [...representatives];
		updatedRepresentatives[index].address[field] = value;
		setRepresentatives(updatedRepresentatives);
	};

	const addRepresentative = () => {
		const newRepresentative = {
			name: "",
			phone: "",
			email: "",
			address: { city: "", state: "", zipcode: "" },
		};
		setRepresentatives([...representatives, newRepresentative]);
	};

	const removeRepresentative = (index) => {
		const updatedRepresentatives = [...representatives];
		updatedRepresentatives.splice(index, 1);
		setRepresentatives(updatedRepresentatives);
	};

	return (
		<div>
			{representatives.map((representative, index) => (
				<Box key={index} sx={{ marginBottom: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={2}>
							<TextField
								label="Name"
								variant="outlined"
								size="small"
								value={representative.name}
								onChange={(e) => handleRepresentativeChange(index, "name", e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<TextField
								label="Phone"
								variant="outlined"
								size="small"
								value={representative.phone}
								onChange={(e) => handleRepresentativeChange(index, "phone", e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<TextField
								label="Email"
								variant="outlined"
								size="small"
								value={representative.email}
								onChange={(e) => handleRepresentativeChange(index, "email", e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<TextField
								label="City"
								variant="outlined"
								size="small"
								value={representative.address.city}
								onChange={(e) => handleAddressChange(index, "city", e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={1.5}>
							<TextField
								label="State"
								variant="outlined"
								size="small"
								value={representative.address.state}
								onChange={(e) => handleAddressChange(index, "state", e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={1.5}>
							<TextField
								label="Zip Code"
								variant="outlined"
								size="small"
								value={representative.address.zipcode}
								onChange={(e) => handleAddressChange(index, "zipcode", e.target.value)}
								fullWidth
							/>
						</Grid>

						<Grid item xs={12} md={0.5}>
							<IconButton
								style={styles.deleteButton}
								onClick={() => removeRepresentative(index)}
								aria-label="Delete"
							>
								<DeleteIcon />
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
			>
				Add Representative
			</Button>
		</div>
	);
};

export default DynamicRepresentativeForm;
