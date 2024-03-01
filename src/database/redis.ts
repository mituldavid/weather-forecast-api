import { createClient } from 'redis';
import config from '../config';

const redis = createClient({
	socket: {
		tls: true,
		host: config.redis.host,
		port: parseInt(config.redis.port as string),
		rejectUnauthorized: true,
	},
	password: config.redis.password,
});
redis.on('ready', () => console.info(`Connected to Redis - ${config.redis.host as string}`));
redis.on('error', (error) => console.error(`Redis Error : ${error}`));
redis.connect();

const deleteByPattern = async (pattern: string) => {
	const keys = redis.scanIterator({ MATCH: pattern });
	for await (const key of keys) {
		await redis.del(key);
	}
};

export { redis as default, deleteByPattern };
