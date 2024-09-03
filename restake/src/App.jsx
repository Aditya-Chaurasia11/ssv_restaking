import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import UploadKeyStorePage from "./pages/UploadKeyStorePage";
import "react-toastify/dist/ReactToastify.css";
import RestakingInfoCard from "./pages/RestakingInfoCard";
import ClustorPage from "./pages/ClustorPage";
// import { MintNFT } from "./pages/Temp";
import { Web3provider } from "./api/contextapi";
import ChooseOperator from "./pages/Choose Operator/ChooseOperator";
import UploadKeystoreCluster from "./pages/UploadKeystoreCluster";

function App() {
  return (
    <>
      <Web3provider>
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
            <Route path="/create-cluster" element={<ChooseOperator />}></Route>
            <Route
              path="/create-cluster/upload-keystore"
              element={<UploadKeystoreCluster />}
            ></Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </Web3provider>
    </>
  );
}

export default App;
