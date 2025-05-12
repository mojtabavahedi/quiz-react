import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();
const SEC_PER_QUESTION = 30;

const initialState = {
  questions: [],
  //`loading`,`error`,`ready`,`active`,`finished`
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: JSON.parse(localStorage.getItem("high")),
  secondRemaining: null,
  type: "All",
  number: 15,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecived":
      switch (state.type) {
        case "Easy":
          return {
            ...state,
            questions: action.payload
              .filter((x) => x.points === 10)
              .slice(0, state.number),

            status: "ready",
          };

        case "Intermediate":
          return {
            ...state,
            questions: action.payload
              .filter((x) => x.points === 20)
              .slice(0, state.number),

            status: "ready",
          };

        case "Hard":
          return {
            ...state,
            questions: action.payload
              .filter((x) => x.points === 30)
              .slice(0, state.number),

            status: "ready",
          };

        default:
          return {
            ...state,
            questions: action.payload.slice(0, state.number),

            status: "ready",
          };
      }

    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
      };
    case "type":
      return { ...state, type: action.payload };
    case "Number":
      return {
        ...state,
        number: action.payload,
      };

    default:
      throw new Error(`Action unknown`);
  }
}

function QuizProvider({ children }) {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondRemaining,
      type,
      number,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prv, cur) => prv + cur.points, 0);
  useEffect(
    function () {
      fetch("http://localhost:8000/questions")
        .then((res) => res.json())
        .then((data) => dispatch({ type: "dataRecived", payload: data }))
        .catch((err) => dispatch({ type: "dataFailed" }));
    },
    [type, number]
  );
  useEffect(
    function () {
      localStorage.setItem("high", JSON.stringify(highscore));
    },
    [highscore]
  );
  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondRemaining,
        type,
        number,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
function useQuestion() {
  const context = useContext(QuizContext);
  if (context === undefined) throw new Error("context use outside provider");
  return context;
}
export { useQuestion, QuizProvider };
