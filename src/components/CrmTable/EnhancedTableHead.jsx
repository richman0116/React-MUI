import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import useEnhancedTableHead from "./hooks/useEnhancedTableHead";
import styles from "./CrmTable.module.scss";

// import CrmCheckbox from "components/CrmCheckbox";

export default function EnhancedTableHead(props) {
	const { columns, orderBy, order, onRequestSort } = props;

	const { createSortHandler } = useEnhancedTableHead({ onRequestSort });

	if (columns.length > 0) {
		return (
			<TableHead className={styles.tHead}>
				<TableRow>
					{columns.map((column, index) => (
						<React.Fragment key={index}>
							<TableCell
								align={column?.align || "left"}
								sortDirection={orderBy === column.id ? order : false}
								component="th"
							>
								{column.id === "Checkbox" ? (
									<></>
								) : (
									// <CrmCheckbox
									//   onChange={onSelectAllClick}
									//   indeterminate={numSelected > 0 && numSelected < rowCount}
									//   isChecked={rowCount > 0 && numSelected === rowCount}
									// />
									<TableSortLabel
										active={orderBy === column.id && column.canBeSorted}
										direction={orderBy === column.id ? order : "asc"}
										onClick={column.canBeSorted ? createSortHandler(column.id) : undefined}
										hideSortIcon={!column.canBeSorted}
										style={{
											cursor: `${!column.canBeSorted && "auto"}`,
										}}
									>
										{column.label}
									</TableSortLabel>
								)}
							</TableCell>
						</React.Fragment>
					))}
				</TableRow>
			</TableHead>
		);
	} else {
		return null;
	}
}
