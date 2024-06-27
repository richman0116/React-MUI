// EnhancedTableHead.js
import React from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { TableHead } from "@mui/material";

const EnhancedTableHead = ({
	columns,
	order,
	orderBy,
	onRequestSort,
	selected,
	filteredData,
	handleSelectAllClick,
}) => {
	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={selected.length > 0 && selected.length < filteredData.length}
						checked={filteredData.length > 0 && selected.length === filteredData.length}
						onChange={handleSelectAllClick}
						inputProps={{
							"aria-label": "select all desserts",
						}}
					/>
				</TableCell>
				{columns.map((column) => (
					<TableCell
						key={column.id}
						align={column.numeric ? "right" : "left"}
						padding={"none"}
						sortDirection={orderBy === column.id ? order : false}
						component="th"
						id={column.id}
						scope="row"
					>
						<TableSortLabel
							active={orderBy === column.id}
							direction={orderBy === column.id ? order : "asc"}
							onClick={() => onRequestSort(column.id)}
						>
							{column.label}
							{orderBy === column.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
};

export default EnhancedTableHead;
