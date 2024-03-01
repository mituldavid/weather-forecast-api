import { Request, Response } from 'express';
import { getCoordinates } from '../../services/zipcodeService';
import { getWeatherData } from '../../services/forecastService';

/**
 * Fetch weather forecast for the given zipcode
 * @param: zipcode: A valid postal code
 */

const getWeatherForecast = async (req: Request, res: Response) => {
	const zipcode = req.query.zipcode as string;
	try {
		const { latitude, longitude } = await getCoordinates(zipcode);
		const forecast = await getWeatherData(latitude, longitude);
		res.status(200).json({
			success: true,
			data: forecast,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: (error as Error).message || 'Internal Server Error',
		});
	}
};

export { getWeatherForecast };
