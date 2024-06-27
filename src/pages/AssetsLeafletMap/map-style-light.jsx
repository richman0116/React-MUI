import MAP_STYLE from "./map-light.json";

const sfNeighborhoods = {
	type: "geojson",
	data: "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/feature-example-sf.json",
};

export default {
	...MAP_STYLE,
	sources: {
		...MAP_STYLE.sources,
		["sf-neighborhoods"]: sfNeighborhoods,
	},
	layers: [...MAP_STYLE.layers],
};
