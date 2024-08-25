import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
