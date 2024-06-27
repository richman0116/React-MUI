import React from "react";
import {
	Button,
	Dialog,
	DialogContent,
	CircularProgress,
	DialogTitle,
	DialogActions,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import "../styles/MUIModal.module.scss";
import { COLORS } from "../shared/colors";
import { useConfirm } from "material-ui-confirm";

const MUIModal = ({
	showModal = false,
	setShowModal,
	modalTitle = "",
	closeBtnText = "Close",
	secondaryBtnText = "Ok",
	handleClickSecondaryBtn,
	modalBodyComponent,
	isSubmit = false,
	secondaryBtnDisabled = false,
	secondaryBtnLoading = false,
	modalClassName = "default-modal-width",
	titleTextColor = "white",
	titleBgColor = COLORS.CRAYOLA,
	isFooter = true,
	contentClass = "",
	isConfirm = null,
}) => {
	const confirm = useConfirm();
	const handleClose = () => {
		if (isConfirm) {
			confirm({
				title: isConfirm.title,
				description: isConfirm.description,
			})
				.then(async () => {
					setShowModal(false);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			setShowModal(false);
		}
	};

	const handleSecondaryBtnClick = () => {
		if (handleClickSecondaryBtn) {
			handleClickSecondaryBtn();
		}
	};

	return (
		<Dialog
			open={showModal}
			onClose={handleClose}
			aria-labelledby="modal-title"
			className={modalClassName}
			fullWidth
			scroll="body"
			PaperProps={{
				style: { borderRadius: 10 },
			}}
		>
			<DialogTitle
				style={{
					display: "flex",
					justifyContent: "space-between",
					backgroundColor: titleBgColor,
					color: titleTextColor,
					padding: "14px 24px",
				}}
			>
				<span>{modalTitle}</span>
				<Button aria-label="Close" onClick={handleClose}>
					<CloseIcon style={{ color: "white" }} />
				</Button>
			</DialogTitle>
			<DialogContent className={contentClass} dividers style={{ background: COLORS.GHOST_WHITE }}>
				<div className={`modal-body ${contentClass}`}>{modalBodyComponent}</div>
			</DialogContent>
			{isFooter && (
				<DialogActions style={{ padding: "16px", background: COLORS.GHOST_WHITE }}>
					<Button variant="outlined" onClick={handleClose} color="secondary">
						{closeBtnText}
					</Button>
					<Button
						type={isSubmit ? "submit" : undefined}
						variant="contained"
						onClick={handleSecondaryBtnClick}
						disabled={secondaryBtnDisabled}
					>
						{secondaryBtnDisabled && secondaryBtnLoading ? (
							<CircularProgress size={20} style={{ marginRight: "4px" }} />
						) : null}
						{secondaryBtnText}
					</Button>
				</DialogActions>
			)}
		</Dialog>
	);
};

export default MUIModal;
