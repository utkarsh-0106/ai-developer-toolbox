import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./components/History";
import SiteGuide from "./components/SiteGuide";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
      <SiteGuide />
    </BrowserRouter>
  );
}

export default App;
