import { Request, Response, NextFunction } from 'express';
import { getCoordinates } from '../../services/zipcodeService';
import { getWeatherData } from '../../services/forecastService';

/**
 * Fetch weather forecast for the given zipcode
 * @param: zipcode: A valid postal code
 */

const getWeatherForecast = async (req: Request, res: Response, next: NextFunction) => {
	const zipcode = req.query.zipcode as string;
	try {
		const { latitude, longitude } = await getCoordinates(zipcode);
		const forecast = await getWeatherData(latitude, longitude);
		res.body = {
			success: true,
			data: forecast,
		};
		return next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: (error as Error).message || 'Internal Server Error',
		});
	}
};

export { getWeatherForecast };
