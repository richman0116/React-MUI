import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../services/user";
import ROUTES from "../../routes";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { COLORS } from "../../shared/colors";
import loginBg from "../../assets/images/login-bg.jpg";
import { toast } from "react-toastify";
import { handleError } from "../../utils/errorhandle";

const ResetPassword = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const token = query.get("token");
	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	const handleSubmission = async (formData) => {
		const { newPassword } = formData;

		try {
			// Assuming resetPassword returns a promise and handles the API call
			const res = await resetPassword({ newPassword, token });
			if (res.error || !res.data.success) {
				const errorMsg = handleError(res);
				toast.error(errorMsg);
			} else {
				const data = res.data;
				toast.success(data.message);
				navigate(ROUTES.PATHS.LOGIN);
			}
		} catch (error) {
			// Handle errors from the API call or network issues
			const errorResponse = error.response;
			const errorMessage =
				errorResponse && errorResponse.data && typeof errorResponse.data.message === "object"
					? errorResponse.data.message.message
					: errorResponse.data.message || "Something went wrong, please try again.";
			toast.error(errorMessage);
		}
	};

	return (
		<div
			style={{
				backgroundImage: `url(${loginBg})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "top",
			}}
		>
			<Grid container direction="column" justifyContent="center" alignItems="center" height="100vh">
				<Box mb={3}></Box>
				<Card
					style={{
						border: "0.0625rem solid  #d1d7e0",
						boxShadow: "0 2px 18px rgba(0, 0, 0, 0.02)",
						borderRadius: " 0.5rem",
						marginTop: "40px",
					}}
					elevation={0}
				>
					<CardContent sx={{ minWidth: 378, padding: "30px 48px" }}>
						<Box mb={2}>
							<Typography sx={{ fontSize: 28 }} align="center" color={COLORS.SECONDARY}>
								Reset Password
							</Typography>
							<Typography sx={{ fontSize: 16, color: COLORS.INDEPENDENCE }} align="center">
								Put the the new password here
							</Typography>
						</Box>
						<form>
							<div style={{ margin: "20px 0" }}>
								<Typography variant="body2" mb={0.5}>
									New Password
								</Typography>
								<TextField
									{...register("newPassword", { required: true })}
									error={errors.newPassword}
									id="newPassword"
									type="password"
									variant="filled"
									size="small"
									fullWidth
									helperText={errors.newPassword && "Please enter new password"}
									sx={{
										"& .MuiFilledInput-root": {
											background: COLORS.BRIGHT_GRAY,
										},
									}}
									InputProps={{ disableUnderline: true }}
								/>
							</div>

							<Box mt={2.5} mb={2}>
								<Button
									variant="contained"
									style={{ backgroundColor: COLORS.SECONDARY }}
									fullWidth
									type="sent"
									onClick={handleSubmit(handleSubmission)}
								>
									{isLoading ? "Loading…" : "Update"}
								</Button>
							</Box>
						</form>
						{/* <Box mt={2.5} mb={2} sx={{ textAlign: "center" }}>
							Don't have an account? <Link to="/register">Sign up</Link>
						</Box> */}
					</CardContent>
				</Card>
			</Grid>
		</div>
	);
};

export default ResetPassword;
