import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/reducers/userSlice";
import { useNavigate } from "react-router-dom";

const CreatePlaylist = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videosData, setVideosData] = useState([]);
  const [selectedvideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSelectedVideos = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleCreatePlaylist = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/create/playlist`,
        {
          title,
          description,
          channelId: channelData?._id,
          videoIds: selectedvideos,
        },
        {
          withCredentials: true,
        }
      );

      console.log(data);

      dispatch(
        setChannelData({
          ...channelData,
          playlists: [...(channelData.playlists || []), data.playlist],
        })
      );

      navigate("/");
      toast.success("Playlist created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in Creating Playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelData || channelData?.videos) {
      setVideosData(channelData?.videos);
    }
  }, [channelData, videosData]);

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Playlist Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Playlist Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <p className="mb-3 text-lg font-semibold">Select Videos</p>
            {videosData.length < 0 ? (
              <p className="text-sm text-gray-400">
                No Videos found for this channel
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
                {videosData?.map((video) => (
                  <div
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedvideos.includes(video?._id)
                        ? "border-orange-500"
                        : "border-gray-700"
                    }`}
                    onClick={() => toggleSelectedVideos(video?._id)}
                  >
                    <img
                      src={video?.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-28 object-cover"
                    />
                    <p className="p-2 text-sm truncate">{video?.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            disabled={
              !title || !description || selectedvideos.length <= 0 || loading
            }
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            onClick={() => handleCreatePlaylist()}
          >
            {loading ? "Creating Playlist" : "Create Playlist"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePlaylist;
