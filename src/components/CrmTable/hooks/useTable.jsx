import React, { useState, useEffect } from "react";

export default function useTable(props) {
	const { columns, data, defaultSortedColumn, onSelectAll, filterQuery, rowOrder = "desc" } = props;
	const [order, setOrder] = useState(rowOrder);
	const [orderBy, setOrderBy] = useState(defaultSortedColumn);
	const [selected, setSelected] = useState([]);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	useEffect(() => {
		if (filterQuery) {
			setSelected([]);
		}
	}, [filterQuery]);

	useEffect(() => {
		const newSelected = selected.filter((id) => {
			return data.find((item) => item.id === id);
		});
		setSelected(newSelected);
	}, [data]);

	const handleSelectAllClick = (event, checked) => {
		if (event.target.checked) {
			const newSelecteds = data.map((n) => n.id);
			setSelected(newSelecteds);
			if (onSelectAll) onSelectAll(columns, checked);
		}
		if (!event.target.checked) {
			if (onSelectAll) onSelectAll(columns, checked);
			setSelected([]);
		}
	};

	return {
		selected,
		setSelected,
		order,
		orderBy,
		handleRequestSort,
		handleSelectAllClick,
	};
}
