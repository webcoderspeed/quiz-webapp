import { createServer } from 'http';
import { Server } from 'socket.io';
import { Aki } from 'aki-api';

const setupSockets = (app) => {
  const server = new Server(createServer(app), {
    cors: {
      origin: '*',
    },
  });

  server.on('connection', async (socket) => {
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

  server.listen(8080, () => {
    console.log(`Websocket server is listening on port: 8080`);
  });
};

export default setupSockets;
