import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button, Tooltip } from "@mui/material";
import { Groups2, Settings } from "@mui/icons-material";

function createData(title, members = [], _id, accessFeatures) {
	const memberLength = members.length;
	const { totalLoads, totalProfit } = members.reduce(
		(acc, member) => {
			const loadsCount = member.loads.length;

			const profit = member.loads.reduce((total, load) => {
				// Parse and default customerRate and driverRate using ternary operator to handle NaN
				const customerRate = Number(load.customerRate) ? Number(load.customerRate) : 0;
				const driverRate = Number(load.driverRate) ? Number(load.driverRate) : 0;

				// Compute and return the updated total profit
				return total + (customerRate - driverRate);
			}, 0);

			return {
				totalLoads: acc.totalLoads + loadsCount,
				totalProfit: acc.totalProfit + profit,
			};
		},
		{ totalLoads: 0, totalProfit: 0 }
	);

	const users =
		members.length && members[0]._id
			? members.map((member) => ({
					_id: member._id,
					name: member.name,
					email: member.email,
					group: member.group[0].title,
					loadsCount: member.loads.length || 0,
					profit: member.loads.reduce((total, load) => {
						// Check and convert customerRate, set to 0 if undefined, null, or NaN
						const customerRate = Number(load.customerRate) || 0;

						// Check and convert driverRate, set to 0 if undefined, null, or NaN
						const driverRate = Number(load.driverRate) || 0;

						// Calculate profit by subtracting driverRate from customerRate and adding to total
						return total + (customerRate - driverRate);
					}, 0),
			  }))
			: [];

	return {
		_id: _id,
		title,
		accessFeatures,
		memberLength,
		totalLoads,
		totalProfit,
		users,
	};
}

function Row(props) {
	const {
		row,
		setShowPermisstionModal,
		setshowUserMembersModal,
		HandelerTeamMemberEdit,
		reset,
		setShowModal,
		setBranch,
	} = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.title}
				</TableCell>
				<TableCell align="right">{row.memberLength}</TableCell>
				<TableCell align="right">{row.totalLoads}</TableCell>
				<TableCell align="right">
					{row.totalProfit < 0 ? `-$${Math.abs(row.totalProfit)}` : `$${row.totalProfit}`}
				</TableCell>

				<TableCell align="right">
					<div>
						<Tooltip title="Manage Team Members">
							<Button
								variant="outlined"
								sx={{ mr: 1 }}
								size="small"
								style={{ color: "darkBlue", alignItems: "center" }}
								onClick={() => {
									setShowPermisstionModal(false);
									setshowUserMembersModal(true);
									HandelerTeamMemberEdit(row);
									reset();
									setShowModal(true);
								}}
								startIcon={<Groups2 />}
							>
								Members
							</Button>
						</Tooltip>
						<Tooltip title="Permissions">
							<Button
								variant="outlined"
								size="small"
								onClick={() => {
									setshowUserMembersModal(false);
									setShowPermisstionModal(true);
									setBranch(row);
								}}
								startIcon={<Settings />}
							>
								Permission
							</Button>
						</Tooltip>
					</div>
				</TableCell>
			</TableRow>
			<TableRow sx={{ backgroundColor: "whitesmoke" }}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography sx={{ fontSize: "14px" }} variant="h6" gutterBottom component="div">
								Team Members:
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Email</TableCell>
										<TableCell align="center">Group/Role</TableCell>
										<TableCell align="center">Loads Count</TableCell>
										<TableCell align="left">Profit ($)</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.users.map((user) => (
										<TableRow
											key={user.email}
											sx={{ "&:last-child > *": { borderBottom: "unset" } }}
										>
											<TableCell component="th" scope="row">
												{user.name}
											</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell align="center">{user.group}</TableCell>
											<TableCell align="center">{user.loadsCount}</TableCell>
											<TableCell align="left">
												{user.profit < 0 ? `-$${Math.abs(user.profit)}` : `$${user.profit}`}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

Row.propTypes = {
	row: PropTypes.shape({
		title: PropTypes.number.isRequired,
		members: PropTypes.number.isRequired,
		history: PropTypes.arrayOf(
			PropTypes.shape({
				amount: PropTypes.number.isRequired,
				customerId: PropTypes.string.isRequired,
				date: PropTypes.string.isRequired,
			})
		).isRequired,
	}).isRequired,
};

export default function CollapsibleTable({
	data,
	setShowPermisstionModal,
	setshowUserMembersModal,
	HandelerTeamMemberEdit,
	reset,
	setShowModal,
	setBranch,
}) {
	const rows = data.map(({ title, members, _id, accessFeatures }) =>
		createData(title, members, _id, accessFeatures)
	);
	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Team Name </TableCell>
						<TableCell align="right">Total Members</TableCell>
						<TableCell align="right">Total Loads</TableCell>
						<TableCell align="right">Total profit ($)</TableCell>
						<TableCell align="right">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<Row
							key={row.name}
							row={row}
							setShowPermisstionModal={setShowPermisstionModal}
							setshowUserMembersModal={setshowUserMembersModal}
							HandelerTeamMemberEdit={HandelerTeamMemberEdit}
							reset={reset}
							setShowModal={setShowModal}
							setBranch={setBranch}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
