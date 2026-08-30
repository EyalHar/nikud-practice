import { createContext, useCallback, useContext, useMemo, useReducer } from "react";

const PracticeSessionContext = createContext(null);

const initialState = {
  meta: { sourceLabel: "", hadNiqqudInSource: true },
  answerKeyWords: [],
  userAnswers: [],
  currentIndex: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "START_SESSION":
      return {
        meta: { sourceLabel: action.sourceLabel, hadNiqqudInSource: action.hadNiqqudInSource },
        answerKeyWords: action.answerKeyWords,
        userAnswers: action.answerKeyWords.map(() => null),
        currentIndex: 0,
      };
    case "RECORD_ANSWER": {
      if (state.userAnswers[action.index]) return state;
      const userAnswers = [...state.userAnswers];
      userAnswers[action.index] = {
        enteredWord: action.enteredWord,
        score: action.score,
        letterResults: action.letterResults,
      };
      return { ...state, userAnswers };
    }
    case "NEXT_WORD":
      return { ...state, currentIndex: Math.min(state.currentIndex + 1, state.answerKeyWords.length) };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function PracticeSessionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startSession = useCallback(
    (answerKeyWords, sourceLabel, hadNiqqudInSource) =>
      dispatch({ type: "START_SESSION", answerKeyWords, sourceLabel, hadNiqqudInSource }),
    [],
  );
  const recordAnswer = useCallback(
    (index, enteredWord, score, letterResults) =>
      dispatch({ type: "RECORD_ANSWER", index, enteredWord, score, letterResults }),
    [],
  );
  const nextWord = useCallback(() => dispatch({ type: "NEXT_WORD" }), []);
  const resetSession = useCallback(() => dispatch({ type: "RESET" }), []);

  const value = useMemo(
    () => ({ ...state, startSession, recordAnswer, nextWord, resetSession }),
    [state, startSession, recordAnswer, nextWord, resetSession],
  );

  return <PracticeSessionContext.Provider value={value}>{children}</PracticeSessionContext.Provider>;
}

export function usePracticeSession() {
  const ctx = useContext(PracticeSessionContext);
  if (!ctx) throw new Error("usePracticeSession must be used within PracticeSessionProvider");
  return ctx;
}

export function computeRunningAverage(userAnswers) {
  const answered = userAnswers.filter(Boolean);
  if (answered.length === 0) return 0;
  const sum = answered.reduce((acc, a) => acc + a.score, 0);
  return Math.round(sum / answered.length);
}
