import {
	FormControl,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../../components/Loader/Loader";
import { useLazyGetUserLoadByMonthUserQuery } from "../../../services/notifications";
import ProgressLoader from "../../../components/ProgressLoader/ProgressLoader";

const ProfitByUserTable = ({ users, isLoading }) => {
	const [personId, setPersonId] = React.useState([]);
	const [usersData, setUsersData] = React.useState([]);
	const [monthId, setMonthId] = React.useState(2024);
	const [triggerUserMonth, { data: monthlyData, isFetching }] =
		useLazyGetUserLoadByMonthUserQuery();

	useEffect(() => {
		if (users.users) {
			const filteredUsers = users.users.filter(
				(user) => user.group.key !== "tracking" && user.group.key !== "accounting"
			);
			setUsersData(filteredUsers);
			if (filteredUsers && filteredUsers.length) {
				setPersonId(filteredUsers[0]._id);
				triggerUserMonth(`?userIds=${filteredUsers[0]._id}`);
			}
		}
	}, [users]);

	const handleChange = (event) => {
		// const {	target: { value },} = event;
		setPersonId(event.target.value);
		triggerUserMonth(`?userIds=${event.target.value}`);
	};

	const handleChangeMonth = (event) => {
		setMonthId(event.target.value);
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div>
			<TableContainer component={Paper}>
				<Table size="small" aria-label="a dense table">
					<TableHead>
						<TableRow sx={{ borderBottom: "3px solid #383C4D" }}>
							<TableCell colSpan={3}>
								<FormControl sx={{ m: 1, width: 250 }} size="small">
									<InputLabel id="demo-multiple-name-label">User</InputLabel>
									<Select
										labelId="demo-multiple-name-label"
										id="demo-multiple-name"
										// multiple
										value={personId}
										onChange={handleChange}
										input={<OutlinedInput label="Name" />}
										// MenuProps={MenuProps}
									>
										{usersData?.map((user) => (
											<MenuItem key={user._id} value={user._id}>
												{user.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</TableCell>
							<TableCell align="center">
								{/* <FormControl sx={{ m: 1 }} size="small">
									<InputLabel id="demo-multiple-name-label">Year</InputLabel>
									<Select
										labelId="demo-multiple-name-label"
										id="demo-multiple-name"
										// multiple
										value={monthId}
										onChange={handleChangeMonth}
										input={<OutlinedInput label="Name" />}
										// MenuProps={MenuProps}
									>
										<MenuItem value="2024">2024</MenuItem>
									</Select>
								</FormControl> */}
							</TableCell>
							<TableCell align="center"></TableCell>
						</TableRow>
						<TableRow sx={{ backgroundColor: "#323A46", color: "white" }}>
							<TableCell sx={{ color: "white" }}>Month</TableCell>
							<TableCell sx={{ color: "white" }} align="center">
								Load Count
							</TableCell>
							<TableCell sx={{ color: "white" }} align="center">
								Profit
							</TableCell>
							<TableCell sx={{ color: "white" }} align="center">
								Avg/Load
							</TableCell>
							<TableCell sx={{ color: "white" }} align="right">
								Avg. Daily/Month
							</TableCell>
							<TableCell align="center"></TableCell>
						</TableRow>
					</TableHead>
					{isFetching ? (
						<ProgressLoader />
					) : (
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
									<TableCell align="center">${mon.totalProfit.toFixed(2)}</TableCell>
									<TableCell align="center">{mon.avgProfitPerMonth.toFixed(2)}</TableCell>
									<TableCell align="right">123</TableCell>
								</TableRow>
							))}
						</TableBody>
					)}
				</Table>
			</TableContainer>
		</div>
	);
};

export default ProfitByUserTable;
