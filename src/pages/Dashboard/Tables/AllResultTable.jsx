import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import React from "react";
import Loader from "../../../components/Loader/Loader";

const AllResultTable = ({ monthlyData, isLoading }) => {
	console.log(monthlyData);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div>
			<TableContainer component={Paper}>
				<Table size="small" aria-label="a dense table">
					<TableHead>
						<TableRow sx={{ borderBottom: "3px solid #383C4D", height: "69px" }}>
							<TableCell align="center" colSpan={4}>
								Result
							</TableCell>
							<TableCell align="center" colSpan={2}>
								{" "}
								Goal
							</TableCell>
						</TableRow>
						<TableRow sx={{ backgroundColor: "#323A46", color: "white" }}>
							{/* <TableCell></TableCell> */}
							<TableCell sx={{ color: "white" }}>Month</TableCell>
							<TableCell sx={{ color: "white" }} align="center">
								Loads
							</TableCell>
							<TableCell sx={{ color: "white" }} align="center">
								Profit
							</TableCell>
							<TableCell sx={{ color: "white" }} align="center">
								Avg. load
							</TableCell>
							<TableCell sx={{ color: "white" }} align="right">
								Goal
							</TableCell>
							<TableCell sx={{ color: "white" }} align="right">
								Left
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{monthlyData?.map((mon) => (
							<TableRow key={mon} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								<TableCell component="th" scope="row">
									{mon.month == 1
										? "Jan"
										: mon.month == 2
										? "Feb"
										: mon.month == 3
										? "Mar"
										: mon.month == 4
										? "Apr"
										: mon.month == 5
										? "May"
										: mon.month == 6
										? "Jun"
										: mon.month == 7
										? "Jul"
										: mon.month == 8
										? "Aug"
										: mon.month == 9
										? "Sep"
										: mon.month == 10
										? "Oct"
										: mon.month == 11
										? "Nov"
										: mon.month == 12
										? "Dec"
										: ""}
								</TableCell>
								<TableCell align="center">{mon.count}</TableCell>
								<TableCell align="center">{mon.totalProfit.toFixed(2)}</TableCell>
								<TableCell align="center">{mon.avgProfitPerMonth.toFixed(2)}</TableCell>
								<TableCell align="right">123</TableCell>
								<TableCell align="right">{(mon.totalProfit - 123).toFixed(2)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default AllResultTable;
