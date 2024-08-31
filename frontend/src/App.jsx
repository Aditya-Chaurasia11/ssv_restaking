import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Join";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import DragComponent from "./components/DragDrop2/DragComponent";
import "react-toastify/dist/ReactToastify.css";
import RestakingInfoCard from "./components/RestakingInfoCard";
import ClustorPage from "./pages/ClustorPage";
import Temp3 from "./pages/Temp3";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/restake" element={<RestakingInfoCard />}></Route>
          <Route path="/upload-keystore" element={<DragComponent />}></Route>
          <Route path="/choose-clustor" element={<ClustorPage />}></Route>
          <Route path="/temp" element={<Temp3 />}></Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
