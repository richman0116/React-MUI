import React, { useState } from "react";
import { Badge, Box, Button, Card, CardContent, IconButton, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import styles from "./Notification.module.scss";
import { useGetNotificationsQuery } from "../../services/notifications";

const Notification = () => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const { data: notificationRes } = useGetNotificationsQuery();
	const menuItemOpen = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton aria-label="cart" sx={{ color: "cornflowerblue" }}>
				<Badge
					badgeContent={
						notificationRes && notificationRes.notifications && notificationRes.notifications.length
							? notificationRes.notifications.length
							: 0
					}
					color="secondary"
					onClick={handleClick}
					overlap="circular"
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
				>
					<NotificationsIcon />
				</Badge>
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				id="notification-menu"
				open={menuItemOpen}
				className={styles.notificationMenu}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				{notificationRes &&
					notificationRes.notifications.map((notification) => {
						<MenuItem onClick={handleClose}>
							<Card sx={{ backgroundColor: "lavendar" }}>
								<CardContent>
									<p className={styles.notificationCard}>{notification.note}</p>
								</CardContent>
							</Card>
						</MenuItem>;
					})}
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
						marginRight: "15px",
					}}
				>
					{notificationRes &&
					notificationRes.notifications &&
					notificationRes.notifications.length > 3 ? (
						<Button onClick={handleClose}>Show More</Button>
					) : (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								paddingLeft: "10px",
							}}
						>
							No notification found!
						</Box>
					)}
				</Box>
			</Menu>
		</div>
	);
};

export default Notification;
