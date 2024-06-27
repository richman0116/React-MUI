export default function useEnhancedTableHead(props) {
	const { onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};
	return { createSortHandler };
}
