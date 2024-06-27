import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			height="100vh"
		>
			<Typography variant="h1" style={{ color: "#3f51b5" }}>
				404
			</Typography>
			<Typography variant="h5" style={{ color: "#3f51b5" }}>
				Oops! Page Not Found..
			</Typography>
			<Typography variant="body1" style={{ marginBottom: 20 }}>
				The page you are looking for might have been removed or doesn't exist.
			</Typography>
		</Box>
	);
};

export default NotFound;
