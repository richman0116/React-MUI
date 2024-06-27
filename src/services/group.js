import { baseApi } from "./base";
import { GROUP } from "../shared/serviceTags";

export const groupApi = baseApi.injectEndpoints({
	tagTypes: [GROUP],

	endpoints: (build) => ({
		getAllGroups: build.query({
			query: () => "/groups/all",
		}),
		addGroup: build.mutation({
			query: (payload) => ({
				url: "/group/create",
				method: "POST",
				body: payload,
			}),
		}),
		addGroupFeatures: build.mutation({
			query: ({ id, features }) => ({
				url: `/group/${id}/features/add`,
				method: "PUT",
				body: { features },
			}),
		}),
		removeGroupFeatures: build.mutation({
			query: ({ id, features }) => ({
				url: `/group/${id}/features/remove`,
				method: "PUT",
				body: { features },
			}),
		}),
		updateGroupMember: build.mutation({
			query: ({ id, payload }) => ({
				url: `/group/${id}/members/update`,
				method: "PUT",
				body: payload,
			}),
		}),
	}),
});

export const {
	useGetAllGroupsQuery,
	useAddGroupMutation,
	useAddGroupFeaturesMutation,
	useRemoveGroupFeaturesMutation,
	useUpdateGroupMemberMutation,
} = groupApi;
