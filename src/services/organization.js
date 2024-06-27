import { baseApi } from "./base";

export const organizationApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getOrganizations: builder.query({
			query: () => "/organizations/all",
		}),
		getSingleOrganization: builder.query({
			query: (payload) => `/organizations/${payload.id}`,
		}),
		addOrganization: builder.mutation({
			query: (payload) => ({
				url: "/organizations/create",
				method: "POST",
				body: payload,
			}),
		}),
		updateOrganization: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/organizations/update/${id}`,
				method: "PUT",
				body: payload,
			}),
		}),
		deleteOrganization: builder.mutation({
			query: (id) => ({
				url: `/organizations/delete/${id}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useGetOrganizationsQuery,
	useGetSingleOrganizationQuery,
	useAddOrganizationMutation,
	useUpdateOrganizationMutation,
	useDeleteOrganizationMutation,
} = organizationApi;
