import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import toast, { Toaster } from "react-hot-toast";
import Shorts from "./Pages/Shorts/Shorts";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgetPassword from "./Pages/ForgetPassword";
import CreateChannel from "./Pages/Channel/CreateChannel";
import ViewChannel from "./Pages/Channel/ViewChannel";
import useGetCurrentChannel from "./hooks/useGetCurrentChannel";
import UpdateChannel from "./Pages/Channel/UpdateChannel";
import { useSelector } from "react-redux";

export const serverUrl = "http://localhost:4000";

const ProtectRoute = ({ userData, children }) => {
  if (!userData) {
    toast.error("Please Sign up to use this feature");
    return <Navigate to={"/"} replace />;
  }
  return children;
};

const AuthProtectRoute = ({ userData, children }) => {
  if (userData) {
    return <Navigate to={"/"} replace />;
  }
  return children;
};

const App = () => {
  const { user } = useSelector((state) => state.user);

  useGetCurrentUser();
  useGetCurrentChannel();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="/shorts"
            element={
              <ProtectRoute userData={user}>
                <Shorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/mobileprofile"
            element={
              <ProtectRoute userData={user}>
                <MobileProfile />
              </ProtectRoute>
            }
          />
          <Route
            path="/viewchannel"
            element={
              <ProtectRoute userData={user}>
                <ViewChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/updatechannel"
            element={
              <ProtectRoute userData={user}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />
        </Route>
        <Route
          path="/signin"
          element={
            <AuthProtectRoute userData={user}>
              <Signin />
            </AuthProtectRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthProtectRoute userData={user}>
              <Signup />
            </AuthProtectRoute>
          }
        />
        <Route
          path="/forgetpass"
          element={
            <AuthProtectRoute userData={user}>
              <ForgetPassword />
            </AuthProtectRoute>
          }
        />
        <Route
          path="/createchannel"
          element={
            <ProtectRoute userData={user}>
              <CreateChannel />
            </ProtectRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
