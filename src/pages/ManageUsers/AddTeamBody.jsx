import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faDriversLicense } from "@fortawesome/free-regular-svg-icons";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddTeamBody = ({ register, errors, currentData = null, setValue, watch }) => {
	const [teamValue, setTeamValue] = useState("team");

	const handleChange = (event, newValue) => {
		setTeamValue(newValue);
	};
	const [hiddenAlerts, setHiddenAlerts] = useState([]);
	const onClose = (alertId) => {
		const hiddenAlertsUpdated = [...hiddenAlerts, alertId];
		setHiddenAlerts(hiddenAlertsUpdated);
	};

	const shouldShowAlert = (alertId) => hiddenAlerts.indexOf(alertId) === -1;

	return (
		<div>
			<p>
				Invite your teammates by adding their emails and assign their roles below. Learn more about
				our roles and permission settings here.
			</p>
			<Box sx={{ width: "100%", typography: "body1" }}>
				{/* <TabContext value={isDriver ? "drivers" : "team"}> */}
				<TabContext value={teamValue}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<TabList
							onChange={handleChange}
							aria-label="lab API tabs example"
							variant="fullWidth"
							indicatorColor="primary"
							textColor="primary"
						>
							<Tab
								label={
									<div>
										<FontAwesomeIcon icon={faUserGroup} className="me-2" /> Invite Members
									</div>
								}
								value="team"
							/>
							<Tab
								label={
									<div>
										<FontAwesomeIcon icon={faDriversLicense} className="me-2" /> Invite Drivers
									</div>
								}
								value="drivers"
							/>
						</TabList>
					</Box>
					<TabPanel value="team" className="py-4">
						{/* <form> */}
						<TextField
							fullWidth
							label="Invite Members via email"
							variant="outlined"
							type="email"
							{...register("recipentMail", { required: true })}
							name="recipentMail"
							placeholder="name@example.com"
							sx={{ marginBottom: "10px" }}
						/>
						<span>Add 1 email at a time.</span>
						{/* </form> */}
					</TabPanel>
					<TabPanel value="drivers" className="py-4">
						<Alert
							variant="outlined"
							severity="info"
							open={shouldShowAlert("secondary")}
							onClose={() => onClose("secondary")}
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={() => onClose("secondary")}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							}
						>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<div>
									<FontAwesomeIcon icon={faBullhorn} className="me-1" />
									<strong>New!</strong> Drivers can now be invited to driver mobile via their phone
									number.
								</div>
							</div>
						</Alert>
						{/* <form> */}
						<TextField
							fullWidth
							label="Invite drivers via email"
							variant="outlined"
							type="email"
							{...register("recipentMail", { required: true })}
							name="recipentMail"
							placeholder="name@example.com"
							sx={{ marginBottom: "10px", marginTop: "10px" }}
						/>
						<span>Add 1 email at a time.</span>
						{/* </form> */}
					</TabPanel>
				</TabContext>
			</Box>
		</div>
	);
};

export default AddTeamBody;
