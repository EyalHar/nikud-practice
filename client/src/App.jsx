import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PracticeSessionProvider } from "./context/PracticeSessionContext.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import PracticePage from "./pages/PracticePage/PracticePage.jsx";
import ResultsPage from "./pages/ResultsPage/ResultsPage.jsx";

export default function App() {
  return (
    <PracticeSessionProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </PracticeSessionProvider>
  );
}
