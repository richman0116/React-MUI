import React, { useEffect, useState } from "react";
import { useGetMeQuery } from "../services/user";
import Loader from "../components/Loader/Loader";
import NotFound from "../pages/NotFound";
import AdminLayout from "../components/Layout/AdminLayout";
import useReactPath from "./useReactPath";

const RouteGuard = ({ allowedAccess, element }) => {
	const { data, isLoading, isFetching } = useGetMeQuery();

	const [isAuthorized, setIsAuthorized] = useState(false);

	const path = useReactPath();

	useEffect(() => {
		if (data && data.user && data.user.accessFeatures) {
			const userAccess = data.user.accessFeatures;
			if (userAccess && userAccess[allowedAccess.key]) {
				const isAccessAllowed = allowedAccess.access.every(
					(access) => userAccess[allowedAccess.key][access]
				);
				setIsAuthorized(isAccessAllowed);
			} else if (allowedAccess.key === "Dashboard") {
				setIsAuthorized(true);
			} else {
				setIsAuthorized(false);
			}
		}
	}, [path, allowedAccess, data]);

	return isAuthorized && allowedAccess?.name && allowedAccess?.name === "map" ? (
		element
	) : isAuthorized ? (
		<AdminLayout> {element} </AdminLayout>
	) : isFetching || isLoading ? (
		<Loader />
	) : (
		<NotFound />
	);
};

export default RouteGuard;
