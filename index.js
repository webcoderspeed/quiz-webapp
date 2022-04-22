import express from 'express';
import morgan from 'morgan';
import setupSockets from './socket.js';

const app = express();

app.use(morgan('dev'));

// socket connection
setupSockets(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
