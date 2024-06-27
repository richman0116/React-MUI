import React from "react";
import { CircularProgress } from "@mui/material";

const ProgressLoader = () => {
	return (
		<div
			style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}
		>
			<CircularProgress color="error" />
		</div>
	);
};

export default ProgressLoader;
