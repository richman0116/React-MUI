import React, { useEffect, useState } from "react";
import styles from "./Tracking.modules.scss";

import {
	useAddPrivateNoteMutation,
	useLazyGetQuotesQuery,
	useUpdateHotLoadMutation,
} from "../../services/load";
import {
	Button,
	ButtonGroup,
	Chip,
	CircularProgress,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Tooltip,
	Typography,
	FormControl,
	InputAdornment,
} from "@mui/material";
import { Refresh, Clear, CrisisAlertOutlined } from "@mui/icons-material";
import AppDrawer from "../../components/AppDrawer";
import dateUtils from "../../utils/dateUtils";
import ReusableTable from "../../components/ReusableTable/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import { setLastLoadsQuery, setLoadsActiveFilter } from "../../store/slice/globalSlice";
import useLoadCols from "../../hooks/useLoadCols/useLoadCols";
import SearchIcon from "@mui/icons-material/Search";
import useTracking from "./useTracking";
import MUIModal from "../../components/MUIModal";
import TrackModal from "./TrackModal";

const Tracking = () => {
	const {
		handleSubmit,
		onSubmit,
		currentData,
		setCurrentData,
		isDirty,
		isLoadingUpdate,
		showTrackModal,
		setShowTrackModal,
	} = useTracking();

	const loadsActiveFilter = "active";
	const lastLoadsQuery = useSelector((state) => state.global.lastLoadsQuery);
	const [triggerLoads, { data: loadsData, isFetching }] = useLazyGetQuotesQuery();

	const [updateHotLoad] = useUpdateHotLoadMutation();

	const dispatch = useDispatch();

	const [deletedIds, setDeletedIds] = useState([]);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event, load) => {
		console.log("load");
		setAnchorEl(event.currentTarget);
		setCurrentData(load);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setCurrentData(null);
	};

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isReload, SetIsReload] = useState(false);
	const [notesValue, setNotesValue] = useState("");

	const [addPrivateNotes] = useAddPrivateNoteMutation();

	const toggleDrawer = (anchor, open) => {
		setDrawerOpen(open);
	};

	const { loadCols } = useLoadCols({
		loadsActiveFilter,
		setEditedLoad: setCurrentData,
		toggleDrawer,
		handleClick,
		page: "tracking",
		setShowTrackModal,
	});

	const onNotesActivity = () => {
		setAnchorEl(false);
		toggleDrawer("right", true);
	};

	const handleKeyDown = async (event) => {
		if (event.keyCode === 13 && event.shiftKey) {
			setNotesValue("");
			event.preventDefault();
			const newNote = {
				text: event.target.value,
				createdTime: new Date().toISOString(),
			};
			setCurrentData({
				...currentData,
				activity: {
					...currentData.activity,
					private: [...currentData.activity.private, newNote],
				},
			});
			await addPrivateNotes({ id: currentData._id, body: { privateNote: event.target.value } });
		}
	};

	const tableDataFetch = async (props) => {
		const {
			status = "active",
			page = 1,
			rowsPerPage = 15,
			orderBy = "loadId",
			order = "desc",
			search = "",
		} = props;
		const queryString = `?status=${status}&page=${page}&rowsPerPage=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}`;
		dispatch(setLastLoadsQuery(queryString));
		try {
			await triggerLoads(queryString, true);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleTabClick = async (key) => {
		await tableDataFetch({ status: key });
		dispatch(setLoadsActiveFilter(key));
	};

	const onPageChange = ({ page }) => {
		tableDataFetch({ status: loadsActiveFilter, page });
	};

	const params = new URLSearchParams(lastLoadsQuery);
	const page = params.get("page");

	useEffect(() => {
		tableDataFetch({ status: loadsActiveFilter, page: page ? page : 1 });
	}, []);

	const [searchQuery, setSearchQuery] = useState("");

	const Toolbar = () => {
		const [searchVal, setSearchVal] = useState(searchQuery);
		const [showClearIcon, setShowClearIcon] = useState(searchQuery === "" ? "none" : "flex");

		const handleChangeSearch = (event) => {
			if (event.target.value.length < 1) {
				tableDataFetch({ status: loadsActiveFilter });
			}
			setSearchVal(event.target.value);
			setShowClearIcon(event.target.value === "" ? "none" : "flex");
		};

		const handleSearch = async (event, key = false) => {
			if ((key && event.keyCode === 13) || key === false) {
				try {
					setSearchQuery(searchVal);
					tableDataFetch({ status: loadsActiveFilter, search: searchVal });
				} catch (error) {
					console.log(error);
				}
			}
		};

		const handleClear = () => {
			tableDataFetch({ status: loadsActiveFilter });
			setShowClearIcon("none");
			setSearchVal("");
			setSearchQuery("");
		};

		useEffect(() => {
			if (!showTrackModal && !open) setCurrentData(null);
		}, [showTrackModal]);

		return (
			<>
				<FormControl>
					<div style={{ display: "flex", alignItem: "center", gap: "0px" }}>
						<TextField
							size="small"
							variant="outlined"
							sx={{ width: "220px" }}
							onChange={handleChangeSearch}
							onKeyDown={(event) => handleSearch(event, true)}
							placeholder="Search"
							value={searchVal}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end" style={{ display: showClearIcon }}>
										<IconButton onClick={handleClear} size="small">
											<Clear />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<IconButton className={styles.searchBtn} onClick={handleSearch} size="small">
							<SearchIcon />
						</IconButton>
					</div>
				</FormControl>
			</>
		);
	};

	return (
		<>
			<div className={styles.orderArea}>
				{loadsData && (
					<Stack className={styles.orderTop} direction="row" spacing={1}>
						<ButtonGroup size="92" variant="outlined" aria-label="tooltip button group">
							<Tooltip arrow title="Tracking">
								<Button
									variant={
										loadsActiveFilter === "active" && searchQuery === "" ? "contained" : "outlined"
									}
									startIcon={<CrisisAlertOutlined />}
									onClick={() => handleTabClick("active")}
								>
									Tracking
									<Chip
										sx={
											loadsActiveFilter === "active" && searchQuery === ""
												? { color: "white", border: "1px solid #FFFFFF" }
												: {}
										}
										style={{ marginLeft: "10px" }}
										size="small"
										label={loadsData && loadsData.activeCount ? loadsData.activeCount : 0}
										variant={
											loadsActiveFilter === "active" && searchQuery === ""
												? "contained"
												: "outlined"
										}
									/>
								</Button>
							</Tooltip>
						</ButtonGroup>
						<div>
							<IconButton
								onClick={async () => {
									SetIsReload(true);
									await triggerLoads(lastLoadsQuery);
									SetIsReload(false);
								}}
								color="primary"
								sx={{ marginRight: "8px" }}
							>
								{isReload ? (
									<CircularProgress size={24} color="primary" />
								) : (
									<Refresh fontSize="large" />
								)}
							</IconButton>
						</div>
					</Stack>
				)}
				<div style={{ width: "100%", marginTop: "10px" }}>
					<ReusableTable
						setDeletedIds={setDeletedIds}
						deletedIds={deletedIds}
						columns={loadCols}
						data={loadsData && loadsData.loads ? loadsData.loads : []}
						initialOrderBy="loadId"
						initialOrder="desc"
						onPageChange={onPageChange}
						pages={loadsData && loadsData.pages ? loadsData.pages : 0}
						currentPage={loadsData && loadsData.page ? loadsData.page : page ? page : 1}
						isFetching={isFetching}
						Toolbar={Toolbar}
					/>
				</div>
			</div>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem onClick={onNotesActivity}>Internal Notes</MenuItem>

				{currentData && currentData.hotLoad === 1 ? (
					<MenuItem
						onClick={async () => {
							setAnchorEl(false);
							await updateHotLoad({ id: currentData._id, payload: { hotLoad: 0 } });
							triggerLoads(lastLoadsQuery);
						}}
					>
						Clear Hot Load
					</MenuItem>
				) : (
					<MenuItem
						onClick={async () => {
							setAnchorEl(false);
							await updateHotLoad({ id: currentData._id, payload: { hotLoad: 1 } });
							triggerLoads(lastLoadsQuery);
						}}
					>
						Hot Load
					</MenuItem>
				)}
			</Menu>
			<AppDrawer open={drawerOpen} onClose={toggleDrawer} width={400}>
				<div style={{ padding: 12 }}>
					<div style={{ backgroundColor: "#edf3f6" }}>
						<Typography
							style={{ padding: "12px 0", fontSize: 18, color: "#5a75c5", textAlign: "center" }}
						>
							Internal Notes Activity
						</Typography>

						<TextField
							id="filled-search"
							label="(shift + enter) press to add notes"
							type="search"
							variant="filled"
							multiline
							rows={3}
							onKeyDown={handleKeyDown}
							fullWidth
							value={notesValue}
							onChange={(event) => setNotesValue(event.target.value)}
							sx={{ background: "#edf3f6" }}
						/>
					</div>

					<div style={{ height: "64vh", overflowY: "scroll", marginTop: 24 }}>
						{currentData?.activity?.private
							?.map((note) => (
								<div key={note.noteId} style={{ marginBottom: 24 }}>
									<div
										style={{
											borderRadius: 2,
											padding: "16px 8px",
											backgroundColor: "#EFF0FA",
										}}
									>
										<Typography variant="body2" sx={{ textAlign: "center" }}>
											{note.text}
										</Typography>
									</div>
									<Typography sx={{ fontSize: 11.5, textAlign: "center" }}>
										{dateUtils.differenceFromNow(note.createdTime)}
									</Typography>
								</div>
							))
							.reverse()}
					</div>
				</div>
			</AppDrawer>
			{currentData && (
				<form onSubmit={handleSubmit(onSubmit)}>
					<MUIModal
						showModal={showTrackModal}
						setShowModal={setShowTrackModal}
						modalTitle={`Track #${currentData.loadId}`}
						closeBtnText="Cancel"
						secondaryBtnText={"Update"}
						isSubmit={true}
						isFooter={false}
						modalClassName="wd-95"
						isConfirm={
							isDirty
								? {
										title: "Changes will not be applied!",
										description:
											"Changes have been made that haven't been saved. Click the update button to save them. Are you sure you want to continue without saving?",
								  }
								: null
						}
						handleClickSecondaryBtn={handleSubmit(onSubmit)}
						secondaryBtnDisabled={isLoadingUpdate || !isDirty}
						secondaryBtnLoading={isLoadingUpdate}
						modalBodyComponent={
							<TrackModal currentData={currentData} setCurrentData={setCurrentData} />
						}
					/>
				</form>
			)}
		</>
	);
};

export default Tracking;
