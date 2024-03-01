import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import express, { Application, Request, Response } from 'express';
// Modules
import config from './config';
import weatherRouter from './api/routes/weatherRouter';

const app: Application = express();
const PORT = config.port;

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get('/', (req: Request, res: Response) => {
	res.send(`Server running on port: ${PORT}`);
});

app.use('/api/v1/weather', weatherRouter);

app.use('*', (req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		errors: [{ message: 'Invalid route' }],
	});
});

const server = app.listen(PORT, () => console.info(`Server started on port: ${PORT}`));

export { app as default, server };
