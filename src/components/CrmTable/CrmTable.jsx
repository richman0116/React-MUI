import React, { useEffect, useState } from "react";
import _ from "lodash";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import EnhancedTableHead from "./EnhancedTableHead";
import styles from "./CrmTable.module.scss";
import { Paper } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component/dist";
import ProgressLoader from "../ProgressLoader/ProgressLoader";

export default function CrmTable(props) {
	const {
		columns,
		defaultSortedColumn,
		onSelectAll,
		onScrollBottom = () => {},
		data,
		ROWS_PER_PAGE = 50,
		hasMore = false,
	} = props;

	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState(defaultSortedColumn);
	const [selected, setSelected] = useState([]);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = data.map((n) => n.id);
			setSelected(newSelecteds);
			onSelectAll(newSelecteds);
			return;
		}
		setSelected([]);
		onSelectAll([]);
	};

	const handleRowSelect = (id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const loadMoreData = async () => {
		const nextPage = Math.floor(data.length / ROWS_PER_PAGE) + 1;
		if (hasMore) await onScrollBottom(nextPage);
	};

	return (
		<InfiniteScroll
			className="pr-[40px]"
			dataLength={data.length}
			next={loadMoreData}
			hasMore={hasMore}
			loader={<ProgressLoader />}
			scrollThreshold={0.9}
		>
			<Paper elevation={0} className={styles.container}>
				<TableContainer className={styles.tableContainer}>
					<Table>
						<EnhancedTableHead
							numSelected={selected.length}
							columns={columns}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							onSelectAllClick={handleSelectAllClick}
							rowCount={data.length}
						/>
						<TableBody className={styles.tRow}>
							{data.length > 0 &&
								_.orderBy(data, [orderBy], [order]).map((item, index) => (
									<TableRow
										hover
										selected={selected.includes(item.id)}
										key={index}
										onClick={() => handleRowSelect(item.id)}
									>
										{columns.map((column, columnIndex) => (
											<TableCell
												key={columnIndex}
												align="left"
												variant="body"
												component="td"
												style={{ color: column.color }}
											>
												{column.render && column.render(item, index)}
											</TableCell>
										))}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</InfiniteScroll>
	);
}
