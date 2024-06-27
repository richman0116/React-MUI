export const getLoadStatusColor = (status) => {
	switch (status) {
		case "Upcoming":
			return "#00008B";
		case "en Route":
			return "orange";
		case "Dispatched":
			return "#023020";
		case "Rolling to PU":
			return "yellow";
		case "At PU":
			return "orange";
		case "Loaded":
			return "#90EE90";
		case "Rolling to DO":
			return "yellow";
		case "At DO":
			return "orange";
		case "Unloaded":
			return "#90EE90";
		case "Resting":
			return "#ADD8E6";
		default:
			return "White";
	}
};

export const getLoadPaymentStatusColor = (status) => {
	switch (status) {
		case "Delivered":
			return "#00008B"; // Dark Blue
		case "Invoiced":
			return "orange"; // Orange
		case "Paid":
			return "#008000"; // Green
		case "DriverPaid":
			return "#008000"; // Green
		case "Overdue":
			return "red"; // Red
		case "Due":
			return "red"; // Red
		case "Cancelled":
			return "orange"; // Orange
		case "Issue":
			return "#90EE90"; // Light Green
		case "Factored":
			return "yellow"; // Yellow
		case "Not set":
			return "orange"; // Orange
		case "On Our Load":
			return "#9F90EF"; // Orange
		default:
			return "White"; // White
	}
};
