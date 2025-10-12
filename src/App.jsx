import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import { Toaster } from "react-hot-toast";
import Shorts from "./Pages/Shorts/Shorts";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgetPassword from "./Pages/ForgetPassword";

export const serverUrl = "http://localhost:4000";

const App = () => {
  useGetCurrentUser();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/mobileprofile" element={<MobileProfile />} />
        </Route>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
