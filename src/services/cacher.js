import { LOADS } from "../shared/serviceTags";

/**
 * Default tags used by the cacher helpers
 */
const defaultTags = [LOADS, "UNKNOWN_ERROR"];

function concatErrorCache(existingCache, error) {
	if (error && "status" in error && error.status === 401) {
		// unauthorized error
		return [...existingCache, "UNAUTHORIZED"];
	}

	// unknown error
	return [...existingCache, "UNKNOWN_ERROR"];
}

/**
 * An individual cache item
 */
export const CacheItem = (type, id) => ({ type, id });

/**
 * A list of cache items, including a LIST entity cache
 */
export const CacheList = (items) => [...items];

/**
 * Inner function returned by `providesList` to be passed to the `provides` property of a query
 */
export const InnerProvidesList = (type) => (results, error) => {
	// is result available?
	if (results) {
		// successful query
		return CacheList([{ type, id: "LIST" }, ...results.map(({ id }) => CacheItem(type, id))]);
	}
	// Received an error, include an error cache item to the cache list
	return concatErrorCache([CacheItem(type, "LIST")], error);
};

/**
 * HOF to create an entity cache to provide a LIST,
 * depending on the results being in a common format.
 *
 * Will not provide individual items without a result.
 */
export const providesList = (type) => InnerProvidesList(type);

/**
 * HOF to create an entity cache to invalidate a LIST.
 *
 * Invalidates regardless of result.
 */
export const invalidatesList = (type) => () => CacheList([CacheItem(type, "LIST")]);

/**
 * HOF to create an entity cache for a single item using the query argument as the ID.
 */
export const cacheByIdArg = (type) => (result, error, id) => [CacheItem(type, id)];

/**
 * HOF to create an entity cache for a single item using the id property from the query argument as the ID.
 */
export const cacheByIdArgProperty = (type) => (result, error, arg) => [CacheItem(type, arg.id)];

/**
 * HOF to invalidate the 'UNAUTHORIZED' type cache item.
 */
export const invalidatesUnauthorized = () => () => ["UNAUTHORIZED"];

/**
 * HOF to invalidate the 'UNKNOWN_ERROR' type cache item.
 */
export const invalidatesUnknownErrors = () => () => ["UNKNOWN_ERROR"];

/**
 * Utility helpers for common provides/invalidates scenarios
 */
export const cacher = {
	defaultTags,
	providesList,
	invalidatesList,
	cacheByIdArg,
	cacheByIdArgProperty,
	invalidatesUnauthorized,
	invalidatesUnknownErrors,
};
