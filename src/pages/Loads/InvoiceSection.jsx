import React, { useState } from "react";
import MUIModal from "../../components/MUIModal";
import { useForm } from "react-hook-form";
import Invoice from "../../components/UI/MakePayment/pdf/invoice";
import { formatDate } from "../../utils/dateUtils";
import globalUtils from "../../utils/globalUtils";
import LoadInvoice from "../BrokerPayments/LoadInvoice";
import { useUpdateOrderMutation } from "../../services/load";
import { toast } from "react-toastify";

const InvoiceSection = ({ showModal, setShowModal, load, customerData, handleInvoiceDownload }) => {
	const {
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
			load_date: formatDate(new Date()),
			load_reference: load.referenceNumber,
			weight: `${globalUtils.getLoadWeight(load)} lbs`,
			company_name: customerData.customerName,
			company_address: customerData.customerAddress,
			company_phone: customerData.customerNumber,
			billing_primary_contact: "",
			billing_primary_phone: "",
			billing_primary_fax: "",
			paytm_description: "Flat Rate",
			paytm_notes: "",
			paytm_quantity: 1,
			paytm_rate: 1 * load.customerRate,
			paytm_amount: load.customerRate,
		},
	});

	const [showModalPaid, setShowModalPaid] = useState(false);
	const [updateLoad] = useUpdateOrderMutation();

	const onSubmit = async (data) => {
		const date = data.lastDate;
		data.lastDate = date.format("MM/DD/YYYY, hh:mm A");
		const formData = {
			paymentStatus: load.customer && load.customer?.isApproved ? "Factored" : "Invoiced",
			brokerInvoicedInfo: {
				lastDate: data.lastDate,
			},
		};
		updateLoad({ id: load._id, payload: formData })
			.unwrap()
			.then(() => {
				setShowModalPaid(false);
				toast("Load payment status updated successfully!");
			});
		handleInvoiceDownload(data);
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<MUIModal
				showModal={showModal}
				setShowModal={setShowModal}
				modalTitle={"Edit Invoice"}
				closeBtn="Cancel"
				secondaryBtnText={"Update And Create Inovice"}
				handleClickSecondaryBtn={handleSubmit(onSubmit)}
				isSubmit={true}
				modalClassName="wd-80"
				modalBodyComponent={
					<Invoice
						setValue={setValue}
						register={register}
						errors={errors}
						watch={watch}
						control={control}
						load={load}
					/>
				}
			/>
			<MUIModal
				showModal={showModalPaid}
				setShowModal={setShowModalPaid}
				modalTitle="Load Paid"
				modalClassName="wd-65"
				isFooter={false}
				modalBodyComponent={<LoadInvoice currentData={load} setShowModalPaid={setShowModalPaid} />}
			/>
		</form>
	);
};

export default InvoiceSection;
