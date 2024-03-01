import request from 'supertest';
import app, { server } from '../src';
import redis, { deleteByPattern } from '../src/database/redis';

/**
 * Setup
 */
beforeAll(async () => {
	// Wait for redis connection
	return new Promise((resolve) => {
		redis.on('ready', () => {
			resolve(true);
		});
	});
});

beforeEach(async () => {
	// Clear redis cache
	await deleteByPattern('*');
});

/**
 * Teardown
 */
afterAll(async () => {
	// Close redis connection and server
	redis.quit();
	server.close();
});

describe('GET /api/v1/weather/forecast - Status 400', () => {
	it('should return status 400 on missing zipcode', async () => {
		const response = await request(app).get('/api/v1/weather/forecast');
		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('errors');
		expect(response.body.errors).toHaveLength(1);
	});

	it('should return status 400 on empty zipcode', async () => {
		const response = await request(app).get('/api/v1/weather/forecast?zipcode=');
		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('errors');
		expect(response.body.errors).toHaveLength(1);
	});

	it('should return status 400 on invalid zipcode', async () => {
		const response = await request(app).get('/api/v1/weather/forecast?zipcode=invalid-zip-code');
		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('errors');
		expect(response.body.errors).toHaveLength(1);
	});
});

describe('GET /api/v1/weather - Status 404', () => {
	it('should return status 404 on invalid route', async () => {
		const response = await request(app).get('/api/v1/weather/invalid-route');
		expect(response.status).toBe(404);
		expect(response.body.success).toBe(false);
		expect(response.body.errors).toEqual([{ message: 'Invalid route' }]);
	});
});

describe('GET /api/v1/weather/forecast - Status 200', () => {
	it('should return weather forecast data', async () => {
		const response = await request(app).get('/api/v1/weather/forecast?zipcode=560001');
		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body).toHaveProperty('data');
		expect(response.body).toHaveProperty('fromCache');
		expect(response.body.data).toHaveProperty('longitude');
		expect(response.body.data).toHaveProperty('latitude');
		expect(response.body.data).toHaveProperty('current');

		for (const key in response.body.data.current) {
			expect(response.body.data.current[key]).toHaveProperty('value');
			expect(response.body.data.current[key]).toHaveProperty('unit');
		}
		for (const key in response.body.data.daily) {
			expect(response.body.data.daily[key]).toHaveProperty('value');
			expect(response.body.data.daily[key]).toHaveProperty('unit');
		}
	});

	it('should return weather forecast data from cache', async () => {
		const response = await request(app).get('/api/v1/weather/forecast?zipcode=560001');
		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body).toHaveProperty('data');
		expect(response.body).toHaveProperty('fromCache');
		expect(response.body.fromCache).toBe(false);

		const response2 = await request(app).get('/api/v1/weather/forecast?zipcode=560001');
		expect(response2.status).toBe(200);
		expect(response2.body.success).toBe(true);
		expect(response2.body).toHaveProperty('data');
		expect(response2.body).toHaveProperty('fromCache');
		expect(response2.body.fromCache).toBe(true);
	});
});
