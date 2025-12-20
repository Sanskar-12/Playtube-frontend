import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/reducers/userSlice";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePlaylist = () => {
  const { playlistId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videosData, setVideosData] = useState([]);
  const [selectedvideos, setSelectedVideos] = useState([]);
  const [playlist, setPlaylist] = useState(null);
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

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const currentVideos = playlist?.videos?.map((v) => v?._id?.toString());
      const newVideos = selectedvideos?.map((v) => v?.toString());

      const addVideos = newVideos.filter((id) => !currentVideos.includes(id));
      const removeVideos = currentVideos?.filter(
        (id) => !newVideos.includes(id)
      );

      const { data } = await axios.put(
        `${serverUrl}/api/v1/update/playlist/${playlistId}`,
        {
          title,
          description,
          addVideos,
          removeVideos,
        },
        {
          withCredentials: true,
        }
      );

      const updatedPlaylists = channelData?.playlists?.map((p) =>
        p?._id === playlistId ? data?.playlist : p
      );
      dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));

      toast.success("Playlist Updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverUrl}/api/v1/delete/playlist/${playlistId}`, {
        withCredentials: true,
      });

      const updatedPlaylists = channelData?.playlists.filter(
        (p) => p?._id !== playlistId
      );

      dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));

      toast.success("Playlist deleted successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/playlist/${playlistId}`,
          {
            withCredentials: true,
          }
        );

        setPlaylist(data?.playlist);
        setTitle(data?.playlist?.title);
        setDescription(data?.playlist?.description);
        setSelectedVideos(data?.playlist?.videos?.map((v) => v?._id));
      } catch (error) {
        console.log(error);
        toast.error("Cannot Fetch Current Playlist");
        navigate("/");
      }
    };
    fetchPlaylist();
  }, [playlistId, navigate]);

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
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            onClick={handleUpdate}
          >
            {loading ? "Updating Playlist" : "Update Playlist"}
          </button>

          <button
            disabled={
              !title || !description || selectedvideos.length <= 0 || loading
            }
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            onClick={handleDelete}
          >
            {loading ? "Deleting Playlist" : "Delete Playlist"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default UpdatePlaylist;
