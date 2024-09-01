import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import UploadKeyStorePage from "./pages/UploadKeyStorePage";
import "react-toastify/dist/ReactToastify.css";
import RestakingInfoCard from "./pages/RestakingInfoCard";
import ClustorPage from "./pages/ClustorPage";
import { MintNFT } from "./pages/Temp";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/restake" element={<RestakingInfoCard />}></Route>
          <Route
            path="/upload-keystore"
            element={<UploadKeyStorePage />}
          ></Route>
          <Route path="/choose-clustor" element={<ClustorPage />}></Route>
          <Route path="/temp" element={<MintNFT />}></Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
