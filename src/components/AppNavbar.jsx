import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useLocation, useNavigate, Link } from "react-router-dom";
import globalUtils from "../utils/globalUtils";
import { menuItems } from "../shared/menuItems";
import { Avatar, Collapse, Menu, MenuItem } from "@mui/material";
import { ExpandLess, ExpandMore, Logout, PersonAdd, Settings } from "@mui/icons-material";
import { APP, ROLE } from "../shared/constants";
import { useGetMeQuery, useLazyUserLogoutQuery } from "../services/user";
import ROUTES from "../routes";
import { useState } from "react";
import { COLORS } from "../shared/colors";
import { baseApi } from "../services/base";
import { useDispatch, useSelector } from "react-redux";
import { revertAll, setCollapseNestedItemOpen } from "../store/slice/globalSlice";
import { config } from "../config";
import Notification from "./Notification/Notification";
// import sideBg from "../assets/images/left-bg.jpg";
// import topBg from "../assets/images/top-bg.png";

const drawerWidth = 240;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: 1200,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
	({ theme, open }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
		boxSizing: "border-box",
		...(open && {
			...openedMixin(theme),
			"& .MuiDrawer-paper": openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			"& .MuiDrawer-paper": closedMixin(theme),
		}),
	})
);

export default function AppNavbar({ children }) {
	const theme = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { loggedInUser } = useSelector((state) => state.global);
	const collapseNestedItemOpen = useSelector((state) => state.global.collapseNestedItemOpen);
	const [open, setOpen] = React.useState(true);

	const accessToken = localStorage.getItem(config.accessTokenName) || "";
	const { data: userData, isSuccess } = useGetMeQuery(accessToken);

	const [trigger] = useLazyUserLogoutQuery();

	const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);

	React.useEffect(() => {
		if (userData && userData.user && userData.user.accessFeatures) {
			const accessList = userData.user.accessFeatures;

			const filteredItems = menuItems
				.map((menuItem) => {
					if (
						(accessList[menuItem.key] && accessList[menuItem.key].Read) ||
						menuItem.key === "Dashboard"
					) {
						const subItems = menuItem.subItems?.filter((subItem) => {
							return accessList[subItem.key] && accessList[subItem.key].Read;
						});

						return { ...menuItem, subItems };
					} else {
						return null;
					}
				})
				.filter(Boolean);

			setFilteredMenuItems(filteredItems);
		}
	}, [userData]);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	// const getPageTitle = () => {
	// 	const splitedPath = location.pathname.split("/");
	// 	const pageTitle = location.pathname === "/" ? "Dashboard" : splitedPath[splitedPath.length - 1];
	// 	return pageTitle;
	// };

	const getPageTitle = () => {
		const splitedPath = location.pathname.split("/");
		let pageTitle = "Dashboard";
		if (location.pathname !== "/") {
			if (splitedPath.length >= 3) {
				pageTitle = splitedPath[splitedPath.length - 2];
			} else {
				pageTitle = splitedPath[splitedPath.length - 1];
			}
		}
		return pageTitle;
	};

	const handleMenuItemClick = (item, parent) => {
		const updatedState = collapseNestedItemOpen.map((submenu) => {
			return submenu.identifier === parent
				? { ...submenu, isOpen: item === parent ? !submenu.isOpen : true }
				: { ...submenu, isOpen: false };
		});
		dispatch(setCollapseNestedItemOpen(updatedState));
	};

	const getIsOpenNestedMenu = (text) =>
		collapseNestedItemOpen.find((submenu) => submenu.identifier === text)?.isOpen;

	const [anchorEl, setAnchorEl] = React.useState(null);
	const menuItemOpen = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		const response = await trigger().unwrap();
		console.log("logout response ", response);
		if (response.success) {
			localStorage.removeItem(config.accessTokenName);
			dispatch(baseApi.util.resetApiState());
			dispatch(revertAll());
			navigate(ROUTES.PATHS.LOGIN);
		}
	};

	const currentPagePath = location.pathname;

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				sx={{
					backgroundImage:
						"linear-gradient(to right, rgba(24, 29, 217, 1) 50%, rgba(24, 29, 217, 0.5))",
					backgroundColor: "transparent",
				}}
				position="fixed"
				open={open}
				elevation={0}
			>
				<Toolbar variant="regular">
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(open && { display: "none" }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
						}}
					>
						<Typography variant="h6" noWrap component="div">
							{globalUtils.snakeCaseToCapitalize(getPageTitle())}
						</Typography>
						<div>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<List component="nav" aria-label="Device settings" sx={{ bgcolor: "transparent" }}>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										{isSuccess && (
											<>
												<Notification />
												<ListItemButton
													onClick={handleClick}
													size="small"
													sx={{ ml: 1 }}
													aria-controls={menuItemOpen ? "account-menu" : undefined}
													aria-haspopup="true"
													aria-expanded={menuItemOpen ? "true" : undefined}
												>
													<Avatar sx={{ width: 28, height: 28, marginRight: "8px" }} />
													<Typography variant="body1">
														<span className="mb-0 fw-bold">
															<span>Hello </span>
															{userData.user.role === ROLE.ADMIN
																? userData.user.name
																: userData.user?.name
																	? userData.user?.name
																	: userData.email}
														</span>
													</Typography>
												</ListItemButton>
											</>
										)}
									</Box>
								</List>
							</Box>

							<Menu
								anchorEl={anchorEl}
								id="account-menu"
								open={menuItemOpen}
								onClose={handleClose}
								onClick={handleClose}
								PaperProps={{
									elevation: 0,
									sx: {
										overflow: "visible",
										filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
										mt: 1.5,
										"& .MuiAvatar-root": {
											width: 32,
											height: 32,
											ml: -0.5,
											mr: 1,
										},
										"&:before": {
											// eslint-disable-next-line quotes
											content: '""',
											display: "block",
											position: "absolute",
											top: 0,
											right: 14,
											width: 10,
											height: 10,
											bgcolor: "background.paper",
											transform: "translateY(-50%) rotate(45deg)",
											zIndex: 0,
										},
									},
								}}
								transformOrigin={{ horizontal: "right", vertical: "top" }}
								anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
							>
								<MenuItem onClick={() => navigate(ROUTES.PATHS.PROFILE)}>
									<Avatar /> Profile
								</MenuItem>
								<Divider />
								<MenuItem onClick={handleClose}>
									<ListItemIcon>
										<PersonAdd fontSize="small" />
									</ListItemIcon>
									Add another account
								</MenuItem>
								<MenuItem onClick={() => navigate(ROUTES.PATHS.SETTINGS)}>
									<ListItemIcon>
										<Settings fontSize="small" />
									</ListItemIcon>
									Settings
								</MenuItem>
								<MenuItem onClick={handleLogout}>
									<ListItemIcon>
										<Logout fontSize="small" />
									</ListItemIcon>
									Logout
								</MenuItem>
							</Menu>
						</div>
					</Box>
				</Toolbar>
				<Divider />
			</AppBar>
			<Drawer
				variant="permanent"
				open={open}
				PaperProps={{
					sx: {
						backgroundImage:
							"linear-gradient(to bottom, rgba(24, 29, 217, 1) 70%, rgba(24, 29, 217, 0.5))",
						color: "white",
						zIndex: 1100,
						backgroundColor: "none",
					},
				}}
			>
				<DrawerHeader>
					<div
						style={{
							borderRadius: "4px",
							marginLeft: "12px",
						}}
					>
						<img src={`${APP}_Logo.png`} style={{ width: "182px" }} />
					</div>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? (
							<ChevronRightIcon className="text-white" />
						) : (
							<ChevronLeftIcon className="text-white" />
						)}
					</IconButton>
				</DrawerHeader>
				{/* <Divider /> */}
				<List>
					{userData &&
						filteredMenuItems.map(({ text, icon, path, subItems, parent }, index) => (
							<>
								<ListItem key={index} disablePadding sx={{ display: "block" }}>
									<ListItemButton
										sx={{
											minHeight: 48,
											justifyContent: open ? "initial" : "center",
											px: 2.5,
											// color: "rgb(186 222 255)",
											color: "#FFFFFF",
											fontWeight: "600",
											fontSize: "18px",
											"&.Mui-selected": {
												backgroundColor: "#090ebe",
											},
										}}
										component={Link}
										onClick={() => handleMenuItemClick(text, parent)}
										selected={path === currentPagePath}
										to={path}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: open ? 3 : "auto",
												justifyContent: "center",
												"& span": {
													color: "#FFFFFF",
													fontWeight: "600",
													fontSize: "18px",
												},
											}}
										>
											{icon}
										</ListItemIcon>
										<ListItemText
											primary={text}
											sx={{
												opacity: open ? 1 : 0,
												"& span": {
													color: "#FFFFFF",
													fontWeight: "600",
													fontSize: "18px",
												},
											}}
										/>
										{subItems &&
											open &&
											(getIsOpenNestedMenu(text) ? <ExpandLess /> : <ExpandMore />)}
									</ListItemButton>
								</ListItem>
								<Collapse in={getIsOpenNestedMenu(text)} timeout="auto" unmountOnExit>
									<List disablePadding>
										{subItems &&
											subItems?.map(({ text, icon, path, parent }, index) => (
												<ListItemButton
													key={index}
													sx={{ pl: 4 }}
													component={Link}
													onClick={() => handleMenuItemClick(text, parent)}
													selected={path === currentPagePath}
													to={path}
												>
													<ListItemIcon>{icon}</ListItemIcon>
													<ListItemText primary={text} />
												</ListItemButton>
											))}
									</List>
								</Collapse>
							</>
						))}
				</List>
			</Drawer>
			<Box
				component="main"
				sx={{ flexGrow: 1, backgroundColor: COLORS.GHOST_WHITE, minHeight: "100vh" }}
			>
				<DrawerHeader />
				{loggedInUser && <Box sx={{ padding: "12px 24px 0 24px" }}>{children}</Box>}
			</Box>
		</Box>
	);
}
