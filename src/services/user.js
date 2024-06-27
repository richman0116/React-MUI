import { USER } from "../shared/serviceTags";
import { baseApi } from "./base";

export const userApi = baseApi.injectEndpoints({
	tagTypes: [USER],

	endpoints: (build) => ({
		userLogin: build.mutation({
			query: (data) => ({
				url: "/signin",
				method: "POST",
				body: data,
			}),
		}),
		userRegistration: build.mutation({
			query: (data) => ({
				url: "/signup",
				method: "POST",
				body: data,
			}),
		}),
		userLogout: build.query({
			query: () => "/logout",
		}),
		getMe: build.query({
			query: () => "/getme",
		}),
		statusUpdateToActive: build.mutation({
			query: ({ id, payload }) => ({
				url: `user/${id}/active`,
				method: "PUT",
				body: payload,
			}),
		}),
		getUsers: build.query({
			query: () => "/users",
		}),
		userUpdate: build.mutation({
			query: ({ id, data }) => ({
				url: `/user/${id}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: [USER],
		}),
		inviteMember: build.mutation({
			query: (payload) => ({
				url: "/invite",
				method: "POST",
				body: payload,
			}),
		}),
		forgetPassword: build.mutation({
			query: (payload) => ({
				url: "/forget-password",
				method: "POST",
				body: payload,
			}),
		}),
		resetPassword: build.mutation({
			query: (payload) => ({
				url: "/reset-password",
				method: "POST",
				body: payload,
			}),
		}),
	}),
});

export const {
	useUserLoginMutation,
	useUserRegistrationMutation,
	useGetMeQuery,
	useLazyUserLogoutQuery,
	useStatusUpdateToActiveMutation,
	useGetUsersQuery,
	useUserUpdateMutation,
	useInviteMemberMutation,
	useForgetPasswordMutation,
	useResetPasswordMutation,
} = userApi;
