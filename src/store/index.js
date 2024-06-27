import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import globalReducer from "./slice/globalSlice";
import { rtkQueryErrorLogger } from "./middleware/rtkQueryErrorLogger ";
import { baseApi } from "../services/base";

export const store = configureStore({
	reducer: {
		// Add the generated reducer as a specific top-level slice
		[baseApi.reducerPath]: baseApi.reducer,
		global: globalReducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware().concat(baseApi.middleware),
		rtkQueryErrorLogger,
	],
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
