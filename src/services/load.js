import { LOADS } from "../shared/serviceTags";
import { baseApi } from "./base";

export const loadApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getQuotes: builder.query({
			query: (query = null) => `/loads/all${query ? query : ""}`,
			providesTags: [LOADS],
		}),
		getDispatchedLoads: builder.query({
			query: (query = null) => `/loads/dispatched${query ? query : ""}`,
			providesTags: [LOADS],
		}),
		getExceptDispatchedLoads: builder.query({
			query: () => "/loads/not-dispatched",
			providesTags: [LOADS],
		}),
		getLoadIds: builder.query({
			query: () => "/loads/ids",
		}),
		getLoadById: builder.query({
			query: (id) => `/load/${id}`,
		}),
		getLoadIdMax: builder.query({
			query: () => "/load/max-load/max",
		}),
		getLoadCounts: builder.query({
			query: () => "load/counts/load",
		}),
		getLoadCountsAcc: builder.query({
			query: () => "load/counts/accounting",
		}),
		getSingleQuote: builder.query({
			query: (payload) => `/quote/${payload.id}`,
		}),
		addOrder: builder.mutation({
			query: (payload) => ({
				url: "/load/create",
				method: "POST",
				body: payload,
			}),
		}),
		deleteFiles: builder.mutation({
			query: (payload) => ({
				url: "/load/delete/files",
				method: "POST",
				body: payload,
			}),
		}),
		deleteLoad: builder.mutation({
			query: (id) => ({
				url: `/load/delete/${id}`,
				method: "DELETE",
			}),
		}),
		updateOrder: builder.mutation({
			query: ({ id, payload }) => {
				return {
					url: `/load/${id}`,
					method: "PUT",
					body: payload,
				};
			},
		}),
		updateLoadFile: builder.mutation({
			query: ({ id, payload }) => {
				return {
					url: `/load/${id}/update-load-file`,
					method: "PUT",
					body: payload,
					formData: true,
				};
			},
		}),
		updateHistoryLoad: builder.mutation({
			query: ({ id, payload }) => {
				return {
					url: `/load/history-status/${id}`,
					method: "PUT",
					body: payload,
				};
			},
		}),

		updateLoadStatus: builder.mutation({
			query: ({ id, status, payload }) => ({
				url: `/load/update-status/${id}/${status}`,
				method: "PUT",
				body: payload,
			}),
		}),

		updateLoadPaymentStatus: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/load/${id}/payment-status`,
				method: "PUT",
				body: payload,
			}),
		}),

		deleteMultipleLoads: builder.mutation({
			query: (payload) => {
				return {
					url: "/load_multiples/delete",
					method: "PUT",
					body: payload,
				};
			},
		}),

		cronJobs: builder.mutation({
			query: (payload) => ({
				url: "/cron-jobs",
				method: "POST",
				body: payload,
			}),
		}),

		addPrivateNote: builder.mutation({
			query: (payload) => ({
				url: `/load/${payload.id}/activity/create`,
				method: "POST",
				body: payload.body,
			}),
			invalidatesTags: [LOADS],
		}),
		sendCustomerMail: builder.mutation({
			query: (payload) => ({
				url: `/load/customer-mail/${payload.id}`,
				method: "POST",
				body: payload.body,
			}),
			invalidatesTags: [LOADS],
		}),
		updateHotLoad: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/load/${id}/hot-load`,
				method: "PUT",
				body: payload,
			}),
		}),
		updateLoadGoodToGo: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/load/${id}/good-to-go`,
				method: "PUT",
				body: payload,
			}),
		}),
	}),
});
export const {
	useLazyGetQuotesQuery,
	useCronJobsMutation,
	useGetLoadIdsQuery,
	useLazyGetLoadByIdQuery,
	useGetSingleQuoteQuery,
	useAddOrderMutation,
	useDeleteFilesMutation,
	useDeleteLoadMutation,
	useUpdateOrderMutation,
	useUpdateHistoryLoadMutation,
	useAddPrivateNoteMutation,
	useLazyGetDispatchedLoadsQuery,
	useGetExceptDispatchedLoadsQuery,
	useUpdateLoadStatusMutation,
	useDeleteMultipleLoadsMutation,
	useUpdateLoadPaymentStatusMutation,
	useSendCustomerMailMutation,
	useUpdateHotLoadMutation,
	useUpdateLoadGoodToGoMutation,
	useGetLoadCountsQuery,
	useGetLoadCountsAccQuery,
	useUpdateLoadFileMutation,
	useGetLoadIdMaxQuery,
} = loadApi;
