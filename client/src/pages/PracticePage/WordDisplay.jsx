import { useState } from "react";
import { usePracticeSession } from "../../context/PracticeSessionContext.jsx";
import { scoreWord } from "../../utils/niqqud.js";
import { ALL_MARKS } from "../../constants/niqqudMarks.js";
import LetterTile from "./LetterTile.jsx";
import NiqqudPalette from "./NiqqudPalette.jsx";
import Button from "../../components/shared/Button.jsx";
import styles from "./WordDisplay.module.css";

function applyMarkToSet(marks, mark) {
  const next = new Set(marks);
  if (mark.exclusivityGroup === "dagesh") {
    if (next.has(mark.char)) next.delete(mark.char);
    else next.add(mark.char);
    return next;
  }
  const groupChars = ALL_MARKS.filter((m) => m.exclusivityGroup === mark.exclusivityGroup).map((m) => m.char);
  const wasActive = next.has(mark.char);
  groupChars.forEach((c) => next.delete(c));
  if (!wasActive) next.add(mark.char);
  return next;
}

export default function WordDisplay() {
  const { answerKeyWords, currentIndex, recordAnswer, nextWord } = usePracticeSession();
  const current = answerKeyWords[currentIndex];
  const bareLetters = [...current.bare];

  const [letterMarks, setLetterMarks] = useState(() => bareLetters.map(() => new Set()));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [liveResult, setLiveResult] = useState(null);
  const [showMistakes, setShowMistakes] = useState(false);

  const selectedBase = selectedIndex !== null ? bareLetters[selectedIndex] : null;
  const activeMarks = selectedIndex !== null ? letterMarks[selectedIndex] : new Set();

  function handleApplyMark(mark) {
    if (selectedIndex === null) return;
    setLetterMarks((prev) => prev.map((set, i) => (i === selectedIndex ? applyMarkToSet(set, mark) : set)));
  }

  function handleClearWord() {
    setLetterMarks(bareLetters.map(() => new Set()));
    setSelectedIndex(null);
    setLiveResult(null);
    setShowMistakes(false);
  }

  function handleCheck() {
    const enteredClusters = bareLetters.map((base, i) => ({ base, marks: [...letterMarks[i]] }));
    const result = scoreWord(current.niqqud, enteredClusters);
    setLiveResult(result);
    setShowMistakes(false);
    if (!hasChecked) {
      const enteredWord = enteredClusters.map((c) => c.base + c.marks.join("")).join("");
      recordAnswer(currentIndex, enteredWord, result.score, result.letterResults);
      setHasChecked(true);
    }
  }

  return (
    <div className={styles.wordCard}>
      <div className={styles.wordRow}>
        {bareLetters.map((base, i) => {
          const status = liveResult ? (liveResult.letterResults[i] ? "correct" : "incorrect") : undefined;
          const expected = liveResult?.expectedClusters[i];
          return (
            <LetterTile
              key={i}
              base={base}
              marks={[...letterMarks[i]]}
              isSelected={selectedIndex === i}
              status={showMistakes ? status : undefined}
              expectedGlyph={expected ? expected.base + expected.marks.join("") : ""}
              onClick={() => setSelectedIndex(i)}
            />
          );
        })}
      </div>

      {liveResult && (
        <div className={`${styles.resultBar} ${liveResult.score === 100 ? styles.good : styles.bad}`}>
          <span className={styles.resultScore}>ציון למילה: {liveResult.score}%</span>
          {liveResult.score < 100 && (
            <Button variant="ghost" onClick={() => setShowMistakes((v) => !v)}>
              {showMistakes ? "הסתר טעויות" : "הראה טעות"}
            </Button>
          )}
        </div>
      )}

      <NiqqudPalette selectedBase={selectedBase} activeMarks={activeMarks} onApply={handleApplyMark} />

      <div className={styles.controls}>
        <Button variant="ghost" onClick={handleClearWord}>
          נקה מילה
        </Button>
        <Button variant="secondary" onClick={handleCheck}>
          {hasChecked ? "בדוק שוב" : "בדוק"}
        </Button>
        <Button onClick={nextWord} disabled={!hasChecked}>
          {currentIndex === answerKeyWords.length - 1 ? "סיום" : "מילה הבאה"}
        </Button>
      </div>
    </div>
  );
}
