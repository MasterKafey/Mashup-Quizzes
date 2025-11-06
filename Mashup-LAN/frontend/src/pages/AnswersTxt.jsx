import { useEffect, useState } from 'react';

function AnswersTxt() {
  const [answers, setAnswers] = useState('');

  useEffect(() => {
    fetch(import.meta.env.VITE_URL_SERVER + '/answers-txt')
      .then((res) => res.text())
      .then((text) => {
        console.log(text); 
        setAnswers(text)//
      });
  }, []);

  return <div>{answers}</div>;
}

export default AnswersTxt;
