import { ASSET } from "../shared/serviceTags";
import { baseApi } from "./base";

export const assetsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAssets: builder.query({
			query: () => "/assets/all",
			providesTags: [ASSET],
		}),
		getHighestAssetId: builder.query({
			query: () => "/asset/top/max",
		}),
		getAssetsLz: builder.query({
			query: (query = null) => `/assets/all${query ? query : ""}`,
			providesTags: [ASSET],
		}),
		addAsset: builder.mutation({
			query: (payload) => ({
				url: "/asset/create",
				method: "POST",
				body: payload,
			}),
		}),
		updateAsset: builder.mutation({
			query: ({ id, payload }) => ({
				url: `/asset/update/${id}`,
				method: "PUT",
				body: payload,
			}),
		}),
		deleteAsset: builder.mutation({
			query: (id) => ({
				url: `/asset/delete/${id}`,
				method: "DELETE",
			}),
		}),
		holdAsset: builder.mutation({
			query: (payload) => ({
				url: "/asset/hold",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: [ASSET],
		}),
		unHoldAsset: builder.mutation({
			query: (payload) => ({
				url: "/asset/unhold",
				method: "POST",
				body: payload,
			}),
			invalidatesTags: [ASSET],
		}),
		searchAssets: builder.query({
			query: (searchText) => `/assets/search?query=${searchText}`,
			providesTags: [ASSET],
		}),
	}),
});

export const {
	useGetAssetsQuery,
	useAddAssetMutation,
	useUpdateAssetMutation,
	useDeleteAssetMutation,
	useHoldAssetMutation,
	useUnHoldAssetMutation,
	useSearchAssetsQuery,
	useLazyGetAssetsLzQuery,
	useGetHighestAssetIdQuery,
} = assetsApi;
