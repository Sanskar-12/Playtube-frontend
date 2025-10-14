import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { TiUserAddOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUser } from "../redux/reducers/userSlice";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase.js";
import { FaClock, FaHistory, FaList, FaThumbsUp } from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";
import ProfileMenuItem from "./ProfileMenuItem.jsx";

const MobileProfile = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true,
      });

      dispatch(setUser(null));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Error in SignOut");
    }
  };

  const handleAuthWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, provider);

      const formData = new FormData();

      formData.append("userName", response.user.displayName);
      formData.append("email", response.user.email);
      formData.append("photoUrl", response.user.photoURL);

      const { data } = await axios.post(
        `${serverUrl}/api/v1/auth/google`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(data.user));

      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Error in Google Auth");
    }
  };
  return (
    <div className="md:hidden bg-[#0f0f0f] text-white h-[100%] w-[100%] flex flex-col pt-[100px] p-[10px]">
      {/* top profile section */}

      {user && (
        <div className="p-4 flex items-center gap-4 border-b border-gray-800">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt="profile"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <FaUserCircle className="text-6xl text-gray-400" />
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{user?.username}</span>
            <span className="text-gray-400 text-sm">{user?.email}</span>
            <p
              className="text-sm text-blue-400 cursor-pointer hover:underline"
              onClick={() => {
                user?.channel
                  ? navigate("/viewchannel")
                  : navigate("/createchannel");
              }}
            >
              {user?.channel ? "View Channel" : "Create Channel"}
            </p>
          </div>
        </div>
      )}
      {/* auth buttons */}
      <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto">
        <button
          onClick={handleAuthWithGoogle}
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-xl" />
          SignIn with Google Account
        </button>

        <button
          onClick={() => navigate("/signin")}
          className="bg-gray-800 px-3 py-1 rounded-2xl text-sm text-nowrap flex items-center justify-center gap-2"
        >
          {" "}
          <MdOutlineSwitchAccount className="text-xl" /> SignIn with other
          account
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-gray-800 px-3 text-nowrap py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
        >
          <TiUserAddOutline className="text-xl" />
          Create new account
        </button>

        {user && (
          <button
            onClick={handleSignOut}
            className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          >
            <FiLogOut className="text-xl" /> Sign out
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex flex-col">
        <ProfileMenuItem
          icon={<FaHistory />}
          text="History"
          onClick={() => navigate("/history")}
        />
        <ProfileMenuItem
          icon={<FaList />}
          text="Playlists"
          onClick={() => navigate("/saveplaylist")}
        />
        <ProfileMenuItem
          icon={<FaClock />}
          text="Save Videos"
          onClick={() => navigate("/savevideos")}
        />
        <ProfileMenuItem
          icon={<FaThumbsUp />}
          text="Liked Videos"
          onClick={() => navigate("/likedvideos")}
        />
        {user?.channel && (
          <ProfileMenuItem
            icon={<SiYoutubestudio className="w-5 h-5 text-orange-400" />}
            text="PT Studio"
            onClick={() => navigate("/ptstudio/dashboard")}
          />
        )}
      </div>
    </div>
  );
};

export default MobileProfile;
