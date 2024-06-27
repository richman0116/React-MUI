import { baseApi } from "./base";

export const paymentApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getPayments: builder.query({
			query: (q) => `/load/payments/all${q}`,
			providesTags: ["Payment"],
		}),
		// getLoadIds: builder.query({
		// 	query: () => "/loads/ids",
		// }),
		// getLoadById: builder.query({
		// 	query: (id) => `/load/${id}`,
		// }),
		// getSingleQuote: builder.query({
		// 	query: (payload) => `/quote/${payload.id}`,
		// }),
		// addOrder: builder.mutation({
		// 	query: (payload) => ({
		// 		url: "/load/create",
		// 		method: "POST",
		// 		body: payload,
		// 	}),
		// }),
		addPayment: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/load/${id}/payment/create`,
				method: "POST",
				body: payload,
			}),
		}),
		updatePayment: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/load/${id}/payment/update`,
				method: "PUT",
				body: payload,
			}),
		}),
	}),
});

export const { useLazyGetPaymentsQuery, useAddPaymentMutation, useUpdatePaymentMutation } =
	paymentApi;
