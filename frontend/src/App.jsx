import { BrowserRouter, Routes, Route } from "react-router-dom";
import Consultation from "./pages/Consultation";
import History from "./pages/History";
// import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Diseases from "./pages/Diseases";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Consultation />} />
        <Route path="/history" element={<History />} />
        <Route path="/database" element={<Diseases />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
