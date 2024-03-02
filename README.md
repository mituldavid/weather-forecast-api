# Weather Forecasting API

## About

An API that provides the current weather forecast for a given ZIP code.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup API Key

This application uses the
[Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/requests-geocoding)
to convert ZIP codes into geographical coordinates. To utilize this, you will need to create an API
Key on the Google Maps Platform (Follow instructions
[here](https://developers.google.com/maps/documentation/geocoding/get-api-key) for more details)

### 3. Configure the application

Create a `.env` file in the root folder with the following:

```bash
GOOGLE_MAPS_API_KEY="<your-google-maps-api-key>"

REDIS_HOST_DEV="<your-redis-host>"
REDIS_PORT_DEV="<your-redis-port>"
REDIS_PASSWORD_DEV="<your-redis-password>"

REDIS_HOST_PROD="<your-redis-host>"
REDIS_PORT_PROD="<your-redis-port>"
REDIS_PASSWORD_PROD="<your-redis-password>"
```

### 4. Build the application

```bash
npm run build
```

### 5. Run the application

```bash
npm start
```

## Features

- Built with Node.js and Express, utilizing TypeScript for type safety
- Returns comprehensive weather forecasts including temperature, humidity, precipitation, wind,
  pressure, UV index, and more
- Caching using Redis, implemented through custom middleware
- Tested with Jest

## Sample API Response

Endpoint:
[localhost:5000/api/v1/weather/forecast?zipcode=560001](http://localhost:5000/api/v1/weather/forecast?zipcode=560001)

Response:

```json
{
	"success": true,
	"data": {
		"latitude": 12.9765944,
		"longitude": 77.5992708,
		"current": {
			"time": {
				"value": "2024-03-01T17:00:00.000Z",
				"unit": "iso8601"
			},
			"temperature": {
				"value": 18.5,
				"unit": "°C"
			},
			"relativeHumidity": {
				"value": 77,
				"unit": "%"
			},
			"apparentTemperature": {
				"value": 19.2,
				"unit": "°C"
			},
			"isDay": {
				"value": 0,
				"unit": ""
			},
			"precipitation": {
				"value": 0,
				"unit": "mm"
			},
			"rain": {
				"value": 0,
				"unit": "mm"
			},
			"showers": {
				"value": 0,
				"unit": "mm"
			},
			"snowfall": {
				"value": 0,
				"unit": "cm"
			},
			"cloudCover": {
				"value": 100,
				"unit": "%"
			},
			"seaLevelPressue": {
				"value": 1014.8,
				"unit": "hPa"
			},
			"surfacePressure": {
				"value": 912.5,
				"unit": "hPa"
			},
			"windSpeed": {
				"value": 5.4,
				"unit": "km/h"
			},
			"windDirection": {
				"value": 110,
				"unit": "°"
			},
			"windGusts": {
				"value": 14.4,
				"unit": "km/h"
			}
		},
		"daily": {
			"maxTemperature": {
				"value": 32.2,
				"unit": "°C"
			},
			"minTemperature": {
				"value": 16.9,
				"unit": "°C"
			},
			"daylightDuration": {
				"value": 42800.71,
				"unit": "s"
			},
			"sunshineDuration": {
				"value": 40299.83,
				"unit": "s"
			},
			"maxUvIndex": {
				"value": 9.1,
				"unit": ""
			},
			"precipitationHours": {
				"value": 0,
				"unit": "h"
			},
			"maxPrecipitationProbability": {
				"value": 0,
				"unit": "%"
			}
		}
	},
	"fromCache": true
}
```
