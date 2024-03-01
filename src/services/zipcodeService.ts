import axios from 'axios';
import config from '../config';

/**
 * Fetches the coordinates for the given zipcode using the Google Maps Geocoding API
 * Reference: https://developers.google.com/maps/documentation/geocoding/requests-geocoding
 * @param zipcode
 * @returns {latitude, longitude}
 */
const getCoordinates = async (zipcode: string) => {
	const apiKey = config.googleMaps.apiKey;
	const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json`;

	try {
		const response = await axios.get(apiUrl, {
			params: {
				address: zipcode,
				key: apiKey,
			},
		});
		const status = response.data.status;

		// Throw error on invalid status
		if (['OVER_DAILY_LIMIT', 'OVER_QUERY_LIMIT'].includes(status)) {
			throw new Error('API limit reached');
		}
		if (['REQUEST_DENIED', 'INVALID_REQUEST'].includes(status)) {
			throw new Error('API request denied');
		}
		if (status === 'ZERO_RESULTS') {
			throw new Error('No results found for the given zipcode');
		}
		if (status === 'UNKNOWN_ERROR') {
			throw new Error('Unknown error');
		}

		const topResult = response.data.results[0];
		return {
			latitude: topResult.geometry.location.lat,
			longitude: topResult.geometry.location.lng,
		};
	} catch (error) {
		console.error(error);
		throw new Error(
			'Unable to fetch coordinates for the given zipcode: ' + (error as Error).message,
		);
	}
};

export { getCoordinates };
