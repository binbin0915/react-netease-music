import { get } from "utils";

export const getSearchHot = async () => {
	const res = await get(`/search/hot`);

	return res.result;
};

export const getSearchSuggest = async keywords => {
	const res = await get(`/search/suggest`, { keywords });

	return res.result;
};

export const getSearch = async params => {
	const res = await get(`/search`, params);

	return res.result;
};
