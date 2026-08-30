import { stripToBareLetters } from "./niqqud.js";

const MAQAF = "־";

// Splits a block of Hebrew text into practice-word units: split on
// whitespace, then split maqaf-joined phrases into separate words
// (documented v1 simplification), then drop anything with no Hebrew
// letters (stray punctuation/digits).
export function tokenizeToWords(text) {
  return text
    .split(/\s+/)
    .flatMap((token) => token.split(MAQAF))
    .map((token) => token.trim())
    .filter((token) => stripToBareLetters(token).length > 0);
}
