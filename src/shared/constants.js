import { config } from "../config";

export const CRM = {
	ELG: "ELG",
	GTMM: "GTMM",
};

export const APP = config.accessTokenName.startsWith("elg") ? CRM.ELG : CRM.GTMM;

export const ROLE = {
	ADMIN: "admin",
	EMPLOYEE: "employee",
};

export const QuoteStatus = {
	NEW: "NEW",
};
export const DateFormat = {
	DEFAULT: "YYYY-MM-DD",
};

export const AssetStatus = {
	AVAILABLE: "available",
	AVAILABLE_LOCALLY: "available_locally",
	AVAILABLE_ON: "available_on",
	NOT_AVAILABLE: "not_available",
	ON_OUR_LOAD: "on_our_load",
	OUT_OF_SERVICE: "out_of_service",
};

export const TruckTypes = [
	"Sprinter",
	"Box truck",
	"Cargo van",
	"Flatbed",
	"Semi trailer",
	"Reefer",
	"Container truck",
	"Dry van",
	"Jumbo trailer",
	"Tanker",
	"Pickup",
	"Trailer",
	"Dump truck",
	"Heavy truck",
	"Step deck",
	"Straight truck",
	"Tail lift truck",
	"Conestoga trailer",
	"Double drop",
	"Livestock truck",
	"RGN",
];

export const LoadStatus = [
	"Upcoming",
	"Dispatched",
	"en Route",
	"At PU",
	"At DO",
	"Unloaded",
	"Resting",
];

export const LoadStatusTracking = [
	"Upcoming",
	"Dispatched",
	"At PU",
	"en Route",
	"At DO",
	"Unloaded",
];

export const CustomerTypes = {
	SHIPPER: "shipper",
	BROKER: "broker",
};

export const CarrierTypes = {
	EXPEDITE: "Expedite",
	FTL: "FTL",
};

export const PaymentStatus = {
	PAID: "paid",
	PENDING: "pending",
	DUE: "due",
};

export const PaymentType = {
	INCOMING: "incoming",
	OUTGOING: "outgoing",
};

export const DriversCetifications = ["TWIC", "TSA", "TEAM", "HAZMAT", "LIFTGATE", "CANADA", "PPE"];
export const DriverStatus = {
	AVAILABLE: "available",
	NOT_AVAILABLE: "not_available",
};

export const ClosestLocationCount = 2;
export const StandardRadiusMiles = 150;

export const Cells = {
	LINK_CELL: "link-cell",
	DATE_CELL: "date-cell",
	ROLE_CELL: "role-cell",
	USER_AVATAR_CELL: "user-avatar-cell",
	USD_CELL: "usd-cell",
	INVOICE_STATUS_CELL: "invoice-status-cell",
	PRIMARY_COLORED_CELL: "primary-colored-cell",
	User_ISACTIVE_CELL: "user-isactive_cell",
};

// TODO add backend keys and use it where it needs/ like in columns for table

/* backend keys */
export const QuoteKeys = {
	NAME: "name",
	PHONE: "phone",
	EMAIL: "email",
	COMPANY_NAME: "companyName",
	TRUCK_LOAD_TYPE: "truckLoadType",
	TRUCK_LOAD_TYPE_NEEDED: "truckLoadTypeNeeded",
	REQUEST_DATE: "createdAt",
};

export const UserKeys = {
	EMAIL: "email",
	ROLE: "role",
	IS_ACTIVE: "isActive",
	CREATED_AT: "createdAt",
};

export const featureList = [
	{
		id: "1001",
		name: "load",
	},
	{
		id: "1002",
		name: "asset",
	},
	{
		id: "1003",
		name: "carrier",
	},
	{
		id: "1004",
		name: "user",
	},
	{
		id: "1005",
		name: "accounting",
	},
];
