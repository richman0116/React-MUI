import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

function getStyles(name, optionValue, theme) {
	return {
		fontWeight:
			optionValue.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

const MultipleSelect = (props) => {
	const { label, placeholder, options, value, style = {}, onChange, size } = props;

	const theme = useTheme();
	const [optionValue, setOptionValue] = React.useState(value || []);

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		const cValue = typeof value === "string" ? value.split(",") : value;
		setOptionValue(cValue);
		if (onChange) {
			onChange(cValue);
		}
	};

	return (
		<div>
			<FormControl style={{ width: "100%" }}>
				<label>{label}</label>
				<Select
					style={{ ...style }}
					id="demo-multiple-name"
					multiple
					displayEmpty
					value={optionValue}
					onChange={handleChange}
					MenuProps={MenuProps}
					size={size}
					renderValue={(selected) => {
						if (selected.length === 0) {
							return <div style={{ color: "gray" }}>{placeholder}</div>;
						}

						return selected.join(", ");
					}}
				>
					{options.map((name) => (
						<MenuItem key={name} value={name} style={getStyles(name, optionValue, theme)}>
							{name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default MultipleSelect;
