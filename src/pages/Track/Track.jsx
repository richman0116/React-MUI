import React, { useMemo, useRef, useState } from "react";
import {
	Grid,
	AppBar,
	Toolbar,
	Container,
	Card,
	Typography,
	Paper,
	IconButton,
	InputBase,
	Divider,
	Button,
} from "@mui/material";
import "./style.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import { COLORS } from "../../shared/colors";
import { APP, CRM } from "../../shared/constants";
import { config } from "../../config";

const Track = () => {
	const mapRef = useRef(null);
	const [map, setMap] = useState(null);
	const [isDefaultText, setIsDefaultText] = useState(true);
	const center = useMemo(() => [29.749907, -95.358421], []);
	const [searchValue, setSearchValue] = useState("");
	const [result, setResult] = useState(false);

	const handleChange = (e) => {
		const value = e.target.value;
		setSearchValue(value);
		if (!value) setIsDefaultText(true);
	};

	const handleTrack = () => {
		console.log("searchValue", searchValue);
		if (!result && searchValue) setIsDefaultText(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (e.key === "Enter") handleTrack();
	};

	return (
		<div>
			<AppBar color="transparent" elevation={0}>
				<Toolbar style={{ backgroundColor: "white", borderBottom: "1px solid #E6EDF7" }}>
					<Container fixed sx={{ padding: 0 }}>
						<div style={{ display: "flex", alignItems: "center" }}>
							<div
								style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
								onClick={() => window.open(config.company.website, "_blank")}
							>
								{APP === CRM.ELG ? (
									<>
										<img src={`/${APP}_icon.png`} width={36} />
										<Typography sx={{ paddingTop: 0.5 }} variant="h6">
											{config.company.name}
										</Typography>
									</>
								) : (
									<>
										<img src={`/${APP}_Logo.png`} width={140} />
									</>
								)}
							</div>
						</div>
					</Container>
				</Toolbar>
			</AppBar>
			<Toolbar />
			<div style={{ background: "#f8f9fc", paddingBottom: "100px" }}>
				<Container fixed sx={{ padding: "60px 0 0 0" }}>
					<Grid container spacing={7}>
						<Grid item xs={12} md={6}>
							<div style={{ paddingBottom: 64 }}>
								<Paper
									sx={{
										p: "4px 6px",
										display: "flex",
										alignItems: "center",
										border: "1px solid #E6EDF7",
									}}
									elevation={0}
								>
									<IconButton sx={{ p: "10px" }} aria-label="menu">
										<SearchIcon />
									</IconButton>
									<InputBase
										sx={{ ml: 1, flex: 1 }}
										placeholder={`Track by ${APP.toLowerCase()} Ref.# or Customer Ref.#`}
										value={searchValue}
										onChange={handleChange}
										onKeyUp={handleSubmit}
									/>
									<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
									<Button size="small" variant="contained" disableElevation onClick={handleTrack}>
										Track
									</Button>
								</Paper>
							</div>
							{isDefaultText && (
								<div>
									<div style={{ display: "flex", alignItems: "center", gap: 5, paddingBottom: 2 }}>
										{/* <div>
											<InfoOutlinedIcon style={{ fontSize: 24, marginTop: 2 }} />
										</div> */}
										<Typography variant="h6" sx={{ fontWeight: 500, fontSize: 24 }}>
											How to use tracking?
										</Typography>
									</div>
									<div style={{ fontSize: 17 }}>
										Enter {APP.toLowerCase()} Ref. # or Customer Ref. # to see shipment Information:
										current shipment status, location, brief details of first pick-up and last
										delivery
									</div>
								</div>
							)}
							{!isDefaultText && (
								<div>
									<div style={{ paddingBottom: 2 }}>
										<Typography variant="h6" sx={{ fontWeight: 500, fontSize: 24 }}>
											Shipment Information
										</Typography>
									</div>
									<div style={{ fontSize: 17 }}>Ref. # {searchValue}</div>
									<Divider style={{ margin: "36px 0" }} />
									{!result && (
										<div>
											<div style={{ fontSize: 17 }}>
												<div style={{ paddingBottom: 4 }}>
													We are unable to find any active or recently completed shipments (for the
													past 7 days) with the requested Ref. #.
												</div>
												<div>
													Please double check Ref# you have entered, or consider contacting
													<span style={{ paddingLeft: 6 }}>
														<a
															style={{ color: COLORS.PRIMARY, textDecoration: "none" }}
															href={`mailto:${config.company.contact}`}
														>
															{config.company.contact}
														</a>
													</span>
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</Grid>
						<Grid item xs={12} md={6}>
							<Card style={{ height: "80vh", borderRadius: 12 }}>
								<MapContainer
									center={center}
									zoom={4}
									scrollWheelZoom={true}
									ref={mapRef}
									whenCreated={setMap}
								>
									<TileLayer
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									/>
								</MapContainer>
							</Card>
						</Grid>
					</Grid>
				</Container>
			</div>
		</div>
	);
};

export default Track;
