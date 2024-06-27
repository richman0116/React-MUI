import { StyleSheet } from "@react-pdf/renderer";

export default StyleSheet.create({
	body: {
		paddingTop: 35,
		paddingBottom: 35,
		paddingHorizontal: 25,
		fontSize: 11,
	},
	fwMedium: {
		fontFamily: "Inter",
		fontWeight: "medium",
		fontSize: 10.5,
	},
	fwSemiBold: {
		fontFamily: "Inter",
		fontWeight: "semibold",
		fontSize: 10.5,
	},
	fwBold: {
		fontFamily: "Inter",
		fontWeight: "bold",
		fontSize: 10.5,
	},
	fs9: {
		fontSize: 9,
	},
	fs10: {
		fontSize: 10,
	},
	aBorder: {
		border: "1px solid black",
	},
	bBorder: {
		borderBottom: "1px solid black",
	},
	tBorder: {
		borderTop: "1px solid black",
	},
	rBorder: {
		borderRight: "1px solid black",
	},
	lBorder: {
		borderLeft: "1px solid black",
	},
	fDRow: {
		flexDirection: "row",
	},
	w100pc: {
		width: "100%",
	},
	w50pc: {
		width: "50%",
	},
	mb1: {
		marginBottom: 1,
	},
	companyLogo: {
		width: 70,
		height: 22.4,
	},
	actionTblPd: {
		paddingTop: 4,
		paddingBottom: 6,
		paddingHorizontal: 4,
	},
	payItemsPd: {
		paddingVertical: 4,
		paddingHorizontal: 4,
	},
	pageFooter: {
		position: "absolute",
		fontSize: 7,
		bottom: 15,
		left: 25,
		right: 25,
		color: "grey",
	},
	textSecondary: {
		color: "rgba(0,0,0,.45)",
	},
});
