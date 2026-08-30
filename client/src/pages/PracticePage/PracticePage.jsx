import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePracticeSession } from "../../context/PracticeSessionContext.jsx";
import ProgressBar from "./ProgressBar.jsx";
import WordDisplay from "./WordDisplay.jsx";

export default function PracticePage() {
  const navigate = useNavigate();
  const { answerKeyWords, currentIndex, userAnswers } = usePracticeSession();

  useEffect(() => {
    if (answerKeyWords.length === 0) {
      navigate("/", { replace: true });
      return;
    }
    if (currentIndex >= answerKeyWords.length) {
      navigate("/results", { replace: true });
    }
  }, [answerKeyWords.length, currentIndex, navigate]);

  if (answerKeyWords.length === 0 || currentIndex >= answerKeyWords.length) {
    return null;
  }

  return (
    <div className="page">
      <ProgressBar currentIndex={currentIndex} total={answerKeyWords.length} userAnswers={userAnswers} />
      <WordDisplay key={currentIndex} />
    </div>
  );
}
