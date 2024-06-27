import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, MenuItem, Alert, IconButton } from "@mui/material";
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

const EquipmentForm = ({ data, setValue, updateTotalUnits }) => {
	const [equipments, setEquipments] = useState(data);

	const categoryEquipment = [
		{ label: "Sprinter", value: "Sprinter" },
		{ label: "Boxtruck", value: "Boxtruck" },
		{ label: "FlatBed", value: "FlatBed" },
		{ label: "Reefer", value: "Reefer" },
		{ label: "Dryvan", value: "Dryvan" },
		{ label: "26ftBoxtruck", value: "26ftBoxtruck" },
	];

	const handleEquipmentChange = (index, field, value) => {
		const updatedEquipments = [...equipments];
		updatedEquipments[index][field] = value;
		setEquipments(updatedEquipments);
	};
	useEffect(() => {
		// Calculate the total number of units
		const totalUnits = equipments.reduce(
			(total, equipment) => total + parseInt(equipment.unit || 0),
			0
		);
		updateTotalUnits(totalUnits); // Update the totalUnits in the parent component
		setValue("equipments", equipments);
	}, [equipments]);

	const addEquipment = () => {
		const newEquipment = {
			equipment: "",
			unit: "",
		};
		setEquipments([...equipments, newEquipment]);
		console.log(equipments);
	};

	const removeEquipments = (index) => {
		const updatedEquipments = [...equipments];
		updatedEquipments.splice(index, 1);
		setEquipments(updatedEquipments);
		console.log(equipments);
	};

	return (
		<div>
			{equipments.length <= 0 && (
				<Alert style={{ marginBottom: "16px", color: COLORS.SECONDARY }} severity="info">
					Empty equipment!
				</Alert>
			)}
			{equipments.map((equipment, index) => (
				<Box key={index} sx={{ marginBottom: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} md>
							<TextField
								select
								required
								label="Equipment"
								variant="outlined"
								size="small"
								value={equipment.equipment}
								onChange={(e) => handleEquipmentChange(index, "equipment", e.target.value)}
								fullWidth
							>
								{categoryEquipment.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} md>
							<TextField
								label="Unit"
								variant="outlined"
								size="small"
								value={equipment.unit}
								onChange={(e) => handleEquipmentChange(index, "unit", e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={0.5}>
							<IconButton onClick={() => removeEquipments(index)} aria-label="Delete">
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
				onClick={addEquipment}
				color="secondary"
			>
				Add Equipment
			</Button>
		</div>
	);
};

export default EquipmentForm;
