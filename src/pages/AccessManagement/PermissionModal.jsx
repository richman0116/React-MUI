import React from "react";
import styles from "../Assets/Assets.module.scss";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const PermissionModal = () => {
	const [checked, setChecked] = React.useState([0]);

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	return (
		<div className={styles.addAssetArea}>
			<List sx={{ width: "100%", bgcolor: "background.paper" }}>
				{["Load", "Asset", "Carrier", "User", "Accounting"].map((value, index) => {
					const labelId = `checkbox-list-label-${index + 1}`;

					return (
						<ListItem
							key={value}
							// secondaryAction={
							// 	<IconButton edge="end" aria-label="comments">
							// 		<CommentIcon />
							// 	</IconButton>
							// }
							disablePadding
						>
							<ListItemButton role={undefined} onClick={handleToggle(value)} dense>
								<ListItemIcon>
									<Checkbox
										edge="start"
										checked={checked.indexOf(value) !== -1}
										tabIndex={-1}
										disableRipple
										inputProps={{ "aria-labelledby": labelId }}
									/>
								</ListItemIcon>
								<ListItemText id={labelId} primary={value} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</div>
	);
};

export default PermissionModal;
