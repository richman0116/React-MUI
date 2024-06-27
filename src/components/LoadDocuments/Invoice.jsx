import React from "react";
import { Page, Text, Document, Image, View, Font } from "@react-pdf/renderer";
import InterBold from "../../assets/fonts/Inter-Bold.ttf";
import InterSemiBold from "../../assets/fonts/Inter-SemiBold.ttf";
import InterMedium from "../../assets/fonts/Inter-Medium.ttf";
import styles from "./styles";
import { APP, ROLE } from "../../shared/constants";
import { config } from "../../config";

const getBOLBasicInfo = (load) => {
	return [
		{ title: "Invoice #", value: load.loadId },
		{ title: "Date", value: load.load_date },
		{ title: "Reference", value: load.load_reference },
		{ title: "Weight", value: load.weight },
		// { title: "Distance", value: "18 miles" },
	];
};

const getCustomerC2Info = (load) => {
	return [
		{ title: "Primary Contact", value: load.billing_primary_contact },
		{ title: "Phone", value: load.billing_primary_phone },
		{ title: "Fax", value: load.billing_primary_fax },
	];
};

Font.register({
	family: "Inter",
	fonts: [
		{
			src: InterMedium,
			fontWeight: 500,
		},
		{
			src: InterSemiBold,
			fontWeight: 600,
		},
		{
			src: InterBold,
			fontWeight: 700,
		},
	],
});

const Invoice = ({ load, userData, loadApiData }) => {
	return (
		<Document>
			<Page style={styles.body} size="A4">
				<View style={[styles.w100pc, styles.fDRow, { marginBottom: "12px" }]}>
					<View style={[styles.w50pc, { paddingRight: "10px" }]}>
						<Image style={[styles.companyLogo, { marginBottom: "12px" }]} src={`${APP}_Logo.png`} />
						<Text style={styles.mb1}>{load.address_1}</Text>
						<Text style={styles.mb1}>{load.address_2}</Text>
						{/* <Text style={styles.mb1}>
							<Text style={styles.fwSemiBold}>Docket: </Text>
							<Text>{load.docket}</Text>
						</Text> */}
						<Text style={styles.mb1}>
							<Text style={styles.fwSemiBold}>Phone: </Text>
							<Text>{load.phone}</Text>
						</Text>
					</View>
					<View style={[styles.w50pc, { paddingLeft: "10px" }]}>
						<Text style={[{ marginBottom: "8px" }, styles.fwSemiBold]}>INVOICE</Text>
						{getBOLBasicInfo(load).map((item) => (
							<View key={item.title} style={[styles.fDRow, styles.w100pc, styles.fs10, styles.mb1]}>
								<Text style={[styles.fwSemiBold, styles.fs10, { width: "22%" }]}>{item.title}</Text>
								<Text>{item.value}</Text>
							</View>
						))}
					</View>
				</View>

				<View>
					<Text style={[styles.bBorder, styles.fwSemiBold]}>Customer Information</Text>
					<View style={[styles.fDRow, styles.w100pc, styles.fs10, { marginTop: "4px" }]}>
						<View style={[styles.w50pc, { paddingRight: "10px" }]}>
							<Text style={[styles.fwSemiBold, styles.fs10, styles.mb1]}>{load.company_name}</Text>
							<Text style={styles.mb1}>{load.company_address}</Text>
							<Text>{load.company_phone}</Text>
						</View>
						<View style={[styles.w50pc, { paddingLeft: "10px" }]}>
							{getCustomerC2Info(load).map((item) => (
								<View key={item.title} style={[styles.fDRow, styles.mb1, { alignItems: "center" }]}>
									<Text style={[styles.fwSemiBold, styles.fs10]}>{item.title} </Text>
									<Text>{item.value}</Text>
								</View>
							))}
						</View>
					</View>
				</View>

				<View style={{ marginTop: "12px", marginBottom: "8px" }}>
					<Text style={[styles.bBorder, styles.fwSemiBold, { paddingBottom: "1px" }]}>
						Pay Items
					</Text>
					<View style={[styles.fDRow, styles.w100pc, { marginVertical: "4px" }]}>
						<View style={{ width: "29%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Description</Text>
						</View>
						<View style={{ width: "29%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Notes</Text>
						</View>
						<View style={{ width: "14%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Quantity</Text>
						</View>
						<View style={{ width: "14%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Rate</Text>
						</View>
						<View style={{ width: "14%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Amount</Text>
						</View>
					</View>
					<View style={[styles.aBorder, styles.fs10]}>
						<View style={[styles.fDRow, styles.w100pc]}>
							<View style={[{ width: "29%" }, styles.rBorder]}>
								<Text style={styles.payItemsPd}>{load.paytm_description}</Text>
							</View>
							<View style={[{ width: "29%" }, styles.rBorder]}>
								<Text style={styles.payItemsPd}>{load.paytm_notes}</Text>
							</View>
							<View style={[{ width: "14%" }, styles.rBorder]}>
								<Text style={[styles.payItemsPd, { textAlign: "right" }]}>
									{load.paytm_quantity}
								</Text>
							</View>
							<View style={[{ width: "14%" }, styles.rBorder]}>
								<Text style={[styles.payItemsPd, { textAlign: "right" }]}>{load.paytm_rate}</Text>
							</View>
							<View style={{ width: "14%" }}>
								<Text style={[styles.payItemsPd, { textAlign: "right" }]}>
									$ {load.paytm_amount}
								</Text>
							</View>
						</View>
					</View>
					<View style={[styles.fDRow, styles.w100pc]}>
						<View style={{ width: "29%" }}>
							<Text style={[styles.fwSemiBold, styles.payItemsPd, styles.fs10]}>Total</Text>
						</View>
						<View style={{ width: "29%" }}></View>
						<View style={{ width: "14%" }}></View>
						<View style={{ width: "14%" }}></View>
						<View style={{ width: "14%" }}>
							<Text
								style={[styles.fwSemiBold, styles.payItemsPd, styles.fs10, { textAlign: "right" }]}
							>
								$ {load.paytm_amount}
							</Text>
						</View>
					</View>
				</View>

				<View>
					<Text style={[styles.bBorder, styles.fwSemiBold]}>Stops / Actions</Text>
					<View style={[styles.fDRow, styles.w100pc, { marginVertical: "4px" }]}>
						<View style={{ width: "4%" }}>
							<Text style={styles.fs10}>#</Text>
						</View>
						<View style={{ width: "10%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Action</Text>
						</View>
						<View style={{ width: "29%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Date/Time</Text>
						</View>
						<View style={{ width: "29%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Location</Text>
						</View>
						<View style={{ width: "29%" }}>
							<Text style={[styles.fwSemiBold, styles.fs10]}>Contact</Text>
						</View>
					</View>
					<View style={[styles.aBorder, styles.fs10]}>
						<View style={styles.bBorder}>
							<View>
								<View style={[styles.fDRow, styles.w100pc]}>
									<View style={[{ width: "4%" }, styles.rBorder]}>
										<Text style={{ textAlign: "center", paddingTop: 4 }}>1</Text>
									</View>
									<View style={[{ width: "10%" }, styles.rBorder, styles.bBorder]}>
										<Text style={styles.actionTblPd}>Pickup</Text>
									</View>
									<View style={[{ width: "29%" }, styles.rBorder, styles.bBorder]}>
										{loadApiData.pickUpList.map((pickup, index) => (
											<Text key={pickup._id} style={styles.actionTblPd}>
												{load[`p_date${index}`]}
											</Text>
										))}
									</View>
									<View style={[{ width: "29%" }, styles.rBorder, styles.bBorder]}>
										{loadApiData.pickUpList.map((pickup, index) => (
											<Text key={pickup._id} style={[{ width: "145px" }, styles.actionTblPd]}>
												{load[`p_location${index}`]}
											</Text>
										))}
									</View>
									<View style={[{ width: "29%" }, styles.bBorder]}>
										{loadApiData.pickUpList.map((pickup, index) => (
											<Text key={pickup._id} style={styles.actionTblPd}>
												<Text style={[styles.fwSemiBold, styles.fs10]}>Phone:</Text>
												{load[`p_phone${index}`]}
											</Text>
										))}
									</View>
								</View>
								<View style={styles.fDRow}>
									<View style={[{ width: "4%" }, styles.rBorder]}></View>
									<View style={styles.actionTblPd}>
										<Text>
											<Text style={[styles.fwSemiBold, styles.fs10]}>References: </Text>
											{load.p_references}
										</Text>
									</View>
								</View>
							</View>
						</View>
						<View style={[styles.fDRow, styles.w100pc]}>
							<View style={[{ width: "4%" }, styles.rBorder]}>
								<Text style={{ textAlign: "center", paddingTop: 4 }}>2</Text>
							</View>
							<View style={[{ width: "10%" }, styles.rBorder]}>
								<Text style={styles.actionTblPd}>Delivery</Text>
							</View>
							<View style={[{ width: "29%" }, styles.rBorder]}>
								{loadApiData.destinationList.map((destination, index) => (
									<Text key={destination._id} style={styles.actionTblPd}>
										{load[`d_date${index}`]}
									</Text>
								))}
							</View>
							<View style={[{ width: "29%" }, styles.rBorder]}>
								{loadApiData.destinationList.map((destination, index) => (
									<Text
										key={destination._id}
										style={{
											width: "145px",
											paddingTop: 4,
											paddingBottom: 6,
											paddingHorizontal: 4,
										}}
									>
										{load[`d_location${index}`]}
									</Text>
								))}
							</View>
							<View style={{ width: "29%" }}>
								{loadApiData.destinationList.map((destination, index) => (
									<Text key={destination._id} style={styles.actionTblPd}>
										<Text style={[styles.fwSemiBold, styles.fs10]}>Phone: </Text>
										{load[`d_phone${index}`]}
									</Text>
								))}
							</View>
						</View>
					</View>
				</View>

				<View fixed style={styles.pageFooter}>
					<Text
						render={({ pageNumber, totalPages }) => `Page ${pageNumber} out of ${totalPages}`}
					/>
					<Text style={{ position: "absolute", left: 0, right: 0, textAlign: "center" }}>
						Load #{load.loadId}
					</Text>
					<Text style={{ position: "absolute", right: 0, textAlign: "right" }}>
						{userData.user.role === ROLE.ADMIN ? userData.user.name : userData.user.userInfo.name} (
						{config.company.name})
					</Text>
				</View>
			</Page>
		</Document>
	);
};

export default Invoice;
