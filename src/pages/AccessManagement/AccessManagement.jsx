import React, { useState, useEffect } from "react";
import styles from "../AccessManagement/AccessManagement.module.scss";
import CrmTable from "../../components/CrmTable";
import { Box, IconButton, Typography, Tooltip, Stack, Chip } from "@mui/material";
import { useParams } from "react-router";
import { Cancel } from "@mui/icons-material";
import BackBtn from "../../components/BackBtn/BackBtn";
import teamAvater from "../../assets/images/user.png";

import { useGetBranchMemberByIdQuery } from "../../services/branch";

const AccessManagement = () => {
	const { branchId } = useParams();

	const {
		data: branchData,
		isLoading: isLoadIdsLoading,
		isError,
	} = useGetBranchMemberByIdQuery(branchId);

	if (isError) {
		return <div>Error loading data</div>;
	}

	const handleClick = (member) => {
		console.info("You clicked the Chip.", member);
	};

	const [loadColumn] = useState([
		{
			id: "membername",
			label: "Member Name",
			canBeSorted: true,
			render: (member) => {
				return (
					<Box
						sx={{
							display: "flex",
							gap: "1rem",
							alignItems: "center",
							justifyContent: "flex-start",
						}}
					>
						<Stack
							sx={{
								width: "80px",
								height: "80px",
								borderRadius: "50%",
							}}
						>
							<img
								src={teamAvater}
								alt="team image"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
						</Stack>
						<Typography variant="body1" component={"h5"}>
							{member.name}
						</Typography>
					</Box>
				);
			},
		},

		{
			id: "email",
			label: "Email",
			canBeSorted: true,
			render: (member) => {
				return (
					<Box sx={{ minWidth: "110px", display: "flex", gap: "1rem" }}>
						<Typography variant="body2" component={"h6"}>
							{member.email}
						</Typography>
					</Box>
				);
			},
		},

		{
			id: "status",
			label: "Status",
			canBeSorted: true,
			render: (member) => {
				return (
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-start",
							alignItems: "center",
							gap: ".3rem",
							maxWidth: "180px",
						}}
					>
						<Chip
							style={{
								padding: "3px 14px",
								backgroundColor: "#47745E",
								color: "#fcfcfc",
								textTransform: "uppercase",
								cursor: "pointer",
								fontWeight: "500",
							}}
							label={member.isActive && "Active"}
						/>
					</Box>
				);
			},
		},

		{
			id: "createdat",
			label: "CreatedAt",
			canBeSorted: true,
			render: (member) => {
				return (
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-start",
							alignItems: "center",
							gap: ".3rem",
							maxWidth: "180px",
						}}
					>
						<Typography variant="body2" component={"h6"}>
							{member.createdAt}
						</Typography>
					</Box>
				);
			},
		},

		{
			id: "action",
			label: "Action",
			render: (member) => {
				return (
					<Tooltip title="Remove member">
						<IconButton onClick={() => handleClick(member)}>
							<Cancel />
						</IconButton>
					</Tooltip>
				);
			},
		},
	]);

	return (
		<>
			<div className={styles.orderArea}>
				<BackBtn />
				<Box sx={{ mb: 2 }}>
					<Box
						sx={{
							display: "flex",
							gap: ".5rem",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Typography
							variant="h5"
							sx={{ textTransform: "capitalize", mt: "1.5rem", fontWeight: "600" }}
						>
							Team Title : {branchData?.branch?.title ? branchData?.branch?.title : "Our Dream"}
						</Typography>
					</Box>
				</Box>

				<CrmTable
					columns={loadColumn}
					data={branchData ? branchData.branch.members : []}
					loading={isLoadIdsLoading}
				/>
			</div>
		</>
	);
};

export default AccessManagement;
