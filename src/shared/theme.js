/* eslint-disable indent */
import { createTheme } from "@mui/material/styles";
import { COLORS } from "./colors";

export const theme = createTheme({
	palette: {
		mode: "light",
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: ({ ownerState }) => ({
					...(ownerState.variant === "contained" &&
						ownerState.color === "primary" && {
							backgroundColor: COLORS.PRIMARY,
							color: "white",
						}),
					...(ownerState.variant === "contained" &&
						ownerState.color === "secondary" && {
							backgroundColor: COLORS.SECONDARY,
							color: "white",
							"&:hover": {
								backgroundColor: COLORS.ARSENIC,
							},
						}),
					...(ownerState.variant === "outlined" &&
						ownerState.color === "secondary" && {
							borderColor: COLORS.METALIC_SILVER,
							color: COLORS.SECONDARY,
							"&:hover": {
								backgroundColor: "whitesmoke",
								borderColor: COLORS.SPANISH_GRAY,
							},
						}),
				}),
			},
		},
	},
});
