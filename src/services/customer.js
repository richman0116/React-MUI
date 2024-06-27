import { baseApi } from "./base";

export const customerApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCustomers: builder.query({
			query: () => "/customers",
		}),
		getSingleCustomer: builder.query({
			query: (payload) => `/customers/${payload.id}`,
		}),
		addCustomer: builder.mutation({
			query: (payload) => ({
				url: "/customers",
				method: "POST",
				body: payload,
			}),
		}),
		updateCustomer: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/customers/${id}`,
				method: "PUT",
				body: payload,
			}),
		}),
	}),
});

export const {
	useGetCustomersQuery,
	useGetSingleCustomerQuery,
	useAddCustomerMutation,
	useUpdateCustomerMutation,
} = customerApi;
