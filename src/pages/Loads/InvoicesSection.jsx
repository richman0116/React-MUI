import React, { useState, useEffect } from "react";
import MUIModal from "../../components/MUIModal";
import { useForm, Controller } from "react-hook-form";
import Invoices from "../../components/UI/MakePayment/pdf/invoice/invoices";
import { formatDate } from "../../utils/dateUtils";
import globalUtils from "../../utils/globalUtils";
import LoadInvoice from "../BrokerPayments/LoadInvoice";
import { useUpdateOrderMutation } from "../../services/load";
import { toast } from "react-toastify";
import Invoice from "../../components/LoadDocuments/Invoice";
import { useGetMeQuery } from "../../services/user";
import { useLazyGetDispatchedLoadsQuery, useGetLoadCountsAccQuery } from "../../services/load";
import { config } from "../../config";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

const InvoicesSection = ({ showModal, setShowModal, loads, customerData }) => {


  const [triggerLoads, { data: quotesData, isFetching: isLoading }] =
		useLazyGetDispatchedLoadsQuery();
  const { data: userData } = useGetMeQuery();
  const { data: loadCounts, refetch: refetchLoadCounts } = useGetLoadCountsAccQuery();
  const [showModalPaid, setShowModalPaid] = useState(false);
  const [updateLoad] = useUpdateOrderMutation();
  const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQueryBroker);


  const { register, watch, handleSubmit, setValue, control, formState: { errors } } = useForm();

  useEffect(() => {
    loads.forEach((load, index) => {
      setValue(`_id_${index}`, load._id);
      setValue(`address_1_${index}`, "6363 RICHMOND AVE STE 515");
      setValue(`address_2_${index}`, "HOUSTON, TX 77057");
      setValue(`docket_${index}`, "MC01507197");
      setValue(`phone_${index}`, "(713) 291-5337");
      setValue(`loadId_${index}`, load.loadId);
      setValue(`load_date_${index}`, formatDate(new Date()));
      setValue(`load_reference_${index}`, load.referenceNumber);
      setValue(`weight_${index}`, `${globalUtils.getLoadWeight(load)} lbs`);
      setValue(`company_name_${index}`, customerData[index].customerName);
      setValue(`company_address_${index}`, customerData[index].customerAddress);
      setValue(`company_phone_${index}`, customerData[index].customerNumber);
      setValue(`paytm_description_${index}`, "Flat Rate");
      setValue(`paytm_notes_${index}`, "");
      setValue(`paytm_quantity_${index}`, 1);
      setValue(`paytm_rate_${index}`, 1 * load.customerRate);
      setValue(`paytm_amount_${index}`, load.customerRate);
    });
  }, [loads, customerData, setValue]);


  const fileUpload = async (id, formData) => {
    const accessToken = localStorage.getItem(config.accessTokenName);
		try {
			const res = await axios.put(`${config.apiBaseUrl}/load/${id}/upload-invoice`, formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "multipart/form-data",
				},
			});
			triggerLoads(lastLoadsQuery, false);
			refetchLoadCounts();
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
	};

  const getActualLoad = (load) => {
    console.log(load);
		const actualLoadArr = loads.map((item) => {
			if (item._id === load._id) return item;
		});
		const actualLoad = actualLoadArr.filter((item) => item !== null && item !== undefined);
		return actualLoad[0];
	};

  const handleInvoiceDownload = async (loadsData) => {
    for (let i = 0; i < loadsData.length; i++) {
      console.log(i);
      try {
        setShowModal(false);
        const blob = await pdf(
          <Invoice load={loadsData[i]} userData={userData} loadApiData={getActualLoad(loadsData[i])} />
        ).toBlob();
  
        // Trigger download using saveAs
        saveAs(blob, `load_invoice_${loadsData[i].loadId}.pdf`);
  
        // Create FormData object
        const formData = new FormData();
        formData.append("invoicedFile", blob, `load_invoice_${loadsData[i].loadId}.pdf`);
  
        // Upload FormData to backend
        await fileUpload(loadsData[i]._id, formData);
  
        console.log("Download and upload successful");
      } catch (error) {
        console.error("Error performing download and upload", error);
      }
    }
	};

  const transformData = (data) => {
    const keys = Object.keys(data);
    let separatedCount = 0;
    const aloneKeys = [];
    const repeatedKeys = [];
    keys.forEach((key) => {
      const seps = key.split("_");
      const temp = parseInt(seps[seps.length - 1]);
      if (Number.isInteger(temp)) {
      	if(separatedCount <= temp) {
        	separatedCount++;
        }
        const newKey = seps.slice(0, -1).join("_");
        if(!repeatedKeys.includes(newKey))
          repeatedKeys.push(newKey);
      } else {
        aloneKeys.push(key);
      }
    });

    let result = [];

    for (let i = 0; i <= separatedCount-1; i++) {
      let newObj = {};
      repeatedKeys.forEach(key => {
        newObj[key] = data[`${key}_${i}`];
      });
      aloneKeys.forEach(key => {
        newObj[key] = data[key];
      });
      result.push(newObj);
    }

    return result;
  };


  const onSubmit = async (data) => {

    const date = data.lastDate;
    data.lastDate = date.format("MM/DD/YYYY, hh:mm A");

    const result = transformData(data);
    console.log(result, "result");  

    // const formData = loads.map((load, index) => ({
    //   id: load._id,
    //   payload: {
    //     paymentStatus: load.customer && load.customer?.isApproved ? "Factored" : "Invoiced",
    //     brokerInvoicedInfo: {
    //       lastDate: data[`lastDate_${index}`],
    //     },
    //   },
    // }));

    // for (let i = 0; i < formData.length; i++) {
    //   await updateLoad(formData[i]).unwrap();
    // }

    // setShowModalPaid(false);
    // toast("Load payment statuses updated successfully!");

    handleInvoiceDownload(result);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Edit Invoices</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MUIModal
          showModal={showModal}
          setShowModal={setShowModal}
          modalTitle={"Edit Invoices"}
          closeBtn="Cancel"
          secondaryBtnText={"Update And Create Invoices"}
          handleClickSecondaryBtn={handleSubmit(onSubmit)}
          isSubmit={true}
          modalClassName="wd-80"
          modalBodyComponent={
            <>
              {loads.map((load, index) => (
                <div key={load._id}>
                  <input type="hidden" {...register(`_id_${index}`)} />
                  <Invoices
                    setValue={setValue}
                    register={register}
                    errors={errors}
                    watch={watch}
                    control={control}
                    load={load}
                    index={index} // Pass the index to Invoice component to differentiate form fields
                  />
                </div>
              ))}
            </>
          }
        />
        <MUIModal
          showModal={showModalPaid}
          setShowModal={setShowModalPaid}
          modalTitle="Load Paid"
          modalClassName="wd-65"
          isFooter={false}
          modalBodyComponent={<LoadInvoice currentData={loads[0]} setShowModalPaid={setShowModalPaid} />} // Assuming one load for LoadInvoice
        />
      </form>
    </>
  );
};

export default InvoicesSection;
