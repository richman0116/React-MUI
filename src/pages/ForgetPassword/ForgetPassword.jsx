import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForgetPasswordMutation } from "../../services/user";
import ROUTES from "../../routes";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { COLORS } from "../../shared/colors";
import loginBg from "../../assets/images/login-bg.jpg";
import { toast } from "react-toastify";

const ForgetPassword = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();
	const [forgetPassowrd, { isLoading }] = useForgetPasswordMutation();

	const handleSubmission = async (formData) => {
		const { email } = formData;
		const { data } = await forgetPassowrd({ email });
		if (data.success) {
			toast.success(data.message);
			navigate(ROUTES.PATHS.LOGIN);
		} else {
			toast.error(data.message);
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
				<Box mb={3}>
					{/* <img
						src={`/${APP}_Logo.png`}
						style={{
							width: "125px",
							height: "40px",
						}}
					/> */}
				</Box>
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
								Forgot Password? Don't worry.
							</Typography>
							<Typography sx={{ fontSize: 16, color: COLORS.INDEPENDENCE }} align="center">
								Put the email to reset password
							</Typography>
						</Box>
						<form>
							<div>
								<Typography variant="body2" mb={0.5}>
									Email
								</Typography>
								<TextField
									{...register("email", { required: true })}
									error={errors.email}
									id="filled-hidden-label-small"
									variant="filled"
									size="small"
									fullWidth
									helperText={errors.email && "Please input email"}
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
									type="submit"
									onClick={handleSubmit(handleSubmission)}
								>
									{isLoading ? "Loading…" : "Sent"}
								</Button>
							</Box>

							<Link to={ROUTES.PATHS.LOGIN}>
								<Typography sx={{ mt: 1, textAlign: "center" }} variant="body2">
									Back to login
								</Typography>
							</Link>
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

export default ForgetPassword;
