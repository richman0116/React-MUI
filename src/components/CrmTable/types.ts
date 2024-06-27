import type React from "react";

export interface TableColumnType<T> {
	id: keyof T | "Checkbox" | "Actions" | "";
	label: React.ReactNode;
	canBeSorted: boolean;
	align?: "left" | "right";
	minWidth?: string | number;
	render?: (data: T) => React.ReactNode;
	isDate?: boolean;
	color?: string;
	isRange?: boolean;
}

export interface FieldData {
	label: string;
	value: string | number;
}

export interface FilterItemsType {
	id: string;
	label: React.ReactNode;
	canBeSorted: boolean;
	align?: "left" | "right";
	minWidth?: string | number;
	isDate?: boolean;
	fieldData?: FieldData[];
	color?: string;
	isRange?: boolean;
	clickedEventName?: string;
	filteredEventName?: string;
}

export interface IMustHave {
	id: number;
}

export type Order = "asc" | "desc";

export interface EnhancedHeaderProps<T extends IMustHave> {
	columns: TableColumnType<T>[];
	order: Order;
	orderBy: keyof T;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
	numSelected: number;
	rowCount: number;
}

export interface TableProps<T extends IMustHave> {
	columns: TableColumnType<T>[];
	data: T[];
	defaultSortedColumn: keyof T;
	rowOrder?: Order;
	onSelectAll?: (data: TableColumnType<T>[], checked: boolean) => void;
	onSelectRow?: (data: T, checked: boolean) => void;
	onScrollBottom?: () => void;
	loading?: boolean;
	hasMore?: boolean;
	filterQuery?: string;
}
