import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { COLORS } from "../../shared/colors";

const AppDrawer = ({
	position = "right",
	open,
	onClose,
	width = 250,
	backgroundColor = COLORS.GHOST_WHITE,
	children,
}) => {
	return (
		<div>
			<React.Fragment>
				<Drawer anchor={position} open={open} onClose={() => onClose(position, false)}>
					<Box
						sx={{
							width: position === "top" || position === "bottom" ? "auto" : width,
							height: "100%",
							background: backgroundColor,
						}}
						role="presentation"
					>
						<div style={{ marginTop: 64 }}>{children}</div>
					</Box>
				</Drawer>
			</React.Fragment>
		</div>
	);
};

export default AppDrawer;
