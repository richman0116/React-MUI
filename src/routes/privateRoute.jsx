import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "../services/user";
import ROUTES from ".";
import { config } from "../config";
import { useCronJobsMutation } from "../services/load";

const PrivateRoute = ({ children }) => {
	const accessToken = localStorage.getItem(config.accessTokenName) || "";
	if (!accessToken) return <Navigate to={ROUTES.PATHS.LOGIN} />;

	const { data, isError } = useGetMeQuery(accessToken);

	const [runCronJobs] = useCronJobsMutation();

	useEffect(() => {
		if (data && data.success) {
			if (!data.user.isActive) {
				return <Navigate to={ROUTES.PATHS.INACTIVE_ACCOUNT} />;
			}
			const formData = { id: data.user._id, token: localStorage.getItem("elg:accessToken") };
			console.log("cron---jobs");
			runCronJobs(formData)
				.unwrap()
				.then((res) => {
					if (!res.validUser) {
						window.location.href = ROUTES.PATHS.LOGIN;
					}
				});
		}
	}, [data]);

	if (isError) {
		localStorage.removeItem(config.accessTokenName);
		return <Navigate to={ROUTES.PATHS.LOGIN} />;
	}

	return children;
};

export default PrivateRoute;
