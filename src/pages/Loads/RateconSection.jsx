import React from "react";
import MUIModal from "../../components/MUIModal";
import { useForm } from "react-hook-form";
import Ratecon from "../../components/UI/MakePayment/pdf/Ratecon";
import dateUtils from "../../utils/dateUtils";
import { getDistance } from "geolib";
import globalUtils from "../../utils/globalUtils";
import { config } from "../../config";

const RateconSection = ({ showModal, setShowModal, load, customerData, handleRateconDownload }) => {
	const calculateDistance = (geoCodePick, geoCodeDes) => {
		const assetLat = geoCodeDes[0];
		const assetLng = geoCodeDes[1];
		const searchLat = geoCodePick[0];
		const searchLng = geoCodePick[1];

		const distanceMeters = getDistance(
			{ latitude: searchLat, longitude: searchLng },
			{ latitude: assetLat, longitude: assetLng },
			{ unit: "meters" }
		);

		const distanceMiles = distanceMeters * 0.000621371192; // Convert meters to miles

		return distanceMiles.toFixed(2);
	};

	const {
		reset,
		register,
		watch,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			_id: load._id,
			address_1: "6363 RICHMOND AVE STE 515",
			address_2: "HOUSTON, TX 77057",
			docket: "MC01507197",
			phone: "(713) 291-5337",
			loadId: load.loadId,
			equipment: load.truckType,
			// equipment_length: "",
			// distance: `${calculateDistance(load.geoCodePick, load.geoCodeDes)} m`,
			distance: "",
			load_date: dateUtils.defaultDate(Date.now()),
			weight: `${globalUtils.getLoadWeight(load)} lbs`,
			notes: load.notesPrivate,
			carrier_name: load?.carrier?.name,
			carrier_address: load?.carrier?.address,
			carrier_phone: load?.carrier?.phone,
			carrier_mc_number: load.carrier?.mcNumber,
			carrier_primary_contact: "",
			carrier_primary_phone: "",
			carrier_primary_fax: "",
			driver: load.asset?.assignedDrivers,
			driver_phone: load.asset?.contactNumber,
			driver_email: load.asset?.email,
			driver_fax: "",
			paytm_description: "Flat Rate",
			quantity: 1,
			rate: load.driverRate,
			amount: 1 * load.driverRate,
			total_amount: 1 * load.driverRate,
			description:
				"the property described above in apparent good order, except as noted (contents and condition of contents of packages unknown), marked, consigned and destined as indicated above which said carrier (the word carrier being understood throughout the contract as meaning any person or corporation in possession of the property under the contract) agrees to carry to its usual place of delivery at said destination, if on its route, otherwise to deliver to another carrier on the route to said destination. It is mutually agreed as to each carrier of all or any of said property over all or any portion of said route to destination and as to each party at any time interested in all or any said property, that every service to be performed hereunder shall be subject to all the bill of lading terms and conditions in the governing classication NMFC 100 on the date of the shipment. Shipper hereby certies that he is familiar with all the bill of lading terms and conditions in the governing classication NMFC 100 and the said terms and conditions are hereby agreed to by the shipper and accepted for himself and his assigns",
			to_shipper:
				"To Shipper: Please review and conrm the accuracy of the information contained in this bill of lading and revise as needed.",
			to_carrier:
				"To Carrier: Notations such as STC (said to contain), SWP (shrink wrap pallet) will not be accepted and will not insulate carrier from liability in the event that the number of shipping units received is less than indicated above.",
			notice:
				"*** DRIVER MUST VERIFY PIECE COUNTS *** DISCREPANCIES MUST BE REPORTED WITHIN 48 HOURS OF PICK UP***",
			ratecon_notes_1: `Please email all invoices to ${config.company.invoiceEmail}`,
			ratecon_notes_2: `Please email all NOA's to ${config.company.noaEmail}`,
			ratecon_notes_3: `General accounting questions, please email ${config.company.accountingEmail}`,
		},
	});

	const onSubmit = async (data) => {
		handleRateconDownload(data);
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<MUIModal
				showModal={showModal}
				setShowModal={setShowModal}
				modalTitle={"Edit Ratecon"}
				closeBtn="Cancel"
				secondaryBtnText={"Generate PDF"}
				handleClickSecondaryBtn={handleSubmit(onSubmit)}
				isSubmit={true}
				modalClassName="wd-80"
				modalBodyComponent={
					<Ratecon
						setValue={setValue}
						register={register}
						errors={errors}
						watch={watch}
						control={control}
						load={load}
					/>
				}
			/>
		</form>
	);
};

export default RateconSection;
