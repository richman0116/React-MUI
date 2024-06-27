import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";

const BackBtn = () => {
	const navigate = useNavigate();
	return (
		<IconButton
			aria-label="Back"
			onClick={() => navigate(-1)}
			style={{
				display: "flex",
				alignItems: "center",
				gap: "5px",
				color: "black",
				fontWeight: 500,
				fontSize: "16px",
				backgroundColor: "#f2f2f2",
				borderRadius: "8px",
				padding: "8px 12px",
				boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
				cursor: "pointer",
				transition: "background-color 0.2s, transform 0.2s",
				marginBottom: "10px",
			}}
		>
			<ArrowBackIcon style={{ color: "black" }} />
			Back
		</IconButton>
	);
};

export default BackBtn;
