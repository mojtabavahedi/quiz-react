import { useQuestion } from "../context/QuizContext";

function StartScreen() {
  const { type, numQuestions, dispatch } = useQuestion();
  let lengthType =
    type === "Easy"
      ? 7
      : type === "Intermediate"
      ? 3
      : type === "Hard"
      ? 5
      : 15;
  return (
    <div className="start">
      <div className="type">
        <p>Type : </p>
        <select
          className="btn btn-ui"
          onChange={(e) => dispatch({ type: "type", payload: e.target.value })}
        >
          {" "}
          <option value="All">All</option>
          <option value="Easy">Easy</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="number">
        <p>Number : </p>
        <select
          className="btn li"
          onChange={(e) =>
            dispatch({ type: "Number", payload: Number(e.target.value) })
          }
        >
          {Array.from({ length: lengthType }, (v, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} question to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
