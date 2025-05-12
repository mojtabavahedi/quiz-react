import { useEffect } from "react";
import { useQuestion } from "../context/QuizContext";

function Timer() {
  const { dispatch, secondRemaining } = useQuestion();
  const mins = Math.floor(secondRemaining / 60);
  const seconds = secondRemaining % 60;

  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{seconds < 10 && 0}
      {seconds}
    </div>
  );
}

export default Timer;
