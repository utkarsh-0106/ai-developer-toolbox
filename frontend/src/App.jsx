import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./components/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;