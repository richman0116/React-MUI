import React from "react";
import { Tooltip, Button, Chip } from "@mui/material";
import { useSelector } from "react-redux";

const LoadFilterButton = ({ title, startIcon, btnText, activeKey, length, onClick }) => {
	const loadsActiveFilter = useSelector((state) => state.global.brokerActiveFilter);

	return (
		<Tooltip arrow title={title}>
			<Button
				variant={loadsActiveFilter === activeKey ? "contained" : "outlined"}
				startIcon={startIcon}
				onClick={onClick}
			>
				{btnText}
				<Chip
					sx={
						loadsActiveFilter === activeKey ? { color: "white", border: "1px solid #FFFFFF" } : {}
					}
					style={{ marginLeft: "10px" }}
					size="small"
					label={length}
					variant={loadsActiveFilter === activeKey ? "contained" : "outlined"}
				/>
			</Button>
		</Tooltip>
	);
};

export default LoadFilterButton;
