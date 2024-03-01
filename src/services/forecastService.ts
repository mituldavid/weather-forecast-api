import { fetchWeatherApi } from 'openmeteo';

const getWeatherData = async (latitude: number, longitude: number) => {
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
	const url = 'https://api.open-meteo.com/v1/forecast';
	const responses = await fetchWeatherApi(url, params);

	// Since only only location is requested, the response array will contain only one element
	const response = responses[0];

	const daily = response.daily()!;
	const current = response.current()!;
	const utcOffsetSeconds = response.utcOffsetSeconds();

	// Format response
	const weatherData = {
		latitude,
		longitude,
		current: {
			time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
			temperature2m: current.variables(0)!.value(),
			relativeHumidity2m: current.variables(1)!.value(),
			apparentTemperature: current.variables(2)!.value(),
			isDay: current.variables(3)!.value(),
			precipitation: current.variables(4)!.value(),
			rain: current.variables(5)!.value(),
			showers: current.variables(6)!.value(),
			snowfall: current.variables(7)!.value(),
			weatherCode: current.variables(8)!.value(),
			cloudCover: current.variables(9)!.value(),
			pressureMsl: current.variables(10)!.value(),
			surfacePressure: current.variables(11)!.value(),
			windSpeed10m: current.variables(12)!.value(),
			windDirection10m: current.variables(13)!.value(),
			windGusts10m: current.variables(14)!.value(),
		},
		daily: {
			temperature2mMax: daily.variables(0)!.valuesArray()![0],
			temperature2mMin: daily.variables(1)!.valuesArray()![0],
			daylightDuration: daily.variables(2)!.valuesArray()![0],
			sunshineDuration: daily.variables(3)!.valuesArray()![0],
			uvIndexMax: daily.variables(4)!.valuesArray()![0],
			precipitationHours: daily.variables(5)!.valuesArray()![0],
			precipitationProbabilityMax: daily.variables(6)!.valuesArray()![0],
		},
	};

	return weatherData;
};

export { getWeatherData };
