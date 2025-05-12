import { useQuestion } from "../context/QuizContext";
import Options from "./options";

function Question({ question }) {
  const { dispatch, answer } = useQuestion();
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
