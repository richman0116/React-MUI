import { createAction, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../services/user";
import { initialSubMenuState } from "../../shared/menuItems";

export const revertAll = createAction("REVERT_ALL");

const initialState = {
	isSidebarContracted: false,
	loggedInUser: null,
	updatingLocation: false,
	loadsActiveFilter: "active",
	brokerActiveFilter: "delivered",
	driverActiveFilter: "delivered",
	currentCustomerDt: null,
	collapseNestedItemOpen: initialSubMenuState,
	backDropOpen: false,
	mapTheme: 1,
	lastLoadsQuery: "",
	lastLoadsQueryBroker: "",
	lastLoadsQueryDriver: "",
};

export const globalSlice = createSlice({
	name: "global",
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(revertAll, () => initialState)
			// .addMatcher(userApi.endpoints.getMe.matchPending, (_state, action) => {
			//   console.log('pending', action)
			// })
			.addMatcher(userApi.endpoints.getMe.matchFulfilled, (state, action) => {
				state.loggedInUser = action.payload;
			});
		// .addMatcher(userApi.endpoints.getMe.matchRejected, (state, action) => {
		//   // console.log('rejected', action)
		// })
	},
	reducers: {
		setIsSidebarContracted: (state, action) => {
			state.isSidebarContracted = action.payload;
		},
		setLoggedInUser: (state, action) => {
			state.loggedInUser = action.payload;
		},
		setUpdatingLocation: (state, action) => {
			state.updatingLocation = action.payload;
		},
		setLoadsActiveFilter: (state, action) => {
			state.loadsActiveFilter = action.payload;
		},
		setBrokerActiveFilter: (state, action) => {
			state.brokerActiveFilter = action.payload;
		},
		setDriverActiveFilter: (state, action) => {
			state.driverActiveFilter = action.payload;
		},
		setCurrentCustomerDt: (state, action) => {
			state.currentCustomerDt = action.payload;
		},
		setCollapseNestedItemOpen: (state, action) => {
			state.collapseNestedItemOpen = action.payload;
		},
		setBackDropOpen: (state, action) => {
			state.backDropOpen = action.payload;
		},
		setMapTheme: (state, action) => {
			state.mapTheme = action.payload;
		},
		setLastLoadsQuery: (state, action) => {
			state.lastLoadsQuery = action.payload;
		},
		setLastLoadsQueryBroker: (state, action) => {
			state.lastLoadsQueryBroker = action.payload;
		},
		setLastLoadsQueryDriver: (state, action) => {
			state.lastLoadsQueryDriver = action.payload;
		},
	},
});

export const {
	setIsSidebarContracted,
	setUpdatingLocation,
	setLoadsActiveFilter,
	setBrokerActiveFilter,
	setDriverActiveFilter,
	setCurrentCustomerDt,
	setCollapseNestedItemOpen,
	setBackDropOpen,
	setMapTheme,
	setLastLoadsQuery,
	setLastLoadsQueryBroker,
	setLastLoadsQueryDriver,
} = globalSlice.actions;

export default globalSlice.reducer;
