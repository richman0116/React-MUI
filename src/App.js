// App.js
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-datetime/css/react-datetime.css";
import router from "./routes/router";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./shared/theme";
import { ToastContainer } from "react-toastify";
import { APP } from "./shared/constants";
import { ConfirmProvider } from "material-ui-confirm";
import BackDrop from "./components/BackDrop/BackDrop";
import "mapbox-gl/dist/mapbox-gl.css";
import CssBaseline from "@mui/material/CssBaseline";

const App = () => {
	useEffect(() => {
		document.title = `${APP} Dashboard`;

		const link = document.createElement("link");
		link.rel = "icon";
		// eslint-disable-next-line no-undef
		link.href = `${process.env.PUBLIC_URL}/${APP}_favicon.ico`;

		document.head.appendChild(link);
	}, []);

	return (
		<ConfirmProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ToastContainer />
				<BackDrop />
				<RouterProvider router={router} />
			</ThemeProvider>
		</ConfirmProvider>
	);
};

export default App;
