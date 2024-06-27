export const generateNickname = (userName) => {
	const words = userName.split(" ");

	if (words.length === 1) {
		return words[0].substring(0, 3);
	} else if (words.length >= 2) {
		return words.map((word) => word[0]).join("");
	}
	return "";
};
