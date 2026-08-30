const TORAH_BOOKS = [
  { key: "Genesis", label: "בראשית", chapters: 50 },
  { key: "Exodus", label: "שמות", chapters: 40 },
  { key: "Leviticus", label: "ויקרא", chapters: 27 },
  { key: "Numbers", label: "במדבר", chapters: 36 },
  { key: "Deuteronomy", label: "דברים", chapters: 34 },
];

export function getSourceCatalog() {
  return {
    tehillim: {
      key: "Psalms",
      label: "תהלים",
      chapters: 150,
    },
    torah: TORAH_BOOKS,
  };
}
