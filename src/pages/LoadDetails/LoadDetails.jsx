import React, { useEffect, useState } from "react";
import styles from "./LoadDetails.module.scss";
import { useParams } from "react-router";
import { useGetLoadIdsQuery, useLazyGetLoadByIdQuery } from "../../services/load";
import {
	Box,
	Card,
	Chip,
	Grid,
	LinearProgress,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";

const LoadDetails = () => {
	const { loadId } = useParams();

	const { data: loadIds, isLoading: isLoadIdsLoading, isError } = useGetLoadIdsQuery();
	const [trigger, { data: loadDetails, isFetching }] = useLazyGetLoadByIdQuery(loadId);

	const loadItem = loadDetails?.load;
	const destinationInfo = loadDetails?.load?.destinationList;
	const pickUpInfo = loadDetails?.load?.pickUpList;

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (loadId) {
			trigger(loadId);
		}
	}, [loadId]);

	useEffect(() => {
		if (!isLoadIdsLoading && !isError && loadDetails) {
			console.log("Loaded Data:", loadDetails);
			setIsLoading(false);
		}
	}, [isLoadIdsLoading, isError, loadDetails]);

	if (isLoadIdsLoading || isLoading) {
		return (
			<Stack className={styles.linearProgressContainer}>
				<LinearProgress color="inherit" />
			</Stack>
		);
	}

	if (isError) {
		return <div>Error loading data</div>;
	}
	return (
		<div>
			<Box className={styles.boxContainer} gutterBottom>
				<Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
					<Grid item xs={12} sm={12} md={6}>
						<Card variant="outlined">
							<TableContainer component={Paper}>
								<Table aria-label="customized table">
									<TableHead
										sx={{
											margin: "0 auto",
											width: "100%",
											backgroundColor: "#323A46",
											color: "white",
										}}
									>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="center" colSpan={2}>
												<Typography sx={{ fontSize: "16px", color: "white" }}>
													<b>Load ID: {loadItem?.loadId}</b>
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="right">
												<b>Type :</b>
											</TableCell>
											<TableCell className={styles.loadIdTable}>{loadItem?.loadType}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="right">
												<b>Status :</b>
											</TableCell>
											<TableCell className={styles.loadIdTable}>{loadItem?.status}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="right">
												<b>Reference Number :</b>
											</TableCell>
											<TableCell className={styles.loadIdTable}>
												{loadItem?.referenceNumber}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="right">
												<b>Customer Rate :</b>
											</TableCell>
											<TableCell className={styles.loadIdTable}>
												{loadItem?.customerRate}{" "}
												<Chip
													label="Incoming"
													variant="outlined"
													sx={{ backgroundColor: "#CAF7B7", borderColor: "#1AA251" }}
												/>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="right">
												<b>Driver Rate :</b>
											</TableCell>
											<TableCell className={styles.loadIdTable}>
												{loadItem?.driverRate}{" "}
												<Chip
													label="Outgoing"
													variant="outlined"
													sx={{ backgroundColor: "#F7C6C5", borderColor: "#870000" }}
												/>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="right">
												<b>Truck Number :</b>
											</TableCell>
											<TableCell className={styles.loadIdTable}>{loadItem?.truckNumber}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="right">
												<b>Truck Type :</b>
											</TableCell>
											<TableCell className={styles.loadIdTable}>{loadItem?.truckType}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.loadIdTable} align="right">
												<b>Notes :</b>
											</TableCell>
											<TableCell className={styles.loadIdTable}>{loadItem?.notesPrivate}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Card>
					</Grid>
				</Grid>
			</Box>
			<Box className={styles.boxContainer} gutterBottom>
				<Grid container spacing={3}>
					<Grid item sm={12} md={6}>
						<Card variant="outlined">
							<TableContainer component={Paper}>
								<Table aria-label="customized table">
									<TableHead>
										<TableRow>
											<TableCell colSpan={3}>
												<Typography variant="h6" component="div" color="#1565C0">
													Customer Info
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Type:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.customer?.type}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Name:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.customer?.name}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Contact:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.customer?.number}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Representatives:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.representativesCustomer}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Rate:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.customerRate}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Card>
					</Grid>
					<Grid item sm={12} md={6}>
						<Card variant="outlined">
							<TableContainer component={Paper}>
								<Table aria-label="customized table">
									<TableHead>
										<TableRow>
											<TableCell colSpan={3}>
												<Typography variant="h6" component="div" color="#1565C0">
													{loadItem?.isDriver === false ? "Carrier" : "Asset"} Info
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Name:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.carrier?.name}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Address:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.carrier?.address}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Contact:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.carrier?.phone}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>Representatives:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.representativesCarrier}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className={styles.carrierInfoTable}>
												<b>MC Number:</b>
											</TableCell>
											<TableCell className={styles.carrierInfoTable} colSpan={2}>
												{loadItem?.carrier?.mcNumber}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Card>
					</Grid>
				</Grid>
			</Box>
			<Box className={styles.boxContainer} gutterBottom>
				<Grid container spacing={3}>
					<Grid item sm={12} md={6}>
						<Card variant="outlined">
							<TableContainer component={Paper}>
								<Table aria-label="customized table">
									<TableHead>
										<TableRow>
											<TableCell colSpan={3}>
												<Typography variant="h6" component="div" color="#1565C0">
													Pick Up Info
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									{pickUpInfo &&
										pickUpInfo.map((item, index) => (
											<TableBody key={index}>
												<TableRow>
													<TableCell colSpan={3}>
														{" "}
														<b>Pick Up - {index + 1}</b>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Destination: </b>{" "}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														{item?.pickUpLocation}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Business Address: </b>{" "}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														{item?.pBussinessAddress}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Opening: </b>{" "}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														{item?.pickUpOpeningDateTime}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Closing: </b>{" "}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														{item?.pickUpClosingDateTime}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Comodity: </b>
														{item?.pComodity}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														<span style={{ marginRight: "3%" }}>
															<b>Pallets: </b>
															{item?.pPallets}{" "}
														</span>
														<span>
															<b>Weight: </b>
															{item?.pWeight}
														</span>
													</TableCell>
												</TableRow>
												{item?.geoCodePick && (
													<>
														<TableRow>
															<TableCell className={styles.carrierInfoTable} align="right">
																<b>GEO Location:</b>
															</TableCell>
															<TableCell className={styles.carrierInfoTable} colSpan={2}>
																<span style={{ marginRight: "5%" }}>{item?.geoCodePick[0]}</span>
																<span>{item?.geoCodePick[1]}</span>
															</TableCell>
														</TableRow>
													</>
												)}
											</TableBody>
										))}
								</Table>
							</TableContainer>
						</Card>
					</Grid>
					<Grid item sm={12} md={6}>
						<Card variant="outlined">
							<TableContainer component={Paper}>
								<Table aria-label="customized table">
									<TableHead>
										<TableRow>
											<TableCell colSpan={3}>
												<Typography variant="h6" component="div" color="#1565C0">
													Destination Info
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									{destinationInfo &&
										destinationInfo.map((item, index) => (
											<TableBody key={index}>
												<TableRow>
													<TableCell colSpan={3}>
														{" "}
														<b>Destination - {index + 1}</b>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Destination: </b>{" "}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														{item?.destination}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Business Address: </b>{" "}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														{item?.dBussinessAddress}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Opening: </b>{" "}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														{item?.dropOpeningDateTime}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Closing: </b>{" "}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														{item?.dropClosingDateTime}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className={styles.carrierInfoTable} align="right">
														<b>Comodity: </b>
														{item?.dComodity}
													</TableCell>
													<TableCell className={styles.carrierInfoTable} colSpan={2}>
														<span style={{ marginRight: "3%" }}>
															<b>Pallets: </b>
															{item?.dPallets}{" "}
														</span>
														<span>
															<b>Weight: </b>
															{item?.dWeight}
														</span>
													</TableCell>
												</TableRow>
												{item?.geoCodeDes && (
													<>
														<TableRow>
															<TableCell className={styles.carrierInfoTable} align="right">
																<b>GEO Location:</b>
															</TableCell>
															<TableCell className={styles.carrierInfoTable} colSpan={2}>
																<span style={{ marginRight: "5%" }}>{item?.geoCodeDes[0]}</span>
																<span>{item?.geoCodeDes[1]}</span>
															</TableCell>
														</TableRow>
													</>
												)}
											</TableBody>
										))}
								</Table>
							</TableContainer>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default LoadDetails;
