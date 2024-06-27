import React from "react";
import useEditProfile from "./hook";
import { Avatar, Box, Button, CircularProgress, FormControl, TextField } from "@mui/material";

import styles from "../Organizations/Organizations.module.scss";
import { Controller } from "react-hook-form";
import ProgressLoader from "../../components/ProgressLoader/ProgressLoader";

const Profile = () => {
	const {
		userData,
		onSubmit,
		handleSubmit,
		control,
		errors,
		register,
		disableSubmit,
		img,
		setImg,
	} = useEditProfile();

	return (
		<>
			<div
				style={{
					height: "80vh",
					width: "80%",
					margin: "0 auto",
					marginTop: "50px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Box
					style={{
						boxShadow:
							"rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
						padding: "50px 25px",
					}}
				>
					<div className={styles.addOrganizationArea}>
						{userData ? (
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className={styles.twoColumnGrid}>
									<div
										className={styles.displayColumn}
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											alignSelf: "center",
										}}
									>
										<div style={{ marginBottom: "16px" }}>
											{img ? (
												<img
													style={{
														width: "88px",
														height: "88px",
														borderRadius: "50% 50%",
														objectFit: "cover",
													}}
													src={img}
													alt="avatar"
												/>
											) : (
												<Avatar sx={{ width: 80, height: 80, marginRight: "8px" }} />
											)}
										</div>

										<FormControl>
											<Controller
												name="organizationLogo"
												control={control}
												defaultValue={null}
												render={({ field: { onChange, onBlur, name, ref } }) => (
													<TextField
														type="file"
														onChange={(e) => {
															const file = e.target.files[0];
															if (file) {
																const imgUrl = URL.createObjectURL(file);
																onChange(file);
																setImg(imgUrl);
															}
														}}
														onBlur={onBlur}
														name={name}
														inputRef={ref}
														InputLabelProps={{ shrink: true }}
														size="small"
														label="Avatar"
														variant="outlined"
													/>
												)}
											/>
										</FormControl>
									</div>
									<div className={styles.displayColumn}>
										<FormControl>
											<TextField
												required
												// {...register("name", { required: true })}
												value={userData ? userData?.user?.name : ""}
												label="Name"
												size="small"
												type="text"
												error={!!errors.name}
												disabled={true}
												InputLabelProps={{ shrink: true }}
											/>
										</FormControl>
										<FormControl style={{ margin: "20px 0" }}>
											<TextField
												required
												// {...register("email", { required: true })}
												value={userData ? userData?.user?.email : ""}
												label="Email"
												size="small"
												type="email"
												error={!!errors.email}
												disabled
												InputLabelProps={{ shrink: true }}
											/>
										</FormControl>
										<FormControl>
											<TextField
												required
												// {...register("role", { required: true })}
												value={userData ? userData?.user?.role : ""}
												label="Role"
												size="small"
												type="email"
												error={!!errors.role}
												disabled
												InputLabelProps={{ shrink: true }}
											/>
										</FormControl>
										<FormControl>
											<TextField
												required
												{...register("phone")}
												defaultValue={userData ? userData?.user?.phone : ""}
												label="Phone"
												size="small"
												type="text"
												sx={{ mt: 1 }}
												error={!!errors.phone}
												InputLabelProps={{ shrink: userData ? true : false }}
											/>
										</FormControl>
									</div>
								</div>
								<div></div>
								<Box
									sx={{
										display: "flex",
										justifyContent: "flex-end",
										alignItems: "center",
										gap: "1rem",
									}}
								>
									<Button
										type="submit"
										variant="contained"
										sx={{
											width: "160px",
											height: "45px",
											fontWeight: "600",
											textTransform: "capitalize",
											marginTop: "30px",
										}}
										endIcon={disableSubmit ? <CircularProgress size={16} /> : null}
										disabled={disableSubmit}
										color="primary"
										size="small"
									>
										Update Profile
									</Button>
								</Box>
							</form>
						) : (
							<ProgressLoader />
						)}
					</div>
				</Box>
			</div>
		</>
	);
};

export default Profile;
