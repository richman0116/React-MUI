import * as React from "react";
import { useGetUsersQuery } from "../../services/user";
import { Autocomplete, LinearProgress, Stack, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";

const AddUserSelectModal = ({ register, errors, memberData, setValue }) => {
	const { data: users, isLoading, isFetching } = useGetUsersQuery();
	const [selectedOptions, setSelectedOptions] = React.useState([]);

	React.useEffect(() => {
		if (users && users.users && memberData) {
			const membersIds = memberData.map((m) => m._id);
			const selectedUser = users.users.filter((user) => membersIds.includes(user._id));
			setSelectedOptions(selectedUser);
			setValue("members", memberData);
		}
	}, [users]);

	const handleChange = (event, option) => {
		setSelectedOptions(option);
		setValue(
			"members",
			option.map((op) => op._id),
			{ shouldValidate: true }
		);
	};

	return (
		<div>
			{isLoading || isFetching ? (
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
					sx={{ width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr" }}
				>
					<Autocomplete
						id="demo-multiple-chip"
						multiple
						{...register("members", {
							validate: (value) => {
								if (Array.isArray(value) && value.length === 0) {
									return "Please select at least one member";
								}
								return true;
							},
						})}
						value={selectedOptions}
						getOptionLabel={(option) => (typeof option === "string" ? option : option.email)}
						onChange={handleChange}
						options={users && users.users ? users.users : []}
						filterOptions={(options, state) => {
							return options.filter((option) => {
								if (state.inputValue === "") {
									return true;
								}
								return option.email.toLowerCase().includes(state.inputValue.toLowerCase());
							});
						}}
						noOptionsText={"Not found!"}
						renderInput={(params) => (
							<TextField
								{...params}
								label={"Add member"}
								variant="outlined"
								fullWidth
								size="small"
							/>
						)}
					/>
					{errors && errors.members && <p style={{ color: "red" }}>{errors.members.message}</p>}
				</FormControl>
			)}
		</div>
	);
};

export default AddUserSelectModal;
