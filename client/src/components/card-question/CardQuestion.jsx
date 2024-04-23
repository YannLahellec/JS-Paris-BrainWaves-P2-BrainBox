import { useState } from "react";
import "./CardQuestion.css";
import {PropTypes} from "prop-types";
import { useNavigate } from "react-router-dom";

import decode from 'decode-html'; 
import Geography from "../../assets/icons/geography.png";
import Timer from "./Timer";


function CardQuestion({ quizzes }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [time, setTime] = useState(10);
  const [anim, setAnim] = useState("animated");
  
  const navigate = useNavigate();

  const handlePageClick = (goodAnswers) => {
    setTime(10);
    setAnim("animated");
    if(currentPage >= 10){
      navigate("/scorespage", { state:{good:goodAnswers}})
    }
    setCurrentPage(currentPage + 1);
  };

  const questionPerPage = 1;
  const lastPageQuestion = questionPerPage * currentPage;
  const firstQuestionPage = lastPageQuestion - questionPerPage;

  function displayQuestion() {
    return quizzes.slice(firstQuestionPage, lastPageQuestion);
  }

  const [clickAnswser, setClickAnswer] = useState("");
  const [ goodAnswers, setGoodAnswers ] = useState(0);

  function checkAnswer(correctAnswer, answer, incorrectAnswers) {
    if (clickAnswser === answer && correctAnswer === clickAnswser){
      return "answers-green";
    }
    if (clickAnswser === answer && incorrectAnswers.includes(clickAnswser)){
      return "answers-red";
    }

    return null;
  }

  const [questionCount, setQuestionCount] = useState(1);

  function questionCounter() {
    if (questionCount <= 9) setQuestionCount(questionCount + 1);
  }

  function handleAnswer(answer, correctAnswer){
    if(answer === correctAnswer){
      setGoodAnswers(goodAnswers+1)
    }
    setClickAnswer(answer)
  }

  return (
    <section className="all-card">
      <Timer
        time={time}
        setTime={setTime}
        class={anim}
        setAnim={setAnim}
        anim={anim}
      />
      {time !== 0 &&
        displayQuestion().map((quizz) => (
          <>
            <div className="card-question">
              <div className="icons">
                <img className="icon" src={Geography} alt="" />
              </div>
              <hr />
              <p key={quizzes.question} className="question">
                {decode(quizz.question)}
              </p>
              <hr />
            </div>
            <section className="btn-answers">
              {quizz.answers.map((answer) => (
                <button
                  onClick={() => handleAnswer(answer, quizz.correct_answer)}
                  key={answer}
                  className={`answers ${checkAnswer(quizz.correct_answer, answer, quizz.incorrect_answers)}`}
                  type="button"
                >
                  {answer}
                </button>
              ))}
            </section>
          </>
        ))}
      <p>Question {questionCount}/10</p>
      <button
        type="button"
        onClick={() => {
          handlePageClick(goodAnswers);
          questionCounter();
        }}
        className="next-btn"
      >
        Next Question
      </button>
    </section>
  );
}

CardQuestion.propTypes = {
  quizzes: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      correct_answer: PropTypes.string.isRequired,
      incorrect_answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default CardQuestion;
