import { AssetStatus, QuoteStatus } from "../shared/constants";

const globalUtils = {
	getLoadWeight: (load) => {
		let totalWeight = 0;

		load.pickUpList?.forEach((item) => {
			totalWeight += parseInt(item.pWeight);
		});

		return totalWeight;
	},
	getAssetStatusColor: (status) => {
		switch (status) {
			case AssetStatus.AVAILABLE:
				return "#05A677";
			case AssetStatus.AVAILABLE_LOCALLY:
				return "#4B367C";
			case AssetStatus.NOT_AVAILABLE:
				return "#cd201f";
			case AssetStatus.ON_HOLD:
				return "#f5b759";
			case AssetStatus.OUT_OF_SERVICE:
				return "#4c5680";
			case AssetStatus.AVAILABLE_ON:
				return "#0948B3";
			case AssetStatus.ON_OUR_LOAD:
				return "#9F90EF";

			default:
				return "";
		}
	},
	getQuoteStatusColor: (status) => {
		switch (status) {
			case QuoteStatus.NEW:
				return "bg-dodger-blue";

			default:
				return "";
		}
	},
	getQuoteType: (type) => {
		return (
			<div className="flex">
				<div className={`${globalUtils.getQuoteStatusColor(type)} text-white rounded-sm px-2`}>
					{globalUtils.snakeCaseToCapitalize(type)}
				</div>
			</div>
		);
	},
	isPhotoExist: (p) => {
		if (!p || p.includes("/media/settings.MEDIA_ROOT/profile_pic/avatar.jpg")) return false;
		return true;
	},
	snakeCaseToCapitalize: (word) => {
		let cWord = word;
		if (word) {
			cWord = word
				.split(word.includes("-") ? "-" : "_")
				.map((el) => {
					if (["of"].includes(el.toLowerCase())) return el.toLowerCase();
					if (["id"].includes(el.toLowerCase())) return el.toUpperCase();
					return el.charAt(0).toUpperCase() + el.slice(1).toLowerCase();
				})
				.join(" ");
		}
		return cWord;
	},
};

export default globalUtils;
