import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import { Toaster } from "react-hot-toast";
import Shorts from "./Pages/Shorts/Shorts";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgetPassword from "./Pages/ForgetPassword";
import CreateChannel from "./Pages/Channel/CreateChannel";
import ViewChannel from "./Pages/Channel/ViewChannel";
import useGetCurrentChannel from "./hooks/useGetCurrentChannel";

export const serverUrl = "http://localhost:4000";

const App = () => {
  useGetCurrentUser();
  useGetCurrentChannel();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/mobileprofile" element={<MobileProfile />} />
          <Route path="/viewchannel" element={<ViewChannel />} />
        </Route>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/createchannel" element={<CreateChannel />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
