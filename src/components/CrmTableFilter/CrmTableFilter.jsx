import { Button, Input, Select } from "@mui/material";
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { useParams } from "react-router-dom";
import useTableFilter from "./hooks/useTableFilter";

function CrmTableFilter(props) {
	const { hostId } = useParams();
	const {
		columns,
		onFilter,
		searchPlaceHolder = "Search",
		searchKey = "campaignName",
		filterKey = "",
		dynamicButton,
		searchEvent = "",
		resetEvent = "",
	} = props;
	const { value, setValue, filter, setFilter, handleSearch, reset, setReset } = useTableFilter({
		onFilter,
		searchKey,
		searchEvent,
		filterKey,
	});

	return (
		<>
			<div className={"flex items-center justify-between pr-[40px]"}>
				<div className={"flex gap-4"}>
					<Input
						handleChange={handleSearch}
						search
						name={searchKey}
						placeHolder={searchPlaceHolder}
						className="w-72"
						reset={reset}
						value={value.search}
					/>
				</div>
				{dynamicButton && <div>{dynamicButton}</div>}
			</div>
			<div className={"pt-4 pb-8 opacity-1 visible transition-all duration-150"}>
				<div className="flex gap-4 items-center flex-wrap">
					{columns?.map((column, index) => {
						const items = [{ value: "", label: "All" }];
						column.fieldData?.forEach((item, index) => {
							if (column.id !== "Checkbox" && column.id !== "Actions")
								items.push({
									value: item.value || index,
									label: item.label,
								});
						});

						return (
							<div key={index}>
								{column.label && !column.isDate ? (
									<div>
										<Select
											handleOpen={() => {}}
											label={column.label || ""}
											menuItems={items}
											value={value[column.id]}
											onChange={(e) => {
												const dropDownOption = {
													label: items.find((item) => item.value === e.target.value)?.label,
													value: items.find((item) => item.value === e.target.value)?.value,
												};
												setValue({
													...value,
													[column.id]: e.target.value,
												});
												setFilter({
													...filter,
													[column.id]: dropDownOption.label === "All" ? "" : dropDownOption.value,
												});
											}}
										/>
									</div>
								) : (
									<></>
								)}
								{column.label && column.isDate ? (
									<div className="flex-row">
										<p className="text-secondary text-xs mb-1">{column.label}</p>
										<DateRangePicker
											handleClick={() => {}}
											reset={reset}
											setReset={setReset}
											onChange={(from, to) => {
												setFilter({
													...filter,
													from_date: from,
													to_date: to,
												});
											}}
										/>
									</div>
								) : (
									<></>
								)}
							</div>
						);
					})}
					{!hostId && (
						<div className="mt-5">
							<Button
								variant="text"
								text={"Reset"}
								onClick={() => {
									setFilter({});
									setValue({ [searchKey]: "" });
									setReset(true);
								}}
								className="!text-secondary"
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default CrmTableFilter;
