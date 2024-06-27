import { Box, Grid } from "@mui/material";
import React, { useEffect } from "react";
import styles from "./Dashboard.module.scss";
import ProfitByUserTable from "./Tables/ProfitByUserTable";
import AllResultTable from "./Tables/AllResultTable";
import { useGetUsersQuery } from "../../services/user";
import {
	useGetDashboardDataQuery,
	useLazyGetUserLoadByMonthUserQuery,
} from "../../services/notifications";
import Loader from "../../components/Loader/Loader";
import ProgressLoader from "../../components/ProgressLoader/ProgressLoader";

const Dashboard = () => {
	const { data: users, refetch, isLoading, isFetching } = useGetUsersQuery();
	const { data: dashboardData, isFetching: dashboardFetching } = useGetDashboardDataQuery();
	const [triggerUserMonth, { data: monthlyData }] = useLazyGetUserLoadByMonthUserQuery();

	useEffect(() => {
		triggerUserMonth();
	}, []);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div style={{ padding: "10px" }}>
			<div className={styles.yellowBox}>
				<h3 style={{ padding: "10px" }}>Today Stats</h3>
			</div>
			<Box>
				{dashboardData ? (
					<Grid container spacing={2}>
						<Grid item xs={2.4}>
							<div className={styles.greenBox}>
								<div style={{ padding: "12px 20px" }}>
									<p className="text-white" style={{ marginBottom: "0px" }}>
										Total Loads
									</p>
									<h2 style={{ margin: "5px 0", textAlign: "center" }}>
										{dashboardData?.totalLoadsToday}
									</h2>
								</div>
							</div>
						</Grid>
						<Grid item xs={2.4}>
							<div className={styles.violetBox}>
								<div style={{ padding: "12px 20px" }}>
									<p className="text-white" style={{ marginBottom: "0px" }}>
										Total Profits
									</p>
									<h2 style={{ margin: "5px 0", textAlign: "center" }}>
										{dashboardData?.profitToday < 0
											? `-$${Math.abs(dashboardData.profitToday)}`
											: `$${dashboardData.profitToday}`}
									</h2>
								</div>
							</div>
						</Grid>
						{/* <Grid item xs={2.4}>
						<div className={styles.lightViolateBox}>
							<div style={{ padding: "12px 20px" }}>
								<p className="text-white" style={{ marginBottom: "0px" }}>
									Total Users
								</p>
								<h2 style={{ margin: "5px 0", textAlign: "center" }}>
									{dashboardData?.totalUsers}
								</h2>
							</div>
						</div>
					</Grid>
					<Grid item xs={2.4}>
						<div className={styles.assBox}>
							<div style={{ padding: "12px 20px" }}>
								<p className="text-white" style={{ marginBottom: "0px" }}>
									Total Assets
								</p>
								<h2 style={{ margin: "5px 0", textAlign: "center" }}>
									{dashboardData?.totalAssets}
								</h2>
							</div>
						</div>
					</Grid>
					<Grid item xs={2.4}>
						<div className={styles.neviBox}>
							<div style={{ padding: "12px 20px" }}>
								<p className="text-white" style={{ marginBottom: "0px" }}>
									Total Customers
								</p>
								<h2 style={{ margin: "5px 0", textAlign: "center" }}>
									{dashboardData?.totalCustomers}
								</h2>
							</div>
						</div>
					</Grid> */}
					</Grid>
				) : (
					<ProgressLoader />
				)}
			</Box>
			{/* <div className={styles.yellowBox}>
				<h3 style={{ padding: "10px" }}>Team Over all States</h3>
			</div> */}
			{/* <Box sx={{ flexGrow: 1 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<div className={styles.whiteBox} style={{ height: "350px" }}>
							<div
								style={{
									padding: "5px 10px",
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "30px",
								}}
							>
								<p style={{ margin: "0px", fontWeight: "bold" }}>Load Count</p>
								<p style={{ margin: "0px", fontWeight: "bold" }}>Total: $8096</p>
							</div>
							<LoadCountBars />
						</div>
					</Grid>
					<Grid item xs={12} md={6}>
						<div className={styles.whiteBox} style={{ height: "350px" }}>
							<div
								style={{
									padding: "5px 10px",
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "30px",
								}}
							>
								<p style={{ margin: "0px", fontWeight: "bold" }}>Total Profit</p>
								<p style={{ margin: "0px", fontWeight: "bold" }}>Total: $13059</p>
							</div>
							<TotalProfitChart />
						</div>
					</Grid>
				</Grid>
			</Box> */}
			<div className={styles.yellowBox}>
				<h3 style={{ padding: "10px" }}>Team Over all States Tables</h3>
			</div>
			<Box sx={{ flexGrow: 1 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<ProfitByUserTable users={users} isLoading={isLoading} />
					</Grid>
					<Grid item xs={12} md={6}>
						<AllResultTable monthlyData={monthlyData} isLoading={isLoading} />
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default Dashboard;
