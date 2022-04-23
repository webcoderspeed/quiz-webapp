import express from 'express';
import morgan from 'morgan';
import setupSockets from './socket.js';

const app = express();

app.use(morgan('dev'));

// socket connection
setupSockets(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 1337;

app.get('/', (req, res) => res.send('Server is running'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
