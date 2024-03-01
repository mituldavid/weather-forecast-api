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
		socket: {
			host: process.env.REDIS_HOST_DEV,
			port: parseInt(process.env.REDIS_PORT_DEV as string),
		},
		password: process.env.REDIS_PASSWORD_DEV,
	},
};

// Production-Specific Configuration
const production = {
	redis: {
		socket: {
			tls: true,
			host: process.env.REDIS_HOST_PROD,
			port: parseInt(process.env.REDIS_PORT_PROD as string),
			rejectUnauthorized: true,
		},
		password: process.env.REDIS_PASSWORD_PROD,
	},
};

// Load environment dependent configuration
const config = {
	...global,
	...(global.env === 'production' ? production : development),
};

export default config;
