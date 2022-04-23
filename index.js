import express from 'express';
import morgan from 'morgan';
import setupSockets from './socket.js';

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Server is running'));

// socket connection
setupSockets(app);
