import axios from 'axios';
jest.mock('axios');
global.console = { error: jest.fn() } as unknown as Console;

import { getWeatherData } from '../src/services/forecastService';

afterEach(() => {
	jest.clearAllMocks();
});

describe('Get weather data', () => {
	it('should throw error if the open-meteo API request fails', async () => {
		(axios.get as jest.Mock).mockImplementation(() => {
			throw new Error('Test error');
		});

		try {
			await getWeatherData(50, 50);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe('Failed to fetch weather data: Test error');
		}
	});

	it('should throw error if the open-meteo API request returns an error message', async () => {
		(axios.get as jest.Mock).mockResolvedValue({
			data: { error: 'true', reason: 'Invalid parameter name' },
		});

		try {
			await getWeatherData(50, 50);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe('Failed to fetch weather data: Invalid parameter name');
		}
	});
});
