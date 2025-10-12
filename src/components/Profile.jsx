import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUser } from "../redux/reducers/userSlice";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { FiLogOut } from "react-icons/fi";
import { auth, provider } from "../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";

const Profile = () => {
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
      console.log(response);

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
    <div>
      <div className="absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50">
        {user && (
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <img
              src={user?.photoUrl}
              alt="img"
              className="w-12 h-12 flex items-center justify-center rounded-full object-cover border-1 border-gray-700"
            />
            <div>
              <h4 className="font-semibold">{user?.userName}</h4>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <p className="text-sm text-blue-400 cursor-pointer hover:underline">
                {user?.channel ? "View Channel" : "Create Channel"}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col py-2">
          <button
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
            onClick={handleAuthWithGoogle}
          >
            <FcGoogle className="text-xl" />
            SignIn with Google Account
          </button>
          <button
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
            onClick={() => navigate("/signup")}
          >
            <TiUserAddOutline className="text-xl" />
            Create new account
          </button>
          <button
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
            onClick={() => navigate("/signin")}
          >
            <MdOutlineSwitchAccount className="text-xl" /> SignIn with other
            account
          </button>
          {user?.channel && (
            <button
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
              onClick={() => navigate("/ptstudio/dashboard")}
            >
              <SiYoutubestudio className="w-5 h-5 text-orange-400" /> PT Studio
            </button>
          )}

          {user && (
            <button
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
              onClick={handleSignOut}
            >
              <FiLogOut className="text-xl" /> Sign out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
