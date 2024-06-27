import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const baseApi = createApi({
	reducerPath: "baseApi",
	baseQuery: fetchBaseQuery({
		baseUrl: config.apiBaseUrl,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		prepareHeaders: (headers) => {
			const accessToken = localStorage.getItem(config.accessTokenName);
			if (accessToken) {
				headers.set("authorization", `Bearer ${accessToken}`);
			}
			return headers;
		},
	}),

	endpoints: () => ({}),
});
