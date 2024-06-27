import React from "react";
import AppNavbar from "../AppNavbar";

const AdminLayout = ({ children }) => {
	return (
		<main>
			<AppNavbar>{children}</AppNavbar>
		</main>
	);
};

export default AdminLayout;
