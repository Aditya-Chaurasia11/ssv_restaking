import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import DistributeValidator from "./components/distributeValidator";
import ChooseOperator from "./components/Choose Operator/ChooseOperator";
import DistributionMethod from "./components/distributionMethod";
import DragComponent from "./components/DragDrop2/DragComponent";

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
            path="/join/validator/distribution-method"
            element={<DistributionMethod />}
          ></Route>
          <Route
            path="/join/validator/upload-keystore"
            element={<DragComponent />}
          ></Route>
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
