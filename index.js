import express from 'express';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Aki } from 'aki-api';
import cors from 'cors';

const app = express();
const server = createServer(app);

app.use(morgan('dev'));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(`Server is running `);
});

io.on('connection', async (socket) => {
  const aki = new Aki({
    region: 'en',
  });
  await aki.start();

  socket.emit('question', {
    question: aki.question,
    answers: aki.answers,
    progress: aki.progress,
  });

  socket.on('answer', async (data) => {
    while (aki.progress <= 100) {
      await aki.step(data.answer);

      if (aki.progress >= 75 || aki.currentStep >= 79) {
        await aki.win();
        socket.emit('win', {
          result: {
            guessCount: aki.guessCount,
            answers: aki.answers,
          },
        });
        break;
      }

      console.log('progress:', aki.progress);
      console.log('guessCount:', aki.guessCount);

      const question = aki.question;
      const answers = aki.answers;

      socket.emit('question', {
        question,
        answers,
        progress: aki.progress,
      });
      break;
    }
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
});

server.listen(PORT, () => {
  console.log(`Websocket server is listening on port:${PORT}`);
});
