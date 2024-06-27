import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import ROUTES from ".";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Loads from "../pages/Loads";
import LoadDetails from "../pages/LoadDetails";
import Profile from "../pages/Profile";
import Customers from "../pages/Customers";
import Carriers from "../pages/Carriers";
import Settings from "../pages/Settings";
import Departments from "../pages/Departments";
import Assets from "../pages/Assets";
import AssetsLeafletMap from "../pages/AssetsLeafletMap";
import AddLoads from "../pages/AddLoads";
import Track from "../pages/Track";
import AccessManagement from "../pages/AccessManagement";
import TeamList from "../pages/TeamList";
import ManageUsers from "../pages/ManageUsers";
import Groups from "../pages/Groups";
import BrokerPayments from "../pages/BrokerPayments/BrokerPayments";
import DriverPayments from "../pages/DriverPayments/DriverPayments";
import RouteGuard from "./AuthGuard";
import Tracking from "../pages/Tracking/Tracking";
import { Upcoming } from "@mui/icons-material";
import Organizations from "../pages/Organizations/Organizations";
import RegisterUser from "../pages/Register/RegisterUser";
import RegisterDriver from "../pages/Register/RegisterDriver";
import RegisterOrg from "../pages/Register/RegisterOrg";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
const privateRoutes = [
	{
		path: ROUTES.PATHS.HOME,
		element: <Dashboard />,
		allowedAccess: { key: "Dashboard", access: [] },
	},
	{
		path: ROUTES.PATHS.LOADS,
		element: <Loads />,
		allowedAccess: { key: "Load", access: ["Read"] },
	},
	{
		path: ROUTES.PATHS.ADD_LOAD,
		element: <AddLoads />,
		allowedAccess: { key: "Load", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.LOAD_DETAILS,
		element: <LoadDetails />,
		allowedAccess: { key: "Load", access: ["Read"] },
	},
	{
		path: ROUTES.PATHS.ASSETS,
		element: <Assets />,
		allowedAccess: { key: "Asset", access: ["Read"] },
	},
	{
		path: ROUTES.PATHS.BROKER_PAYMENTS,
		element: <BrokerPayments />,
		allowedAccess: { key: "AccountingBroker", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.DRIVER_PAYMENTS,
		element: <DriverPayments />,
		allowedAccess: { key: "AccountingDriver", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.CARRIERS,
		element: <Carriers />,
		allowedAccess: { key: "Carriers", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.MANAGE_USERS,
		element: <ManageUsers />,
		allowedAccess: { key: "User", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.ORGANIZATIONS,
		element: <Organizations />,
		allowedAccess: { key: "Group", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.GROUPS,
		element: <Groups />,
		allowedAccess: { key: "Group", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.SETTINGS,
		element: <Settings />,
		allowedAccess: { key: "Settings", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.TEAM_LIST,
		element: <TeamList />,
		allowedAccess: { key: "Team", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.ACCESS_MANAGEMENT,
		element: <AccessManagement />,
		allowedAccess: { key: "AccessManagement", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.PROFILE,
		element: <Profile />,
		allowedAccess: { key: "Profile", access: [] },
	},
	{
		path: ROUTES.PATHS.DEPARTMENTS,
		element: <Departments />,
		allowedAccess: { key: "Departments", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.CUSTOMERS,
		element: <Customers />,
		allowedAccess: { key: "Customer", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.ASSETS_LEAFLET_MAP,
		element: <AssetsLeafletMap />,
		allowedAccess: { name: "map", key: "Asset", access: ["Read"] },
	},
	{
		path: ROUTES.PATHS.TRACK,
		element: <Track />,
		allowedAccess: { key: "Track", access: ["Read", "Create", "Update"] },
	},
	{
		path: ROUTES.PATHS.TRACKING,
		element: <Tracking />,
		allowedAccess: { key: "Tracking", access: ["Read", "Create", "Update"] },
	},
];

const createRoute = (allowedAccess, element) => {
	return (
		<PrivateRoute>
			<RouteGuard allowedAccess={allowedAccess} element={element} />
		</PrivateRoute>
	);
};

const router = createBrowserRouter([
	{ path: ROUTES.PATHS.SIGNUP, element: <RegisterUser /> },
	{ path: ROUTES.PATHS.SIGNUPDRIVER, element: <RegisterDriver /> },
	{ path: ROUTES.PATHS.SIGNUPORG, element: <RegisterOrg /> },
	{ path: ROUTES.PATHS.LOGIN, element: <Login /> },
	{ path: ROUTES.PATHS.FORGOT_PASS, element: <ForgetPassword /> },
	{ path: ROUTES.PATHS.RESET_PASS, element: <ResetPassword /> },
	{ path: ROUTES.PATHS.UPCOMING, element: <Upcoming /> },
	...privateRoutes.map((route) => ({
		path: route.path,
		element: createRoute(route.allowedAccess, route.element),
	})),
]);

export default router;
