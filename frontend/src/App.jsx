import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Join";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import DistributeValidator from "./components/distributeValidator";
import ChooseOperator from "./components/Choose Operator/ChooseOperator";
import DistributionMethod from "./components/distributionMethod";
import DragComponent from "./components/DragDrop2/DragComponent";
import Temp from "./pages/Temp";
import { MintNFT } from "./pages/mint";
import Temp2 from "./pages/Temp2";
import Temp3 from "./pages/Temp3";
import ChooseClustor from "./pages/ChooseClustor";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/join/validator"
            element={<DistributeValidator />}
          ></Route>
          <Route
            path="/join/validator/choose-operators"
            element={<ChooseOperator />}
          ></Route>
          <Route
            path="/join/choose-clustor"
            element={<ChooseClustor />}
          ></Route>
          {/* <Route
            path="/join/validator/distribution-method"
            element={<DistributionMethod />}
          ></Route> */}
          {/* <Route
            path="/join/validator/upload-keystore"
            element={<DragComponent />}
          ></Route> */}

          <Route path="/temp" element={<Temp />}></Route>

          <Route path="/temp2" element={<MintNFT />}></Route>
          <Route path="/temp3" element={<Temp2 />}></Route>
          <Route path="/temp4" element={<Temp3 />}></Route>
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
