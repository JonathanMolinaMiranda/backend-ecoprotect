import express from 'express';
import morgan from 'morgan';
import indexRoutes from './routes/index';
import path  from "path";

const app = express();

//settings
app.set('port', process.env.PORT || 55002);

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api', indexRoutes);

//this folder will be used to store images of publications
app.use('/images', express.static(path.resolve('images')));
export default app; 