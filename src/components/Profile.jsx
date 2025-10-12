import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
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
            // onClick={googleSignIn}
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
