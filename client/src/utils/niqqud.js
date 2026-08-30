// Hebrew letters (includes final forms - they are distinct codepoints).
const HEBREW_LETTER = "\\u05D0-\\u05EA";
// Niqqud only: sheva..dagesh/mapiq (ְ-ּ), rafe (ֿ),
// shin/sin dot (ׁ-ׂ), qamats qatan (ׇ).
// Deliberately excludes meteg (ֽ), maqaf (־), paseq (׀),
// sof pasuk (׃) and cantillation (֑-֯) - out of scope for niqqud practice.
const NIQQUD_MARKS = "\\u05B0-\\u05BC\\u05BF\\u05C1-\\u05C2\\u05C7";

const NIQQUD_TEST_RE = new RegExp(`[${NIQQUD_MARKS}]`);
const NON_LETTER_NON_NIQQUD_RE = new RegExp(`[^${HEBREW_LETTER}${NIQQUD_MARKS}]`, "g");
const NON_LETTER_RE = new RegExp(`[^${HEBREW_LETTER}]`, "g");
const CLUSTER_RE = new RegExp(`[${HEBREW_LETTER}][${NIQQUD_MARKS}]*`, "g");

export function hasNiqqud(text) {
  return NIQQUD_TEST_RE.test(text);
}

export function stripToBareLetters(word) {
  return word.replace(NON_LETTER_RE, "");
}

export function splitToClusters(word) {
  const cleaned = word.replace(NON_LETTER_NON_NIQQUD_RE, "");
  const matches = cleaned.match(CLUSTER_RE) ?? [];
  return matches.map((cluster) => ({
    base: cluster[0],
    marks: [...cluster.slice(1)],
  }));
}

function marksEqual(a, b) {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((mark) => setA.has(mark));
}

export function scoreWord(expectedWord, enteredClusters) {
  const expectedClusters = splitToClusters(expectedWord);
  const totalLetters = expectedClusters.length;
  const letterResults = expectedClusters.map((expected, i) => {
    const entered = enteredClusters[i];
    return Boolean(entered) && entered.base === expected.base && marksEqual(expected.marks, entered.marks);
  });
  const correctCount = letterResults.filter(Boolean).length;
  const score = totalLetters > 0 ? Math.round((correctCount / totalLetters) * 100) : 0;
  return { score, letterResults, expectedClusters };
}
