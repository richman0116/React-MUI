import { baseApi } from "./base";

export const notificationApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query({
			query: () => "/notifications",
		}),
		getUserLoadByMonthUser: builder.query({
			query: (query = null) => {
				console.log(query);
				return `/by-user-month${query ? query : ""}`;
			},
		}),
		getDashboardData: builder.query({
			query: () => "/dashboard-data",
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useLazyGetUserLoadByMonthUserQuery,
	useGetDashboardDataQuery,
} = notificationApi;
