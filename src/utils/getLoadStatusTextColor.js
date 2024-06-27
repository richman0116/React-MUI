export const getLoadStatusTextColor = (status) => {
	switch (status) {
		case "Upcoming":
			return "white";
		case "Dispatched":
			return "white";
		default:
			return "black";
	}
};

export const getLoadPaymentStatusTextColor = (status) => {
	switch (status) {
		case "Delivered":
			return "white";
		case "Invoiced":
			return "black";
		case "Paid":
			return "white";
		case "DriverPaid":
			return "white";
		case "Overdue":
			return "white";
		case "Due":
			return "white";
		case "Cancelled":
			return "white";
		case "Issue":
			return "black";
		case "Factored":
			return "black";
		case "Not set":
			return "black";
		case "On Our Load":
			return "white";
		default:
			return "black";
	}
};
