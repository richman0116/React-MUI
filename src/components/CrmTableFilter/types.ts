import { FilterItemsType } from "../CrmTable/types";
import { ReactNode } from "react";

export interface CrmTableFilterProps extends IFilter {
	columns?: FilterItemsType[];
	searchEvent?: string;
	resetEvent?: string;
}

export interface IFilter {
	filterKey?: string;
	onFilter: (query: string) => void;
	searchPlaceHolder?: string;
	searchKey?: string;
	dynamicButton?: ReactNode;
	searchEvent?: string;
}

export interface ColumnData {
	id: string;
	data: Data[];
}
export interface Data {
	value: string | number;
	lebel: string;
}
