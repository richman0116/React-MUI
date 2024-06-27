import React, { useEffect, useState } from "react";
import ROUTES from "../../routes";
import { useNavigate } from "react-router-dom";
import { generateNickname } from "../../utils/generateNickname";
import styles from "./LoadCols.module.scss";
import { Box, Button, Chip, IconButton, Link, Tooltip } from "@mui/material";
import { getLoadPaymentStatusColor, getLoadStatusColor } from "../../utils/getLoadStatusColor";
import {
	getLoadPaymentStatusTextColor,
	getLoadStatusTextColor,
} from "../../utils/getLoadStatusTextColor";
import moment from "moment-timezone";
import { COLORS } from "../../shared/colors";
import { CloudDownload, Download, Edit, VisibilityOutlined } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { formatDate, formatTime } from "../../utils/dateUtils";
import fireImg from "../../assets/icons/fire.gif";
import Red from "../../assets/images/red.png";
import Orange from "../../assets/images/orange.png";

const useLoadCols = ({
	loadsActiveFilter = "",
	setEditedLoad = () => {},
	toggleDrawer,
	handleClick = () => {},
	page = "loads",
	setShowTrackModal,
}) => {
	const navigate = useNavigate();

	const handleEdit = (data) => {
		navigate(`${ROUTES.PATHS.ADD_LOAD}?id=${data._id}`);
	};

	const cols = [
		{
			id: "pro",
			label: "Pro Number",
			canBeSorted: true,
			render: (load) => {
				return (
					<div style={{ fontWeight: "bold" }}>
						<p style={{ marginBottom: "5px" }}>
							{" "}
							<span style={{ color: "green" }}>UA2</span> |{" "}
							<span style={{ color: "red" }}>
								{load && load.createdBy && load.createdBy.name
									? generateNickname(load.createdBy.name)
									: "HCu"}
							</span>{" "}
						</p>
						<div>{load?.loadId}</div>
					</div>
				);
			},
		},
		{
			id: "customerRate",
			label: "Client",
			canBeSorted: true,
			render: (load) => {
				return (
					<div style={{ maxWidth: "180px" }} className={styles.customerInfo}>
						<p className={styles.customerName}>
							<span
								style={
									load.customer && load.customer?.isApproved
										? { color: "green", fontSize: "13px", fontWeight: "bold" }
										: { color: "#b71c1c", fontSize: "13px", fontWeight: "bold" }
								}
							>
								{load.customer ? load.customer.customerName : ""}
							</span>
							<br />
							{load.customer &&
								load.customer?.representatives &&
								load.customer?.representatives.length > 0 && (
								<div className={styles.representatives}>
									<p>
										{load.customer?.representatives[0].name},{" "}
										{load.customer?.representatives[0].phone}
									</p>
									<Tooltip title={load.customer?.representatives[0].email}>
										<Link
											className={styles.mail}
											href={`mailto:${load.customer?.representatives[0].email}`}
										>
											{load.customer?.representatives[0].email}
										</Link>
									</Tooltip>
								</div>
							)}
						</p>
						{load.customer && load.referenceNumber && (
							<p className={styles.basic}>Ref: {load.referenceNumber}</p>
						)}

						<span style={{ color: "forestgreen" }} className={styles.basic}>
							Rate: $ {load.customerRate}
						</span>
					</div>
				);
			},
		},
		{
			id: "driverRate",
			label: "Unit/Carrier",
			canBeSorted: true,
			render: (load) => {
				return (
					<div className={styles.flexColumn} style={{ fontSize: "11px", maxWidth: "180px" }}>
						<div className={styles.driverInfor}>
							<p>
								{load.driver && (
									<div style={{ fontSize: "13px", fontWeight: "bold", color: "darkslateblue" }}>
										{load.driver?.assignedDrivers}({load.driver?.assetId})
									</div>
								)}
							</p>
							<div className={styles.driverDetails}>
								<Tooltip title={load.driver?.email}>
									<Link className={styles.mail} href={`mailto:${load.driver?.email}`}>
										{load.driver?.email}
									</Link>
								</Tooltip>
								<p>{load.driver?.contactNumber}</p>
							</div>
						</div>
						<span style={{ color: "darkslateblue" }} className={styles.basic}>
							Rate: $ {load?.driverRate}
						</span>
					</div>
				);
			},
		},
		{
			id: "pickUpLocation",
			label: "PU",
			canBeSorted: true,
			render: (load) => {
				return load?.pickUpList.map((item, index) => (
					<div key={index} className={styles.locationList} style={{ marginBottom: "3px" }}>
						<p style={{ margin: "0" }} className={styles.location}>
							{item.pickUpLocation}
						</p>
						<div className={styles.pltwt}>
							{item.pWeight && item.pWeight.length > 0 && <span>WT:{item.pWeight}</span>}
							{item.pPallets && item.pPallets.length > 0 && <span>PLT:{item.pPallets}</span>}
						</div>
						<p
							style={{
								marginTop: "5px",
								marginBottom: "0px",
								margin: "0px",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<span
								style={{
									color: "forestgreen",
									fontSize: "0.7rem",
									fontWeight: "500",
								}}
							>
								{`${formatDate(item.pickUpOpeningDateTime)} ${formatTime(
									item.pickUpOpeningDateTime
								)}`}
							</span>
						</p>
					</div>
				));
			},
		},
		{
			id: "do",
			label: "DO",
			canBeSorted: true,
			render: (load) => {
				return load?.destinationList.map((item, index) => (
					<div key={index} className={styles.locationList} style={{ marginBottom: "3px" }}>
						<p style={{ margin: "0", padding: "0" }} className={styles.location}>
							{item.destination}
						</p>
						<div className={styles.pltwt}>
							{item.dWeight && item.dWeight.length > 0 && <span>WT:{item.dWeight}</span>}
							{item.dPallets && item.dPallets.length > 0 && <span>PLT:{item.dPallets}</span>}
						</div>
						<p
							style={{
								marginTop: "5px",
								marginBottom: "0px",
								margin: "0px",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<span
								style={{
									color: "forestgreen",
									fontSize: "0.7rem",
									fontWeight: "500",
								}}
							>
								{`${formatDate(item.dropOpeningDateTime)} ${formatTime(item.dropOpeningDateTime)}`}
							</span>
							{load?.destinationList.length > 1 && (
								<Chip
									sx={{ padding: "2px", fontSize: "10px" }}
									size="small"
									color="info"
									className={styles.DOChips}
									label={`#DO${index + 1}`}
								/>
							)}
						</p>
					</div>
				));
			},
		},
		{
			id: "status",
			label: "Load Status",
			canBeSorted: true,
			render: (load, icon) => {
				const getStatus = () => {
					if (page === "loads" || page === "tracking") {
						return loadsActiveFilter === "active"
							? load?.status?.toUpperCase()
							: load?.paymentStatus?.toUpperCase();
					} else {
						return load?.paymentStatus === "DriverPaid"
							? "Paid"
							: load?.paymentStatus?.toUpperCase();
					}
				};

				const getChipStyle = (status) => ({
					padding: "0 6px",
					backgroundColor:
						page === "loads" || page === "tracking"
							? getLoadStatusColor(status)
							: getLoadPaymentStatusColor(status),
					color:
						page === "loads" || page === "tracking"
							? getLoadStatusTextColor(status)
							: getLoadPaymentStatusTextColor(status),
					fontSize: "0.7rem",
				});

				return (
					<div style={{ cursor: "pointer", fontSize: "0.7rem" }}>
						<Chip
							label={getStatus()}
							style={getChipStyle(
								page === "loads" || page === "tracking" ? load?.status : load?.paymentStatus
							)}
							size="small"
						/>
						{page === "broker" && load?.paymentStatus === "Paid" && (
							<div style={{ marginTop: "4px" }}>
								{load?.brokerPaidInfo?.datePaid && (
									<>
										{formatDate(load.brokerPaidInfo.datePaid)}
										<br />
										{formatTime(load.brokerPaidInfo.datePaid)}
									</>
								)}
							</div>
						)}
						{load?.brokerPaidInfo?.brokerPaidProof?.location && (
							<Button
								variant="contained"
								color="primary"
								size="small"
								endIcon={<CloudDownload />}
								onClick={() =>
									window.open(load?.brokerPaidInfo?.brokerPaidProof?.location, "_blank")
								}
								style={{ marginTop: "8px" }}
							>
								Proof
							</Button>
						)}
						{page === "broker" && load.brokerInvoicedInfo?.invoicedFile?.location?.length > 0 && (
							<div style={{ marginTop: "4px" }}>
								<Tooltip title={"Download Last Generated Invoice"} placement="top">
									<Link
										href={load.brokerInvoicedInfo.invoicedFile.location}
										target="_blank"
										style={{ textDecoration: "none" }}
									>
										<Button
											variant="contained"
											style={{
												backgroundColor: "#00008B",
												color: "white",
												padding: "4px 8px",
												fontSize: "11px",
											}}
											startIcon={<Download />}
											aria-label="Download"
											size="small"
										>
											Invoice
										</Button>
									</Link>
								</Tooltip>
							</div>
						)}
						{page === "broker" && load.brokerInvoicedInfo?.lastDate?.length > 0 && (
							<div
								style={{
									minWidth: "100px",
									fontSize: "12px",
									marginTop: "5px",
									fontWeight: "bold",
									color: load.paymentStatus === "Overdue" ? "red" : "black",
								}}
							>
								LPD: {formatDate(load.brokerInvoicedInfo.lastDate)}
							</div>
						)}
						{page === "driver" && load?.paymentStatus === "DriverPaid" && (
							<div style={{ marginTop: "4px" }}>
								{load?.driverPaidInfo?.datePaid && formatDate(load.driverPaidInfo.datePaid)}
							</div>
						)}
					</div>
				);
			},
		},
		{
			id: "internal-notes",
			label: "Internal Notes",
			canBeSorted: true,
			render: (load) => {
				return (
					<div
						style={{ cursor: "pointer", fontSize: "0.8rem" }}
						onClick={() => {
							setEditedLoad(load);
							if (toggleDrawer) {
								toggleDrawer("right", true);
							}
						}}
					>
						{load?.activity?.private?.length ? (
							<div>
								<div>{load.activity?.private[load.activity.private.length - 1].text}</div>
								<div style={{ color: COLORS.HOOKERS_GREEN, fontSize: "8px !important" }}>
									{moment(
										load.activity?.private[load.activity.private.length - 1].createdTime
									).format("MM-DD-YYYY, hh:mm A")}
								</div>
							</div>
						) : (
							""
						)}
					</div>
				);
			},
		},
		{
			id: "action",
			label: "Action",
			render: (load, updateStatus) => {
				return (
					<div className={styles.actionFlex}>
						{page === "loads" || page === "broker" ? (
							<Tooltip title="Edit Load">
								<IconButton
									onClick={() => handleEdit(load)}
									aria-label="edit"
									style={{ color: COLORS.CRAYOLA }}
								>
									<Edit />
									{page !== "broker" && (updateStatus === "red" ? <img src={Red} alt="red" style={{ width: "20px", height: "20px", marginLeft: "25px" }} /> : updateStatus === "orange" ? <img src={Orange} alt="orange" /> : <></>)}
								</IconButton>
							</Tooltip>
						) : page === "tracking" ? (
							<Tooltip title="Track Load">
								<IconButton
									onClick={() => {
										setEditedLoad(load);
										if (setShowTrackModal) setShowTrackModal(true);
									}}
									aria-label="track"
									style={{ color: COLORS.CRAYOLA }}
								>
									<VisibilityOutlined />
									{updateStatus === "red" ? <img src={Red} alt="red" style={{ width: "20px", height: "20px", marginLeft: "25px" }} /> : updateStatus === "orange" ? <img src={Orange} alt="orange" /> : <></>}
								</IconButton>
							</Tooltip>
						) : (
							<></>
						)}

						{load.hotLoad === 1 && (
							<Tooltip title="Hot Load">
								<img style={{ width: "24px", height: "auto" }} src={fireImg} alt="Hot Load" />
							</Tooltip>
						)}

						<Box>
							<Button
								id="basic-button"
								aria-controls={open ? "basic-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}
								onClick={(event) => handleClick(event, load)}
							>
								<FontAwesomeIcon icon={faEllipsisV} style={{ color: COLORS.CRAYOLA }} />
							</Button>
						</Box>
					</div>
				);
			},
		},
	];
	const [loadCols, setLoadCols] = useState(cols);

	useEffect(() => {
		setLoadCols(cols);
	}, [page]);

	return {
		loadCols,
		setLoadCols,
	};
};

export default useLoadCols;
