import axios from 'axios';
jest.mock('axios');
global.console = { error: jest.fn() } as unknown as Console;
import { getCoordinates } from '../src/services/zipcodeService';

afterEach(() => {
	jest.clearAllMocks();
});

describe('Get coordinates', () => {
	it('should throw "API limit reached" error if status is OVER_DAILY_LIMIT', async () => {
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: 'OVER_DAILY_LIMIT' },
		});

		try {
			await getCoordinates('560001');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe(
				'Unable to fetch coordinates for the given zipcode: API limit reached',
			);
		}
	});

	it('should throw "API limit reached" error if status is OVER_QUERY_LIMIT', async () => {
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: 'OVER_QUERY_LIMIT' },
		});

		try {
			await getCoordinates('560001');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe(
				'Unable to fetch coordinates for the given zipcode: API limit reached',
			);
		}
	});

	it('should throw "API request denied" error if status is REQUEST_DENIED', async () => {
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: 'REQUEST_DENIED' },
		});

		try {
			await getCoordinates('560001');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe(
				'Unable to fetch coordinates for the given zipcode: API request denied',
			);
		}
	});

	it('should throw "API request denied" error if status is INVALID_REQUEST', async () => {
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: 'INVALID_REQUEST' },
		});

		try {
			await getCoordinates('560001');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe(
				'Unable to fetch coordinates for the given zipcode: API request denied',
			);
		}
	});

	it('should throw "No results found for the given zipcode" error if status is ZERO_RESULTS', async () => {
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: 'ZERO_RESULTS' },
		});

		try {
			await getCoordinates('560001');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe(
				'Unable to fetch coordinates for the given zipcode: No results found for the given zipcode',
			);
		}
	});

	it('should throw "Unknown error" error if status is UNKNOWN_ERROR', async () => {
		(axios.get as jest.Mock).mockResolvedValue({
			data: { status: 'UNKNOWN_ERROR' },
		});

		try {
			await getCoordinates('560001');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe(
				'Unable to fetch coordinates for the given zipcode: Unknown error',
			);
		}
	});

	it('should throw error if the Google Maps Geocoding API request fails', async () => {
		(axios.get as jest.Mock).mockImplementation(() => {
			throw new Error('Test error');
		});

		try {
			await getCoordinates('560001');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe(
				'Unable to fetch coordinates for the given zipcode: Test error',
			);
		}
	});
});
