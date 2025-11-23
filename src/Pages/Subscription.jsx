import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const {
    subscribedChannels,
    subscribedVideos,
    subscribedShorts,
    subscribedPlaylists,
    subscribedPosts,
  } = useSelector((state) => state.user);

  console.log(subscribedChannels);

  const navigate = useNavigate();

  return subscribedChannels?.length === 0 ? (
    <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
      No Subscribed Content
    </div>
  ) : (
    <div className="px-6 py-4 min-h-screen">
      {/* Subscribed Channels */}
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide pt-[30px]">
        {subscribedChannels?.map((ch) => (
          <div
            key={ch?._id}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => navigate(`/channel/${ch._id}`)}
          >
            <img
              src={ch?.avatar}
              alt="Avatar"
              className="w-18 h-18 rounded-full border-2 border-gray-600 object-cover shadow-md"
            />
            <span className="mt-2 text-sm text-gray-300 font-medium text-center truncate w-20">
              {ch?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
