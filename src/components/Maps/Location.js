import { useEffect, useState } from "react";
import { Circle, Marker, Popup, useMap } from "react-leaflet";

const Location = () => {
	const map = useMap();
	const [position, setPosition] = useState(null);

	useEffect(() => {
		map.locate({
			setView: true,
		});
		map.on("locationfound", (event) => {
			setPosition(event.latlng);
		});
	}, [map]);

	return position ? (
		<>
			<Circle
				center={position}
				color={"red"}
				fillColor={"red"}
				fillOpacity={0.2}
				radius={200}
				weight={0}
				// dashArray={[10, 5]} // Add dashed line pattern
				lineCap={"round"} // Rounded line ends
				lineJoin={"round"} // Rounded line corners
			/>
			<Marker position={position}>
				<Popup>HOME</Popup>
			</Marker>
		</>
	) : null;
};

export default Location;
