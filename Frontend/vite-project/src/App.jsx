import { Routes, Route, Link, useLocation } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import YoutubePage from "./pages/YoutubePage";
import About from "./pages/About";
import PrivacyPolicy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* 🔹 Show only home card when route is "/" */}
      {isHome ? (
        <div className="flex items-center justify-center flex-1">
          <div className="bg-white shadow-xl rounded-2xl p-10 w-80 sm:w-96 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              🎥 Video to Text Converter
            </h1>
            <p className="text-gray-500 mb-8">
              Choose how you want to transcribe your video
            </p>

            <div className="flex flex-col gap-4">
              <Link
                to="/upload"
                className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Upload Video
              </Link>
              <Link
                to="/youtube"
                className="bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition shadow-md"
              >
                YouTube Link
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // 🔹 Show other pages
        <div className="flex-1">
          <Routes>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/youtube" element={<YoutubePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      )}

      {/* ✅ Footer visible on all pages */}
      <Footer />
    </div>
  );
}

export default App;
