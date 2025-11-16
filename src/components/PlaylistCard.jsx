import { useState } from "react";
import { FaBookmark, FaListUl, FaTimes } from "react-icons/fa";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../App";

const PlaylistCard = ({ id, title, videos, savedBy }) => {
  const thumbnail = videos[0]?.thumbnail;

  const { user } = useSelector((state) => state.user);

  const [showVideos, setShowVideos] = useState(false);
  const [isSaved, setIsSaved] = useState(
    savedBy?.some((uid) => uid.toString() === user?._id?.toString() || false)
  );

  const handleToggleSave = async () => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/toggle/save/playlist`,
        {
          playlistId: id,
        },
        {
          withCredentials: true,
        }
      );

      setIsSaved(
        data?.playlist?.savedBy?.some(
          (uid) => uid.toString() === user?._id?.toString() || false
        )
      );

      toast.success("Playlist Saved successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in saving the playlist");
    }
  };

  return (
    <>
      <div className="relative w-60 h-40 rounded-xl overflow-hidden group shadow-lg bg-gray-900">
        <img
          src={thumbnail}
          alt="Thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-3">
          <h3 className="font-semibold text-white truncate">{title}</h3>
          <p>{videos?.length} videos</p>
        </div>
        <button
          className={`absolute top-2 right-2 p-2 rounded-full transition border-1 border-gray-700 ${
            isSaved
              ? "bg-white text-black hover:bg-gray-300"
              : "bg-black/70 text-white hover:bg-black"
          }`}
          onClick={() => handleToggleSave()}
        >
          <FaBookmark size={16} />
        </button>
        <button
          className="absolute bottom-2 right-2 p-2 rounded-full transition border-1 border-gray-700"
          onClick={() => setShowVideos(true)}
        >
          <FaListUl size={16} />
        </button>
      </div>

      {showVideos && (
        <div className="fixed inset-0 bg-[#00000032] flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative border border-gray-700">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={() => setShowVideos(false)}
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-2xl font-extrabold mb-3 text-white flex items-center gap-2">
              {title}{" "}
              <span className="text-gray-400 font-normal">- videos</span>
            </h2>
            <div className="h-[2px] bg-orange-600 mb-6 rounded-full"></div>
            <div className="flex items-center justify-around gap-5 flex-wrap">
              {videos.map((video) => (
                <VideoCard
                  key={video?._id}
                  thumbnail={video?.thumbnail}
                  title={video?.title}
                  channelLogo={video?.channel?.avatar}
                  channelName={video?.channel?.name}
                  views={video?.views?.length}
                  id={video?._id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistCard;
