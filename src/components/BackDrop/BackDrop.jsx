import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBackDropOpen } from "../../store/slice/globalSlice";

const BackDrop = () => {
	const backDropOpen = useSelector((state) => state.global.backDropOpen);
	const dispatch = useDispatch();
	return (
		<Backdrop
			sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
			open={backDropOpen}
			onClick={() => dispatch(setBackDropOpen(false))}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
};

export default BackDrop;
