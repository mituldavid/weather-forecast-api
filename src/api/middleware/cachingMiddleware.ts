import { Request, Response, NextFunction } from 'express';
import redis, { deleteByPattern } from '../../database/redis';

/**
 * A middleware function to check if the route's response already exists in cache,
 * and serve the cached response if it does. To be called before the route controller.
 * @param prefix: Prefix to be added to the redis key for identification and grouping
 */
const respondFromCache = (prefix: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const key = prefix + req.originalUrl || req.url;
			const cachedResponse = await redis.get(key);

			if (cachedResponse) {
				const response = JSON.parse(cachedResponse);
				return res.status(200).json({ ...response, fromCache: true });
			} else {
				return next();
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				success: false,
				errors: [{ message: 'Internal Server Error : Cache Error' }],
			});
		}
	};
};

/**
 * A middleware function that sets the route's response in cache before sending it. To be called after the route controller.
 * @param prefix: Prefix to be added to the redis key for identification and grouping
 * @param ttl: Time to live. The time in seconds after which the cached response will be invalidated
 */
const setCacheAndRespond = (prefix: string, ttl: number) => {
	return async (req: Request, res: Response) => {
		try {
			const response = res.body;
			const key = prefix + req.originalUrl || req.url;

			await redis.setEx(key, ttl, JSON.stringify(response));
			return res.status(200).json({ ...response, fromCache: false });
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				success: false,
				errors: [{ message: 'Internal Server Error : Cache Error' }],
			});
		}
	};
};

/**
 * A middleware function that invalidates all cached responses before sending the response. To be called after the route controller
 * @param prefix
 */
const flushCacheAndRespond = (prefix: string) => {
	return async (req: Request, res: Response) => {
		try {
			const response = res.body;
			await deleteByPattern(`${prefix}*`);
			console.info(`${prefix} Cache flushed`);
			return res.status(200).json(response);
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				success: false,
				errors: [{ message: 'Internal Server Error : Cache Error' }],
			});
		}
	};
};

export { respondFromCache, setCacheAndRespond, flushCacheAndRespond };
