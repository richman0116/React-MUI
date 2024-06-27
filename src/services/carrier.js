import { baseApi } from "./base";

export const carrierApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getcarriers: builder.query({
			query: () => "/carriers",
		}),
		getSinglecarrier: builder.query({
			query: (payload) => `/carriers/${payload.id}`,
		}),
		addcarrier: builder.mutation({
			query: (payload) => ({
				url: "/carriers",
				method: "POST",
				body: payload,
			}),
		}),
		updatecarrier: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/carriers/${id}`,
				method: "PUT",
				body: payload,
			}),
		}),
	}),
});

export const {
	useGetcarriersQuery,
	useGetSinglecarrierQuery,
	useAddcarrierMutation,
	useUpdatecarrierMutation,
} = carrierApi;
