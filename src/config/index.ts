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
const development = {};

// Production-Specific Configuration
const production = {};

// Load environment dependent configuration
const config = {
	...global,
	...(global.env === 'production' ? production : development),
};

export default config;
