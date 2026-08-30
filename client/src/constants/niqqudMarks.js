// Marks are grouped into 3 UI sections (ניקוד / חטפים / אחר), and each
// carries an exclusivityGroup used by NiqqudPalette's apply logic:
// - "vowel": at most one active per letter (a letter has exactly one vowel
//   point in Hebrew - regular or hataf - clicking replaces the previous one,
//   clicking the active one again clears it).
// - "dagesh": independent on/off toggle.
// - "shinsin": at most one of shin-dot/sin-dot active per letter.
export const NIQQUD_SECTIONS = [
  {
    id: "niqqud",
    label: "ניקוד",
    marks: [
      { id: "sheva", label: "שווא", char: "ְ", exclusivityGroup: "vowel" },
      { id: "patach", label: "פתח", char: "ַ", exclusivityGroup: "vowel" },
      { id: "kamatz", label: "קמץ", char: "ָ", exclusivityGroup: "vowel" },
      { id: "tzere", label: "צירה", char: "ֵ", exclusivityGroup: "vowel" },
      { id: "segol", label: "סגול", char: "ֶ", exclusivityGroup: "vowel" },
      { id: "hirik", label: "חיריק", char: "ִ", exclusivityGroup: "vowel" },
      { id: "holam", label: "חולם", char: "ֹ", exclusivityGroup: "vowel" },
      { id: "kubutz", label: "קובוץ", char: "ֻ", exclusivityGroup: "vowel" },
      { id: "kamatz-katan", label: "קמץ קטן", char: "ׇ", exclusivityGroup: "vowel" },
      {
        id: "shuruk",
        label: "שורוק",
        char: "ּ",
        exclusivityGroup: "dagesh",
        restrictToLetter: "ו",
        hint: "שורוק (דגש בתוך ו׳)",
      },
    ],
  },
  {
    id: "hataf",
    label: "חטפים",
    marks: [
      { id: "hataf-segol", label: "חטף סגול", char: "ֱ", exclusivityGroup: "vowel" },
      { id: "hataf-patach", label: "חטף פתח", char: "ֲ", exclusivityGroup: "vowel" },
      { id: "hataf-kamatz", label: "חטף קמץ", char: "ֳ", exclusivityGroup: "vowel" },
    ],
  },
  {
    id: "other",
    label: "אחר",
    marks: [
      { id: "dagesh", label: "דגש / מפיק", char: "ּ", exclusivityGroup: "dagesh" },
      { id: "shin-dot", label: "שי׳ ימין", char: "ׁ", exclusivityGroup: "shinsin", restrictToLetter: "ש" },
      { id: "sin-dot", label: "שי׳ שמאל", char: "ׂ", exclusivityGroup: "shinsin", restrictToLetter: "ש" },
    ],
  },
];

export const ALL_MARKS = NIQQUD_SECTIONS.flatMap((section) => section.marks);
