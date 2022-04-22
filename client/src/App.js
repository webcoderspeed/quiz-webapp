import { useEffect } from 'react';
import { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  transport: ['websocket'],
});

function App() {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [guessCount, setGuessCount] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState([]);

  // listen for question
  useEffect(() => {
    socket.on('question', (data) => {
      setQuestion(data.question);
      setAnswers(data.answers);
      setProgress(data.progress);
    });

    socket.on('win', (data) => {
      setIsWin(true);
      setGuessCount(data.result.guessCount);
      setFinalAnswers(data.result.answers);
    });

    return () => {
      socket.off('question');
    };
  }, []);

  const handleClick = (index) => {
    socket.emit('answer', { answer: index });
    setQuestion('');
    setAnswers([]);
  };

  if (isWin) {
    return (
      <>
        <h1>You Win!</h1>
        <h2>Guess Count: {guessCount}</h2>
        <h2>
          Your Answers:
          <ul>
            {finalAnswers.map((answer, index) => (
              <li key={answer.id}>
                <p>id: {answer.id}</p>
                <p>id_base: {answer.id_base}</p>
                <p>name: {answer.name}</p>
                <p>description: {answer.description}</p>
                <p>valide_contrainte: {answer.valide_contrainte}</p>
                <p>absolute_picture_path: {answer.absolute_picture_path}</p>
                <p>award_id: {answer.award_id}</p>
                <p>corrupt: {answer.corrupt}</p>
                <p>flag_photo: {answer.flag_photo}</p>

                <p>nsfw: {answer.nsfw}</p>
                <p>picture_path: {answer.picture_path}</p>
                <p>proba: {answer.proba}</p>
                <p>pseudo: {answer.pseudo}</p>
                <p>ranking: {answer.ranking}</p>
                <p>relative: {answer.relative}</p>
              </li>
            ))}
          </ul>
        </h2>
      </>
    );
  }

  return (
    <div>
      <h1>Progress: {progress}</h1>

      {question === '' ? (
        <div>Loading Question...</div>
      ) : (
        <>
          <h1>{question}</h1>
          <ul>
            {answers.map((answer, index) => {
              return (
                <li
                  key={answer}
                  className='answer'
                  onClick={() => handleClick(index)}
                >
                  {answer}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
