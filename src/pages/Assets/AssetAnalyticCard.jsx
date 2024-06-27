import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import globalUtils from "../../utils/globalUtils";
import styled from "styled-components";
import { Paper } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
	textAlign: "center",
	color: "#FFFFFF",
	height: 100,
	lineHeight: "60px",
}));

const AssetAnalyticCard = ({ status, val }) => {
	return (
		<Box>
			<Item
				elevation={8}
				sx={{
					textAlign: "center",
					backgroundColor: `${globalUtils.getAssetStatusColor(status)}`,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<Typography
					style={{
						fontSize: 17,
						color: "#FFFFFF",
					}}
				>
					{globalUtils.snakeCaseToCapitalize(status)}
				</Typography>
				<Typography component="div" variant="h6">
					<div>{val ? val : "0"}</div>
				</Typography>
			</Item>
		</Box>
	);
};

export default AssetAnalyticCard;
