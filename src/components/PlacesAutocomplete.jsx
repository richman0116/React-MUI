import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { config } from "../config";
import { Clear } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { theme as defaultTheme } from "../shared/theme";

// Define a custom theme for the dark version
const darkTheme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: "#333",
			paper: "#333",
		},
		text: {
			primary: "#fff",
		},
	},
	components: {
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiInputLabel-root": {
						color: "#fff",
					},
					"& .MuiOutlinedInput-input": {
						color: "#fff",
					},
					"& .MuiOutlinedInput-root": {
						"& fieldset": {
							borderColor: "#fff",
						},
						"&:hover fieldset": {
							borderColor: "#fff",
						},
						"&.Mui-focused fieldset": {
							borderColor: "#fff",
						},
					},
				},
			},
		},
	},
});

const PlacesAutocomplete = ({
	handleAutocompleteChange,
	locationVal = "",
	register,
	style = {},
	placeholder = "",
	autocompleteName = null,
	theme = "light",
	required = true,
}) => {
	const [value, setValue] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setInputValue(locationVal);
	}, [locationVal]);

	const fetchSuggestions = async () => {
		if (inputValue.trim() !== "") {
			setLoading(true);
			try {
				const response = await axios.get(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
						inputValue
					)}.json?country=US&types=postcode,place,region&poi_category=airport&limit=5&access_token=${
						config.MAPBOX_TOKEN
					}`
				);
				setOptions(response.data.features);
				setLoading(false);
				setOpen(true);
			} catch (error) {
				console.error("Error fetching suggestions:", error);
				setLoading(false);
			}
		}
	};

	const handleInputChange = (event, newInputValue) => {
		if (event?.type === "change") {
			setInputValue(newInputValue);
		}
	};

	const handleEnterPress = async (event) => {
		if (event.key === "Enter") {
			await fetchSuggestions();
		}
	};

	// const fetchDetails = async (mapbox_id) => {
	// 	try {
	// 		const response = await axios.get(
	// 			`https://api.mapbox.com/search/searchbox/v1/retrieve/${mapbox_id}?session_token=${config.sessionToken}&access_token=${config.MAPBOX_TOKEN}`
	// 		);
	// 		setLoading(false);
	// 		return response;
	// 	} catch (error) {
	// 		console.error("Error fetching suggestions:", error);
	// 		throw error;
	// 	}
	// };

	const handleChange = async (event, newValue) => {
		if (newValue) {
			setLoading(true);
			// const details = await fetchDetails(newValue.mapbox_id);
			setValue(newValue);
			const dis_name = newValue.place_name;
			setInputValue(dis_name);
			const placeValue = {
				lat: newValue.geometry.coordinates[1],
				lon: newValue.geometry.coordinates[0],
				display_name: dis_name,
			};
			setLoading(false);
			handleAutocompleteChange(event, placeValue);
		} else {
			handleAutocompleteChange(event, null);
		}
	};

	const clearAction = () => {
		setInputValue("");
		setValue(null);
		setOptions([]);
		handleAutocompleteChange(null, null);
	};

	return (
		<ThemeProvider theme={theme === "dark" ? darkTheme : defaultTheme}>
			<div style={{ position: "relative" }}>
				<Autocomplete
					id="elg-place-autocomplete"
					name={autocompleteName}
					error
					{...(register && {
						...register(autocompleteName, {
							required: {
								value: required,
								message: "Please select pick up location",
							},
						}),
					})}
					style={style}
					open={open}
					onOpen={() => setOpen(true)}
					onClose={() => setOpen(false)}
					options={options}
					value={value}
					clearIcon={<Clear onClick={clearAction} />}
					getOptionLabel={(option) => (typeof option === "string" ? option : option.place_name)}
					onChange={handleChange}
					inputValue={inputValue}
					noOptionsText={loading ? "Searching..." : "No options"}
					onInputChange={handleInputChange}
					onKeyDown={handleEnterPress}
					filterOptions={(x) => x}
					renderInput={(params) => (
						<TextField
							{...params}
							label={placeholder}
							variant="outlined"
							fullWidth
							size="small"
							sx={
								theme === "dark"
									? {
											background: "#333",
											color: "white",
											"& .MuiInputLabel-root": {
												color: "white",
											},
											"& .MuiOutlinedInput-input": {
												color: "white",
											},
											"& .MuiOutlinedInput-root": {
												"& fieldset": {
													borderColor: "white",
												},
												"&:hover fieldset": {
													borderColor: "white",
												},
												"&.Mui-focused fieldset": {
													borderColor: "white",
												},
											},
									  }
									: {}
							}
						/>
					)}
					renderOption={(props, option) => (
						<li {...props} style={{ backgroundColor: theme === "dark" ? "#333" : "#fff" }}>
							<Grid container alignItems="center">
								<Grid item sx={{ display: "flex", width: 44 }}>
									<LocationOnIcon sx={{ color: theme === "dark" ? "white" : "black" }} />
								</Grid>
								<Grid item sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
									<div style={{ color: theme === "dark" ? "white" : "black", fontSize: "14px" }}>
										{option.place_name}
									</div>
									{/* <div
										style={{
											fontSize: "12px",
											opacity: "0.7",
											color: theme === "dark" ? "white" : "black",
										}}
									>
										{option.full_address || option.place_formatted}
									</div> */}
								</Grid>
							</Grid>
						</li>
					)}
				/>
				{loading && (
					<CircularProgress
						style={{ position: "absolute", right: "12px", top: "7px", color: "white" }} // Loader color
						size={20}
					/>
				)}
			</div>
		</ThemeProvider>
	);
};

export default PlacesAutocomplete;
