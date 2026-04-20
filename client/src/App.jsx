import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DietCountPage from "./pages/DietCountPage";
import RecipePage from "./pages/RecipePage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <div className="min-h-screen bg-base text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(194,65,12,0.12),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(15,118,110,0.18),transparent_30%),linear-gradient(180deg,#f7f5ef,#f1efe8)]" />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/diet-count" element={<DietCountPage />} />
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
