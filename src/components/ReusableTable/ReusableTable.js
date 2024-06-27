import React, { useState, useEffect } from "react";
import _ from "lodash";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableToolbar from "./TableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import { Checkbox, Pagination, TableCell, TableRow } from "@mui/material";
import styles from "./ReusableTable.module.scss";
import ProgressLoader from "../ProgressLoader/ProgressLoader";
import LinearProgress from "@mui/material/LinearProgress";

// function descendingComparator(a, b, orderBy) {
// 	if (b[orderBy] < a[orderBy]) {
// 		return -1;
// 	}
// 	if (b[orderBy] > a[orderBy]) {
// 		return 1;
// 	}
// 	return 0;
// }

// function getComparator(order, orderBy) {
// 	return order === "desc"
// 		? (a, b) => descendingComparator(a, b, orderBy)
// 		: (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
// 	const stabilizedThis = array.map((el, index) => [el, index]);
// 	stabilizedThis.sort((a, b) => {
// 		const order = comparator(a[0], b[0]);
// 		if (order !== 0) {
// 			return order;
// 		}
// 		return a[1] - b[1];
// 	});
// 	return stabilizedThis.map((el) => el[0]);
// }

const fontSize = "0.85rem";

const ReusableTable = ({
	data,
	columns,
	pageSize = 15,
	initialOrder = "asc",
	initialOrderBy = "loadId",
	setDeletedIds = () => {},
	onPageChange = () => {},
	deletedIds = [],
	handleDeleteMultiples,
	pages = 1,
	currentPage = 1,
	isFetching,
	Toolbar,
}) => {
	const [order, setOrder] = useState(initialOrder);
	const [orderBy, setOrderBy] = useState(initialOrderBy);
	const [page, setPage] = useState(1);
	const [rowsPerPage] = useState(pageSize);


	useEffect(() => {
	}, []);

	useEffect(() => {
		setPage(currentPage);
	}, [currentPage]);

	const handleChangePage = (_, newPage) => {
		setPage(newPage);
		onPageChange({ page: newPage });
	};

	const handleRequestSort = (property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = data.map((n) => n._id);
			setDeletedIds(newSelected);
			setDeletedIds(newSelected);
			return;
		}
		setDeletedIds([]);
		setDeletedIds([]);
	};

	const handleClick = (event, id) => {
		const selectedIndex = deletedIds.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(deletedIds, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(deletedIds.slice(1));
		} else if (selectedIndex === deletedIds.length - 1) {
			newSelected = newSelected.concat(deletedIds.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				deletedIds.slice(0, selectedIndex),
				deletedIds.slice(selectedIndex + 1)
			);
		}
		setDeletedIds(newSelected);
		setDeletedIds(newSelected);
	};

	const isSelected = (id) => deletedIds.indexOf(id) !== -1;

	// const filteredData = useMemo(() => {
	// 	if (searchValue) {
	// 		return _.filter(data, (item) => _.some(item, (value) => String(value).includes(searchValue)));
	// 	}
	// 	return data;
	// }, [data, searchValue]);

	const [progress, setProgress] = React.useState(0);

	useEffect(() => {
		let intervalId;
		let completeIntervalId;
		if (isFetching) {
			intervalId = setInterval(() => {
				setProgress((prevProgress) => {
					if (prevProgress < 80) {
						return prevProgress + 10;
					} else {
						clearInterval(intervalId);
						// Increment progress to 100 and reset
						completeIntervalId = setInterval(() => {
							setProgress((prevProgress) => {
								if (prevProgress < 100) {
									return prevProgress + 10;
								} else {
									clearInterval(completeIntervalId);
									return 0;
								}
							});
						}, 600);
					}
				});
			}, 600);
		} else {
			setProgress(0);
			clearInterval(intervalId);
			clearInterval(completeIntervalId);
		}

		return () => {
			clearInterval(intervalId);
			clearInterval(completeIntervalId);
		};
	}, [isFetching]);


	const getIcon = (updatedAt) => {
		const now = new Date();
		const lastUpdate = new Date(updatedAt);
		const timeDiff = (now - lastUpdate) / (1000 * 60); // Difference in minutes

		if (timeDiff >= 90) {
			return "red"; // Red icon for 1.5 hours
		} else if (timeDiff >= 60) {
			return "orange"; // Orange icon for 1 hour
		} else {
			return null; // No icon if less than 1 hour
		}
	};

	return (
		<Box className={styles.tableContainer} sx={{ overflow: "auto" }}>
			{isFetching && (
				<Box sx={{ width: "100%" }}>
					<LinearProgress variant="determinate" value={progress} />
				</Box>
			)}
			<Paper sx={{ width: "100%", overflow: "hidden" }}>
				<TableToolbar
					data={data}
					selected={deletedIds}
					handleDelete={handleDeleteMultiples}
					handleFilter={() => {}}
					title={<Toolbar />}
					fontSize={fontSize}
				/>
				<TableContainer sx={{ height: "calc(100vh - 240px)", position: "relative" }}>
					<Table
						sx={{ width: "100%", fontSize: fontSize }}
						aria-labelledby="tableTitle"
						size={"small"}
						stickyHeader
						aria-label="sticky table"
					>
						<EnhancedTableHead
							columns={columns}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							handleSelectAllClick={handleSelectAllClick}
							filteredData={data}
							selected={deletedIds}
						/>

						<TableBody>
							{data.map((row, index) => {
								const isItemSelected = isSelected(row._id);
								const labelId = `enhanced-table-checkbox-${index}`;
								const icon = getIcon(row.updatedAt);
								return (
									<TableRow
										hover
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row._id}
										selected={isItemSelected}
										sx={{ cursor: "pointer" }}
									>
										<TableCell onClick={(event) => handleClick(event, row._id)} padding="checkbox">
											<Checkbox
												color="primary"
												checked={isItemSelected}
												inputProps={{
													"aria-labelledby": labelId,
												}}
											/>
										</TableCell>
										{columns
											.filter((_, index) => index !== 7)
											.map((column) => (
												<TableCell
													key={column.id}
													component="th"
													id={labelId}
													scope="row"
													padding={"none"}
													style={{ padding: "5px" }}
												>
													{column.render ? column.render(row) : row[column.id]}
												</TableCell>
											))}
										<TableCell>
											{columns[7].render ? columns[7].render(row, icon) : row[columns[7].id]}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						marginTop: "5px",
					}}
				>
					<Pagination
						count={pages}
						rowsPerPage={rowsPerPage}
						page={page}
						onChange={handleChangePage}
						color="primary"
					/>
				</div>
			</Paper>
		</Box>
	);
};

export default ReusableTable;
