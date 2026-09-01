# nikud-practice

אפליקציית תרגול ניקוד עברי אינטראקטיבית: בוחרים טקסט (מתוך ספריא או טקסט חופשי שמודבק), ומתרגלים להוסיף ניקוד למילים אות אחר אות, עם בדיקה וציון מיידיים בסוף כל מילה ובסיכום כולל בסוף התרגול.

## מה האפליקציה עושה

בעמוד הראשי אפשר לבחור בין שני מצבים:

- **בחירת מקור** — טעינת פרק מתוך תהלים או מתוך חמשת חומשי התורה (Genesis–Deuteronomy), דרך ה-API של [ספריא (Sefaria)](https://www.sefaria.org), כולל תצוגה מקדימה לפני תחילת התרגול.
- **הדבקת טקסט** — הדבקת קטע עברי חופשי. אם הטקסט כבר מנוקד הוא משמש כפי שהוא; אם לא, הוא מנוקד אוטומטית מול שירות ה-[נקדן של דיקטא (Dicta Nakdan)](https://nakdan.dicta.org.il) לפני תחילת התרגול.

לאחר מכן מתחיל תרגול מילה אחר מילה: לכל מילה מוצגות האותיות ה"עירומות" (בלי ניקוד), ובוחרים אות ומוסיפים לה ניקוד מתוך לוח סימנים (תנועות, חטפים, דגש/מפיק, שי"ן/שי"ן שמאלית). לחיצה על "בדוק" מציגה ציון למילה (אחוז אותיות נכונות) ומאפשרת להציג את הטעויות מול הניקוד הנכון. בסיום כל המילים מוצג עמוד תוצאות עם ציון כולל ופירוט לכל מילה, ואפשרות להתחיל תרגול חדש.

## Tech Stack

- **Frontend:** React 19, Vite, React Router v7, CSS Modules, oxlint
- **Backend:** Node.js, Express 5, express-rate-limit, cors, dotenv, nodemon (dev)
- **שירותים חיצוניים:** Sefaria API (טקסטים מקוריים), Dicta Nakdan API (ניקוד אוטומטי)

## תכונות עיקריות

- שני מקורות טקסט: מקור מוכן מתוך ספריא (תהלים / תורה, לפי ספר ופרק), או טקסט חופשי מודבק
- זיהוי אוטומטי אם הטקסט המודבק כבר מנוקד, ואם לא — ניקוד אוטומטי מול Dicta Nakdan
- תרגול ניקוד אינטראקטיבי, אות אחר אות, עם לוח בחירת סימני ניקוד (תנועות בלעדיות זו לזו, דגש כתגית עצמאית, שי"ן ימנית/שמאלית)
- בדיקה מיידית עם ציון לכל מילה (אחוז אותיות שנוקדו נכון) והצגת הטעויות מול הניקוד הנכון
- עמוד תוצאות מסכם עם ציון כולל, פירוט מילה-מילה ואפשרות להתחיל מחדש
- Rate limiting (20 בקשות לדקה) על קריאות לניקוד האוטומטי כדי להגן על השירות החיצוני
- Caching בצד השרת (24 שעות) לפרקי טקסט שנטענו מספריא
- קרדיט למקורות (ספריא ודיקטא) מוצג באפליקציה

## התקנה (Setup)

הפרויקט מחולק ל-`client` (React) ו-`server` (Express), ולכל אחד יש `package.json` נפרד.

```bash
git clone https://github.com/EyalHar/nikud-practice.git
cd nikud-practice

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### משתני סביבה (Environment variables)

בתיקיית `server` יש קובץ `.env.example` — יש להעתיק אותו ל-`.env` ולהתאים לפי הצורך:

```bash
cd server
cp .env.example .env
```

```
PORT=4000
SEFARIA_BASE_URL=https://www.sefaria.org/api
DICTA_BASE_URL=https://nakdan-u1-0.loadbalancer.dicta.org.il/api
CLIENT_ORIGIN=http://localhost:5173
```

## הרצה (How to Run)

### מצב פיתוח (Development)

יש להריץ את השרת ואת ה-client בשני טרמינלים נפרדים:

```bash
# Terminal 1 - server (http://localhost:4000)
cd server
npm run dev
```

```bash
# Terminal 2 - client (http://localhost:5173)
cd client
npm run dev
```

שרת ה-dev של Vite מגדיר proxy מ-`/api` אל `http://localhost:4000`, כך שה-client פונה לשרת בלי צורך בהגדרת CORS נוספת בפיתוח.

### Build לפרודקשן

```bash
cd client
npm run build      # בונה את ה-client לתיקיית dist
npm run preview    # מריץ preview מקומי של ה-build

cd ../server
npm start           # מריץ את השרת (node src/index.js)
```

## מבנה הפרויקט (Project Structure)

```
nikud-practice/
├── client/                     # React app (Vite)
│   └── src/
│       ├── pages/               # HomePage, PracticePage, ResultsPage
│       ├── components/          # layout (AppShell, Header) + shared UI (Button, Spinner...)
│       ├── hooks/                # useSefariaSources, useNakdanAnalyze
│       ├── context/              # PracticeSessionContext - מצב התרגול והציון
│       ├── constants/             # niqqudMarks - הגדרת לוח סימני הניקוד
│       ├── utils/                  # ניקוד/פירוק אותיות, tokenizer, scoring
│       └── api/                    # client fetch לשרת
└── server/                     # Express API
    └── src/
        ├── routes/               # /api/sources, /api/sefaria, /api/nakdan
        ├── controllers/
        ├── services/              # שירותי Sefaria ו-Dicta Nakdan
        ├── middleware/             # error handler
        ├── utils/                  # cache
        └── data/                    # קטלוג המקורות (ספרים ופרקים)
```
