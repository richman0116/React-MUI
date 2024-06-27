import React, { ChangeEvent, useCallback } from "react";
import { debounce } from "lodash";

const useTableFilter = (props) => {
	const { onFilter, searchEvent, filterKey } = props;
	const [value, setValue] = React.useState({
		search: "",
	});
	const [filter, setFilter] = React.useState({});
	const [isDataAdded, setIsDataAdded] = React.useState(false);
	const [reset, setReset] = React.useState(false);

	React.useEffect(() => {
		const queryParams = new URLSearchParams();
		for (const key in filter) {
			if (Object.prototype.hasOwnProperty.call(filter, key)) {
				const value = filter[key];
				if (value !== undefined && value !== null && value !== "") {
					queryParams.append(key, value);
				}
			}
		}
		const filterQuery = `${queryParams.toString().length ? "?" : ""}${queryParams.toString()}`;
		onFilter(filterQuery);
	}, [filter]);

	const serachInput = (e, filter) => {
		setFilter({ ...filter, [e.target.name]: e.target.value });
	};
	const handleDebounce = useCallback(debounce(serachInput, 700), []);
	const handleSearch = (e) => {
		handleDebounce(e, filter);
		setValue({ ...value, search: e.target.value });
	};
	return {
		value,
		setValue,
		filter,
		setFilter,
		handleSearch,
		isDataAdded,
		setIsDataAdded,
		setReset,
		reset,
	};
};
export default useTableFilter;
