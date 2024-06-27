// TableToolbar.js
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button } from "@mui/material";
import { config } from "../../config";
import axios from "axios";
import InvoicesSection from "../../pages/Loads/InvoicesSection";
import {
	Backdrop,
	CircularProgress,
} from "@mui/material";

const TableToolbar = ({ data, selected, handleDelete, handleFilter, title, fontSize }) => {

	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [customers, setCustomers] = useState([]);
	const [currentDatas, setCurrentDatas] = useState([]);
	const [backDropOpen, setBackDropOpen] = useState(false);

	const handleCreateInvoices = async () => {
		setBackDropOpen(true);
		const customersInvoiceData = [];

		const invoicesData = data.filter(dataInfo => selected.includes(dataInfo._id));
		console.log(invoicesData, "invoicesDat");

		const accessToken = localStorage.getItem(config.accessTokenName);
		
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "multipart/form-data",
		};
		for (let i = 0; i < invoicesData?.length; i++) {
			const customerRes = await axios.get(`${config.apiBaseUrl}/customers/${invoicesData[i].customer?._id}`, {
				headers,
			});
			customersInvoiceData.push(customerRes?.data.customer);
		}

		if (customersInvoiceData.length > 0) {
			setShowInvoiceModal(true);
			setCustomers(customersInvoiceData);
			setCurrentDatas(invoicesData);
			setBackDropOpen(false);
		}

	};


	return (
		<>
			<Toolbar
				sx={{
					pl: { sm: 2 },
					pr: { xs: 1, sm: 1 },
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					...(selected.length > 0 && {
						bgcolor: (theme) =>
							alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
					}),
				}}
			>
				{selected.length > 0 && (
					<Box
						sx={{
							display: "flex",
							flex: "1",
							gap: "5px",
							alignItems: "center",
							justifyContent: "flex-end",
						}}
					>
						<Button
							sx={{
								border: "2px solid #1976d2", // Adjust the color and size as needed
								borderRadius: "8px", // Optional: Adjust the border radius
								padding: "8px 16px", // Optional: Adjust the padding
								marginRight: "50px"
							}}
							onClick={handleCreateInvoices}
						>
							Create Invoices
						</Button>
						<div style={{ minWidth: "120px" }}>
							<b>{`${selected.length > 0 ? ` ${selected.length} Selected` : ""}`}</b>
						</div>
						<Tooltip title="Delete Selected">
							<IconButton onClick={handleDelete}>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					</Box>
				)}

				<Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto", gap: "8px" }}>
					{title}
				</Box>
			</Toolbar>
			{showInvoiceModal && (
				<InvoicesSection
					customerData={customers}
					showModal={showInvoiceModal}
					loads={currentDatas}
					setShowModal={setShowInvoiceModal}
				/>
			)}

			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={backDropOpen}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

		</>
	);
};

export default TableToolbar;
