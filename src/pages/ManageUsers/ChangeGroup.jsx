import { CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useUpdateGroupMemberMutation } from "../../services/group";
import styles from "./ManageUsers.module.scss";
import { toast } from "react-toastify";
import { useGetUsersQuery } from "../../services/user";

const ChangeGroup = ({ user, getGroupData }) => {
	const [userGroupUpdate, { isLoading }] = useUpdateGroupMemberMutation();
	const { refetch, isFetching } = useGetUsersQuery();
	const [loading, setLoading] = useState(false);
	const [groupTitle, setGroupTitle] = useState(null);

	useEffect(() => {
		if (getGroupData) {
			const titles =
				getGroupData?.groups.map((group) => {
					return { id: group._id, title: group.title };
				}) || null;
			setGroupTitle(titles);
		}
	}, [getGroupData]);
	const handleChange = async (event, user) => {
		setLoading(true);
		const { value } = event.target;
		try {
			if (value) {
				await userGroupUpdate({ id: value, payload: { userId: user._id } });
				setLoading(false);
				toast("Member updated with this group!");
				await refetch();
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
			setLoading(false);
		}
	};

	return (
		<FormControl
			sx={{
				width: "260px",
				margin: "10px 2px 5px 2px",
				display: "grid",
				gridTemplateColumns: "1fr",
				height: "40px",
				position: "relative",
			}}
		>
			<Select
				className={styles.addPadding}
				value={user && user.group && user.group._id ? user.group._id : "no-group"}
				onChange={(e) => {
					handleChange(e, user);
				}}
				disabled={
					(user && user.group && user.group.key && user.group.key === "super-admin") ||
					loading ||
					isFetching ||
					isLoading
				}
			>
				<MenuItem disabled value={user.group._id}>
					<em>{user.group.title}</em>
				</MenuItem>
				{groupTitle &&
					groupTitle.map((group) => (
						<MenuItem key={group.id} value={group.id}>
							{group.title}
						</MenuItem>
					))}
			</Select>
			{loading && (
				<CircularProgress sx={{ position: "absolute", top: "10px", right: "-35px" }} size={24} />
			)}
		</FormControl>
	);
};

export default ChangeGroup;
