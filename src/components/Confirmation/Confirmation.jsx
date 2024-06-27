import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import { COLORS } from "../../shared/colors";

const Confirmation = ({
	open,
	setOpen,
	handlePrimaryText = "Confirm",
	handleSecondaryText = "Cancel",
	handleSecondaryBtnClick,
	textComponent = "Confirming this action will result in the permanent deletion of this data from everywhere. Do you wish to proceed?",
	title = "Confirmation Required!",
	actionBtnLoading = false,
	handleClickClose = () => {},
}) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	const handleClose = () => {
		setOpen(false);
		handleClickClose();
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={handleClose}
			aria-labelledby="responsive-dialog-title"
			PaperProps={{
				style: { borderRadius: 10 },
			}}
		>
			<DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">{textComponent}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>{handleSecondaryText}</Button>
				<Button disabled={actionBtnLoading} onClick={handleSecondaryBtnClick}>
					{actionBtnLoading && <CircularProgress style={{ marginRight: "4px" }} />}
					{handlePrimaryText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Confirmation;
