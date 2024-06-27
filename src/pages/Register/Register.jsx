import React, { useState } from "react";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { COLORS } from "../../shared/colors";
import { useForm } from "react-hook-form";
import { useUserRegistrationMutation } from "../../services/user";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../routes";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const formSchema = yup.object().shape({
	password: yup
		.string()
		.required("Password is required")
		.min(7, "Password length should be at least 4 characters")
		.max(15, "Password cannot exceed more than 12 characters"),
	confirmPass: yup
		.string()
		.required("Confirm Password is required")
		.min(7, "Password length should be at least 4 characters")
		.max(15, "Password cannot exceed more than 12 characters")
		.oneOf([yup.ref("password")], "Passwords do not match"),
});

const Register = ({ type = "user" }) => {
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm({
		mode: "onTouched",
		resolver: yupResolver(formSchema),
	});

	const [disableSubmit, setDisableSubmit] = useState(false);
	const navigate = useNavigate();
	const [userRegistration] = useUserRegistrationMutation();

	const validatePasswordMatch = (value) => {
		const password = getValues("password"); // Get the value of the password field
		return value === password || "Passwords do not match";
	};

	// Constants for user types, consider moving these to a constants file if they are used in multiple places.
	const USER_TYPES = {
		user: "user",
		driver: "driver",
		org: "org",
	};

	const onSubmit = async (signUpData) => {
		setDisableSubmit(true);
		try {
			// Set user type from a predefined list of types if applicable
			signUpData.type = USER_TYPES[type] || signUpData.type; // default to existing type if not in USER_TYPES

			const response = await userRegistration(signUpData);

			if (response.error) {
				toast.error(response.error.data.error);
			} else {
				reset(); // Assuming reset clears the form
				toast.success("Welcome aboard! Account Created Successfully!");
				navigate(ROUTES.PATHS.LOADS); // Navigate to the 'LOADS' route upon successful registration
			}
		} catch (error) {
			console.error("Error during registration:", error); // More detailed logging
			toast.error("An error occurred. Please try again later.");
		} finally {
			setDisableSubmit(false);
		}
	};

	return (
		<div
			style={{
				backgroundColor: COLORS.CULTURED,
				display: "flex",
				height: "100vh",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<Box mb={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
				<img
					// eslint-disable-next-line no-undef
					src={require("../../assets/images/logo.png")}
					style={{
						width: "180px",
						height: "40px",
					}}
				/>
			</Box>
			<Card
				style={{
					border: "0.0625rem solid  #d1d7e0",
					boxShadow: "0 2px 18px rgba(0, 0, 0, 0.02)",
					borderRadius: " 0.5rem",
					width: "500px",
					margin: "0 auto",
				}}
				elevation={0}
			>
				<CardContent sx={{ minWidth: 378, padding: "30px 48px" }}>
					<Box mb={2}>
						<Typography sx={{ fontSize: 28 }} align="center" color={COLORS.SECONDARY}>
							Register
						</Typography>
						<Typography sx={{ fontSize: 16, color: COLORS.INDEPENDENCE }} align="center">
							Start Your Journey with Us
						</Typography>
					</Box>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div>
							<Typography variant="body2" mb={0.5}>
								Name
							</Typography>
							<TextField
								{...register("name", { required: true })}
								error={errors.name}
								id="filled-hidden-label-small"
								variant="filled"
								size="small"
								fullWidth
								helperText={errors.name && "Please input your name"}
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
								{...register("password", {
									required: true,
								})}
								error={errors.password}
								id="password"
								type="password"
								variant="filled"
								size="small"
								fullWidth
								helperText={errors.password?.message}
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
								Confirm Password
							</Typography>
							<TextField
								{...register("confirmPass", { required: true, validate: validatePasswordMatch })}
								error={errors.confirmPass}
								id="confirmPass"
								type="password"
								variant="filled"
								size="small"
								fullWidth
								helperText={errors.confirmPass && "Please confirm your password"}
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
								disabled={disableSubmit}
							>
								Sign Up
							</Button>
						</Box>
					</form>
					<Box mt={2.5} mb={2} sx={{ textAlign: "center" }}>
						Already have an account? <Link to="/login">Log in</Link>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
};

export default Register;
