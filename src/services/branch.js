import { baseApi } from "./base";

export const branchApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllBranches: builder.query({
			query: () => "/branchs/all",
		}),

		addBranch: builder.mutation({
			query: (payload) => ({
				url: "/branch/create",
				method: "POST",
				body: payload,
			}),
		}),

		updateBranch: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/branch/update/${id}`,
				method: "PUT",
				body: payload,
			}),
		}),

		getBranchMemberById: builder.query({
			query: (id) => `/branch/${id}`,
		}),

		updateBranchFeatures: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/branch/${id}/features/update`,
				method: "PUT",
				body: payload,
			}),
		}),

		updateGroupFeatures: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/group/${id}/features/update`,
				method: "PUT",
				body: payload,
			}),
		}),

		updateBranchMember: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/branch/${id}/members/update`,
				method: "PUT",
				body: payload,
			}),
		}),
	}),
});

export const {
	useGetAllBranchesQuery,
	useAddBranchMutation,
	useUpdateBranchMutation,
	useGetBranchMemberByIdQuery,
	useUpdateBranchFeaturesMutation,
	useUpdateGroupFeaturesMutation,
	useUpdateBranchMemberMutation,
} = branchApi;
