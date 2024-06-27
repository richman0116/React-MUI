import { Cells } from "../shared/constants";
import cells from "../shared/table/cells.jsx";

const tableUtils = {
	/* 	buildColumns: function buildColumns(data, columns, actions, selectedRowKeys) {
		// console.log("Table Utils: ", data, columns, actions, selectedRowKeys);
		const cols = [];
		const keys = data.length > 0 ? Object.keys(data[0]) : [];

		columns.forEach(({ key, header, cell }) => {
			if (keys.includes(key))
				cols.push({
					title: header,
					dataIndex: key,
					key,
					render: (value, record, index) => {
						const props = { value, record, index, cell };
						return this.cellView(props);
					},
				});
		});

		if (actions) cols.push(actions);

		return cols;
	}, */
	cellView: function cellView(props) {
		switch (props.cell) {
			case Cells.DATE_CELL:
				return cells.DateCell(props);

			default:
				return cells.TextCell(props);
		}
	},
};

export default tableUtils;
