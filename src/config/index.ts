import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Global Configuration
const global = {
	env: process.env.NODE_ENV,
	port: process.env.PORT || 5000,
	googleMaps: {
		apiKey: process.env.GOOGLE_MAPS_API_KEY,
	},
};

// Development-Specific Configuration
const development = {
	redis: {
		host: process.env.REDIS_HOST_DEV,
		port: process.env.REDIS_PORT_DEV,
		password: process.env.REDIS_PASSWORD_DEV,
	},
};

// Production-Specific Configuration
const production = {
	redis: {
		host: process.env.REDIS_HOST_PROD,
		port: process.env.REDIS_PORT_PROD,
		password: process.env.REDIS_PASSWORD_PROD,
	},
};

// Load environment dependent configuration
const config = {
	...global,
	...(global.env === 'production' ? production : development),
};

export default config;
