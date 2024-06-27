import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useGetUsersQuery } from "../../services/user";
import { LinearProgress, Stack } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			// width: 250,
		},
	},
};

function getStyles(name, personName, theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}
const ManageUsersModal = ({ register, errors, memberData, setValue }) => {
	const theme = useTheme();

	const { data: users, isLoading, refetch } = useGetUsersQuery();
	const userMail = users?.users.map((user) => user.email) || [];

	const [loading, setLoading] = React.useState(true);
	const [personNameLoading, setPersonNameLoading] = React.useState(true);
	const [personName, setPersonName] = React.useState([]);

	React.useEffect(() => {
		if (!isLoading) {
			setLoading(false);
		}
	}, [isLoading]);
	React.useEffect(() => {
		if (memberData?.length > 0) {
			const currentAllMembers = memberData.map((selectedId) => {
				const selectedUser = users?.users.find((user) => user._id === selectedId);
				return selectedUser ? selectedUser.email : null;
			});
			setPersonName(currentAllMembers);
		}
		setPersonNameLoading(false); // Set personName loading to false when done
	}, [memberData, users]);

	console.log(personName);

	const handleChange = (event) => {
		const { value } = event.target;
		setPersonName(value);

		const selectedUserIds = value.map((selectedEmail) => {
			const selectedUser = users?.users.find((user) => user.email === selectedEmail);
			return selectedUser ? selectedUser._id : null;
		});

		console.log(selectedUserIds);
		setValue("userIds", selectedUserIds);
	};

	return (
		<div>
			{loading || personNameLoading ? (
				<Stack
					sx={{
						width: "110px",
						color: "grey.500",
						textAlign: "center",
						margin: "0 auto",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<LinearProgress color="inherit" />
				</Stack>
			) : (
				<FormControl
					sx={{ width: "60%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr" }}
				>
					<InputLabel
						id="demo-multiple-chip-label"
						sx={{
							backgroundColor: "white",
							paddingRight: "5px",
						}}
					>
						Add Group Members
					</InputLabel>
					<Select
						labelId="demo-multiple-chip-label"
						id="demo-multiple-chip"
						multiple
						value={personName}
						onChange={handleChange}
						input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
						renderValue={(selected) => (
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
								{selected.map((value) => (
									<Chip key={value} label={value} />
								))}
							</Box>
						)}
						MenuProps={MenuProps}
					>
						{userMail &&
							userMail.map((email) => (
								<MenuItem key={email} value={email} style={getStyles(email, personName, theme)}>
									{email}
								</MenuItem>
							))}
					</Select>
				</FormControl>
			)}
		</div>
	);
};

export default ManageUsersModal;
