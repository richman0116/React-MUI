import React from "react";
import { Box, Skeleton, Table, TableBody, TableCell, TableRow } from "@mui/material";
import LoadingImg from "../../assets/images/loading.gif";

const Loader = ({ loaderType = "image" }) => {
	if (loaderType === "image") {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
				<img
					style={{ width: "100px", height: "auto" }}
					src={LoadingImg}
					srcSet={LoadingImg}
					alt="loading"
				/>
			</Box>
		);
	} else {
		return (
			<Table>
				<TableBody>
					{[...Array(10)].map((row, rowIndex) => (
						<TableRow style={{ width: "100vw" }} key={rowIndex}>
							{[...Array(10)].map((cell, cellIndex) => (
								<TableCell key={cellIndex} component="td">
									<Skeleton variant="rectangular" animation="wave" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
};

export default Loader;
