import axios from 'axios';

const getWeatherData = async (latitude: number, longitude: number) => {
	const apiUrl = `https://api.open-meteo.com/v1/forecast`;
	const params = {
		latitude,
		longitude,
		current: [
			'temperature_2m',
			'relative_humidity_2m',
			'apparent_temperature',
			'is_day',
			'precipitation',
			'rain',
			'showers',
			'snowfall',
			'weather_code',
			'cloud_cover',
			'pressure_msl',
			'surface_pressure',
			'wind_speed_10m',
			'wind_direction_10m',
			'wind_gusts_10m',
		],
		daily: [
			'temperature_2m_max',
			'temperature_2m_min',
			'daylight_duration',
			'sunshine_duration',
			'uv_index_max',
			'precipitation_hours',
			'precipitation_probability_max',
		],
		forecast_days: 1,
	};

	try {
		const response = await axios.get(apiUrl, { params });
		const data = response.data;

		if (data.error && data.error === 'true') {
			throw new Error(data.reason);
		}

		const daily = data.daily;
		const dailyUnits = data.daily_units;
		const current = data.current;
		const currentUnits = data.current_units;

		// Structure the data
		const weatherData = {
			latitude,
			longitude,
			current: {
				time: { value: new Date(current.time), unit: currentUnits.time },
				temperature: { value: current.temperature_2m, unit: currentUnits.temperature_2m },
				relativeHumidity: {
					value: current.relative_humidity_2m,
					unit: currentUnits.relative_humidity_2m,
				},
				apparentTemperature: {
					value: current.apparent_temperature,
					unit: currentUnits.apparent_temperature,
				},
				isDay: { value: current.is_day, unit: currentUnits.is_day },
				precipitation: { value: current.precipitation, unit: currentUnits.precipitation },
				rain: { value: current.rain, unit: currentUnits.rain },
				showers: { value: current.showers, unit: currentUnits.showers },
				snowfall: { value: current.snowfall, unit: currentUnits.snowfall },
				weatherCode: { value: current.weather_code, unit: currentUnits.weather_code },
				cloudCover: { value: current.cloud_cover, unit: currentUnits.cloud_cover },
				seaLevelPressue: { value: current.pressure_msl, unit: currentUnits.pressure_msl },
				surfacePressure: { value: current.surface_pressure, unit: currentUnits.surface_pressure },
				windSpeed: { value: current.wind_speed_10m, unit: currentUnits.wind_speed_10m },
				windDirection: { value: current.wind_direction_10m, unit: currentUnits.wind_direction_10m },
				windGusts: { value: current.wind_gusts_10m, unit: currentUnits.wind_gusts_10m },
			},
			daily: {
				maxTemperature: { value: daily.temperature_2m_max[0], unit: dailyUnits.temperature_2m_max },
				minTemperature: { value: daily.temperature_2m_min[0], unit: dailyUnits.temperature_2m_min },
				daylightDuration: { value: daily.daylight_duration[0], unit: dailyUnits.daylight_duration },
				sunshineDuration: { value: daily.sunshine_duration[0], unit: dailyUnits.sunshine_duration },
				maxUvIndex: { value: daily.uv_index_max[0], unit: dailyUnits.uv_index_max },
				precipitationHours: {
					value: daily.precipitation_hours[0],
					unit: dailyUnits.precipitation_hours,
				},
				maxPrecipitationProbability: {
					value: daily.precipitation_probability_max[0],
					unit: dailyUnits.precipitation_probability_max,
				},
			},
		};

		return weatherData;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch weather data: ' + (error as Error).message);
	}
};

export { getWeatherData };
