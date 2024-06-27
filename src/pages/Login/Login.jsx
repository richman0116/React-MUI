import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserLoginMutation } from "../../services/user";
import { APP } from "../../shared/constants";
import ROUTES from "../../routes";
import {
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	FormControlLabel,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { COLORS } from "../../shared/colors";
import loginBg from "../../assets/images/login-bg.jpg";
import { toast } from "react-toastify";
import { handleError } from "../../utils/errorhandle";
import { config } from "../../config";

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();
	const [loginUser, loginResult] = useUserLoginMutation();

	const handleLogin = async (loginData) => {
		try {
			const { email, password } = loginData;
			const res = await loginUser({ email, password });
			if (res.error || !res.data.success) {
				const errorMsg = handleError(res);
				toast.error(errorMsg);
			} else {
				const data = res.data;
				navigate(ROUTES.PATHS.HOME);
				localStorage.setItem(config.accessTokenName, data.token);
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
								Log In
							</Typography>
							<Typography sx={{ fontSize: 16, color: COLORS.INDEPENDENCE }} align="center">
								It's nice to see you again
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
							<div style={{ margin: "20px 0" }}>
								<Typography variant="body2" mb={0.5}>
									Password
								</Typography>
								<TextField
									{...register("password", { required: true })}
									error={errors.password}
									id="password"
									type="password"
									variant="filled"
									size="small"
									fullWidth
									helperText={errors.password && "Please enter password"}
									sx={{
										"& .MuiFilledInput-root": {
											background: COLORS.BRIGHT_GRAY,
										},
									}}
									InputProps={{ disableUnderline: true }}
								/>
							</div>
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<FormControlLabel
									style={{ fontSize: "14px" }}
									control={<Checkbox size="small" />}
									label={
										<Box component="div" fontSize={15}>
											Remember me
										</Box>
									}
								/>
								<Link to={ROUTES.PATHS.FORGOT_PASS}>
									<Typography variant="body2">Forgot password?</Typography>
								</Link>
							</Box>
							<Box mt={2.5} mb={2}>
								<Button
									variant="contained"
									style={{ backgroundColor: COLORS.SECONDARY }}
									fullWidth
									type="submit"
									onClick={handleSubmit(handleLogin)}
								>
									{loginResult.isLoading ? "Loading…" : "Log In"}
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

export default Login;
