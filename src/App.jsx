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
import CreatePage from "./Pages/CreatePage";
import CreateVideo from "./Pages/Video/CreateVideo";
import PlayVideo from "./Pages/Video/PlayVideo";
import CreatePost from "./Pages/Post/CreatePost";
import CreatePlaylist from "./Pages/Playlist/CreatePlaylist";
import CreateShorts from "./Pages/Shorts/CreateShorts";
import useGetAllContentData from "./hooks/useGetAllContentData";
import WatchShorts from "./Pages/Shorts/WatchShorts";
import useGetAllChannelData from "./hooks/useGetAllChannelData";
import ChannelPage from "./Pages/Channel/ChannelPage";
import LikedContent from "./Pages/LikedContent";
import SavedContent from "./Pages/SavedContent";
import SavedPlaylist from "./Pages/Playlist/SavedPlaylist";

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
  useGetAllChannelData();
  useGetAllContentData();
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
            path="/watch-short/:id"
            element={
              <ProtectRoute userData={user}>
                <WatchShorts />
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
            path="/channel/:id"
            element={
              <ProtectRoute userData={user}>
                <ChannelPage />
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
          <Route
            path="/create"
            element={
              <ProtectRoute userData={user}>
                <CreatePage />
              </ProtectRoute>
            }
          />
          <Route
            path="/create-video"
            element={
              <ProtectRoute userData={user}>
                <CreateVideo />
              </ProtectRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectRoute userData={user}>
                <CreatePost />
              </ProtectRoute>
            }
          />
          <Route
            path="/create-playlist"
            element={
              <ProtectRoute userData={user}>
                <CreatePlaylist />
              </ProtectRoute>
            }
          />
          <Route
            path="/create-short"
            element={
              <ProtectRoute userData={user}>
                <CreateShorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/likedcontent"
            element={
              <ProtectRoute userData={user}>
                <LikedContent />
              </ProtectRoute>
            }
          />
          <Route
            path="/savedcontent"
            element={
              <ProtectRoute userData={user}>
                <SavedContent />
              </ProtectRoute>
            }
          />
          <Route
            path="/savedplaylist"
            element={
              <ProtectRoute userData={user}>
                <SavedPlaylist />
              </ProtectRoute>
            }
          />
          <Route
            path="/watch-video/:id"
            element={
              <ProtectRoute userData={user}>
                <PlayVideo />
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
