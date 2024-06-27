import { useEffect, useRef } from "react";

export function useDebounce(callback, timeout, deps) {
	const timeoutId = useRef();

	useEffect(() => {
		clearTimeout(timeoutId.current);
		timeoutId.current = setTimeout(callback, timeout);

		return () => clearTimeout(timeoutId.current);
	}, deps);
}
