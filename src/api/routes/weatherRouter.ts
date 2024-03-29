import { Router } from 'express';
import { query } from 'express-validator';
import throwValidationErrors from '../middleware/validationMiddleware';
import * as weatherController from '../controllers/weatherController';
import { respondFromCache, setCacheAndRespond } from '../middleware/cachingMiddleware';

const weatherRouter = Router();

/**
 * @route  GET weather/forecast?zipcode={zipcode}
 * @desc   Fetch weather forecast for the given zipcode
 * @query  zipcode: A valid postal code.
 */
weatherRouter.get(
	'/forecast',
	[
		// Validates the zipcode using express validator
		// Matches valid postal codes for any locale. For validation regex see https://github.com/validatorjs/validator.js/blob/b958bd7d1026a434ad3bf90064d3dcb8b775f1a9/src/lib/isPostalCode.js#L80
		query('zipcode').notEmpty().bail().trim().isPostalCode('any'),
	],
	throwValidationErrors,
	respondFromCache('weather-forecast:'),
	weatherController.getWeatherForecast,
	setCacheAndRespond('weather-forecast:', 1800), // Cache for 30 minutes (1800 seconds)
);

export default weatherRouter;
