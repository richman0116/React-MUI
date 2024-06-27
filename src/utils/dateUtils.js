import moment from "moment";
import { DateFormat } from "../shared/constants";

// Function to pad single digits with a leading zero

const dateUtils = {
	defaultDate: (date) => {
		if (date) return moment(date).format(DateFormat.DEFAULT);
		return "";
	},
	llMonthFormat: (date) => {
		if (date) return moment(date).format("ll");
		return "";
	},
	currentTime: () => {
		/* 		const currentDate = new Date();
		const hours = currentDate.getHours();
		const minutes = currentDate.getMinutes();
		const seconds = currentDate.getSeconds();
		// Format the time with leading zeros if necessary
		const formattedTime = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);

		return formattedTime; */

		const timestamp = new Date();
		const formattedTimestamp = timestamp.toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});

		return formattedTimestamp;
	},
	differenceFromNow: (date) => {
		const cDate = moment(date);
		const currentDate = moment();

		const minutesAgo = currentDate.diff(cDate, "minutes");
		const hoursAgo = currentDate.diff(cDate, "hours");

		const minuteThreshold = 60;
		const hourThreshold = 24;

		let formattedOutput = "";

		if (minutesAgo < minuteThreshold) {
			formattedOutput = `${minutesAgo} minutes ago`;
		} else if (hoursAgo < hourThreshold) {
			formattedOutput = `${hoursAgo} hours ago`;
		} else if (currentDate.isSame(cDate, "day")) {
			formattedOutput = "a day ago";
		} else {
			formattedOutput = moment(cDate).format("MM-DD-YYYY, hh:mm A");
		}

		return formattedOutput;
	},
};

export const formatDate = (dateString) => {
	if (!dateString) return "";
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
};

export const formatTime = (dateString) => {
	if (!dateString) return "";
	return new Date(dateString).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

export const formatDateInET = (date) => {
	const options = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		timeZone: "America/New_York",
	};
	const formatter = new Intl.DateTimeFormat("en-US", options);
	return formatter.format(date);
};

export default dateUtils;
