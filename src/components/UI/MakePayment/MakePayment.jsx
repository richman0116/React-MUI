import React from "react";
import PaymentPreview from "./PaymentPreview";
import MUIModal from "../../MUIModal";

const MakePayment = ({ loadId = null, open, setOpen }) => {
	return (
		<>
			<MUIModal
				modalBodyComponent={<PaymentPreview loadId={loadId} setOpen={setOpen} />}
				showModal={open}
				setShowModal={setOpen}
				isFooter={false}
				isHeader={false}
				modalClassName={"w-437"}
				modalTitle="Payment"
				contentClass="p-2"
			/>
		</>
	);
};

export default MakePayment;
