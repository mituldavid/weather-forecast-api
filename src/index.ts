import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import express, { Application, Request, Response } from 'express';
// Modules
import config from './config';

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

app.listen(PORT, () => console.info(`Server started on port: ${PORT}`));
