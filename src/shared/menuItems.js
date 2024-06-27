import {
	AccountBalanceWalletRounded,
	AccountBoxRounded,
	AccountCircle,
	Dashboard,
	Garage,
	PeopleAltRounded,
	Settings,
	Groups2,
	DonutSmall,
} from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import ROUTES from "../routes";
import loadIcon from "../assets/icons/load-menu.png";
import brokerIcon from "../assets/icons/broker-menu.png";
import driverIcon from "../assets/icons/driver-menu.png";

export const menuItems = [
	{
		text: "Dashboard",
		icon: <Dashboard className="menu-icon" />,
		path: ROUTES.PATHS.HOME,
		key: "Dashboard",
		parent: "Dashboard",
		active: 1,
	},
	{
		text: "Loads",
		icon: <img className="menu-img" src={loadIcon} alt="Load Icon" />,
		path: ROUTES.PATHS.LOADS,
		key: "Load",
		parent: "Loads",
		active: 1,
	},
	{
		text: "Tracking",
		icon: <DonutSmall className="menu-icon" />,
		path: ROUTES.PATHS.TRACKING,
		key: "Tracking",
		parent: "Tracking",
		active: 1,
	},
	{
		text: "Assets",
		parent: "Assets",
		icon: <Garage className="menu-icon" />,
		path: ROUTES.PATHS.ASSETS,
		key: "Asset",
		active: 1,
	},

	{
		text: "Customers",
		icon: <AccountBoxRounded className="menu-icon" />,
		path: ROUTES.PATHS.CUSTOMERS,
		key: "Customer",
		parent: "Customers",
		active: 1,
	},
	// {
	// 	text: "Carriers",
	// 	icon: <DirectionsBus className="menu-icon" />,
	// 	path: ROUTES.PATHS.CARRIERS,
	// 	key: "carrier",
	// 	parent: "Carriers",
	// 	active: config.appType && config.appType === "gtmm" ? 0 : 1,
	// },
	{
		text: "Accountings",
		icon: <AccountBalanceWalletRounded className="menu-icon" />,
		key: "Accounting",
		active: 1,
		parent: "Accountings",
		subItems: [
			{
				text: "Broker",
				key: "AccountingBroker",
				icon: <img className="menu-img" src={brokerIcon} alt="Broker Icon" />,
				path: ROUTES.PATHS.BROKER_PAYMENTS,
				parent: "Accountings",
			},
			{
				text: "Driver",
				key: "AccountingDriver",
				icon: <img className="menu-img" src={driverIcon} alt="Load Icon" />,
				path: ROUTES.PATHS.DRIVER_PAYMENTS,
				parent: "Accountings",
			},
		],
	},
	{
		text: "Users",
		key: "User",
		icon: <PeopleAltRounded className="menu-icon" />,
		active: 1,
		parent: "Users",
		subItems: [
			{
				text: "Manage Users",
				icon: <ManageAccountsIcon className="menu-icon" />,
				path: ROUTES.PATHS.MANAGE_USERS,
				parent: "Users",
				key: "User",
			},
			{
				text: "Groups",
				icon: <GroupsIcon className="menu-icon" />,
				path: ROUTES.PATHS.GROUPS,
				parent: "Users",
				key: "Group",
			},
		],
	},
	{
		text: "Organizations",
		parent: "Organizations",
		icon: <CorporateFareIcon className="menu-icon" />,
		active: 1,
		path: ROUTES.PATHS.ORGANIZATIONS,
		key: "Organization",
	},
	{
		text: "Team",
		parent: "Team",
		icon: <Groups2 className="menu-icon" />,
		active: 1,
		path: ROUTES.PATHS.TEAM_LIST,
		key: "Team",
	},
	{
		text: "Profile",
		parent: "Profile",
		icon: <AccountCircle className="menu-icon" />,
		active: 1,
		path: ROUTES.PATHS.PROFILE,
		key: "Profile",
	},
	{
		text: "Settings",
		parent: "Settings",
		icon: <Settings className="menu-icon" />,
		active: 1,
		path: ROUTES.PATHS.SETTINGS,
		key: "Settings",
	},
];

// UPDATE THIS: if menu has nested sunmenu
export const initialSubMenuState = [
	{ identifier: "Accountings", isOpen: false },
	{ identifier: "Users", isOpen: false },
];
