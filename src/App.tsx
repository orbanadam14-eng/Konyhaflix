import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import ShortsPage from "./pages/ShortsPage";
import { TopicPage, SeriesPage, SearchPage } from "./pages/Lists";
import Kerdoiv from "./pages/Kerdoiv";
import { initTracking, track } from "./lib/track";

export default function App() {
  const loc = useLocation();
  const state = loc.state as { backgroundLocation?: Location } | null;
  const bg = state?.backgroundLocation;
  const isShorts = loc.pathname.startsWith("/shorts");

  useEffect(() => {
    initTracking();
  }, []);

  useEffect(() => {
    track("page_view", { path: loc.pathname + loc.search });
  }, [loc.pathname, loc.search]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />

      <Routes location={bg ?? loc}>
        <Route path="/" element={<Home />} />
        <Route path="/video/:slug" element={<VideoPage />} />
        <Route path="/shorts" element={<ShortsPage />} />
        <Route path="/tema/:slug" element={<TopicPage />} />
        <Route path="/sorozat/:slug" element={<SeriesPage />} />
        <Route path="/kereses" element={<SearchPage />} />
        <Route path="/kerdoiv" element={<Kerdoiv />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* A lejatszo modalisan nyilik a mogotte levo oldal folott, de sajat URL-t kap. */}
      {bg && (
        <Routes>
          <Route path="/video/:slug" element={<VideoPage modal />} />
        </Routes>
      )}

      {!isShorts && <Footer />}
    </div>
  );
}
