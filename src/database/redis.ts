import { createClient } from 'redis';
import config from '../config';

const redis = createClient(config.redis);
redis.on('ready', () => console.info(`Connected to Redis - ${config.redis.socket.host as string}`));
redis.on('error', (error) => console.error(`Redis Error : ${error}`));
redis.connect();

const deleteByPattern = async (pattern: string) => {
	const keys = redis.scanIterator({ MATCH: pattern });
	for await (const key of keys) {
		await redis.del(key);
	}
};

export { redis as default, deleteByPattern };
