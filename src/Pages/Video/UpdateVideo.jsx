import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { setAllVideosData } from "../../redux/reducers/contentSlice";
import { setChannelData } from "../../redux/reducers/userSlice";

const UpdateVideo = () => {
  const { videoId } = useParams();

  const { channelData } = useSelector((state) => state.user);
  const { allVideosData } = useSelector((state) => state.content);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleUpdateVideo = async () => {
    const formData = new FormData();

    setLoading(true);

    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );
    formData.append("thumbnail", thumbnail);

    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/update/video/${video?._id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      const updatedVideos = allVideosData.map((v) =>
        v?._id === videoId ? data?.video : v
      );

      dispatch(setAllVideosData(updatedVideos));
      dispatch(
        setChannelData({
          ...channelData,
          videos: updatedVideos,
        })
      );

      navigate("/");
      toast.success("Video Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in Updating video");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async () => {
    setLoading(true);

    try {
      await axios.delete(
        `${serverUrl}/api/v1/delete/video/${video?._id}`,

        {
          withCredentials: true,
        }
      );

      const updatedVideos = allVideosData.filter((v) => v?._id !== videoId);

      dispatch(setAllVideosData(updatedVideos));
      dispatch(
        setChannelData({
          ...channelData,
          videos: updatedVideos,
        })
      );

      navigate("/");
      toast.success("Video Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in Deleting video");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/video/${videoId}`,
          {
            withCredentials: true,
          }
        );

        setVideo(data?.video);
        setTitle(data?.video?.title);
        setDescription(data?.video?.description || "");
        setTags(data?.video?.tags?.join(", "));
      } catch (error) {
        console.log(error);
        toast.error("Cannot Fetch Current Video");
        navigate("/");
      }
    };
    fetchVideo();
  }, [navigate, videoId]);

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-5">
      {/* MAIN */}
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Thumbnail Upload */}
          <label htmlFor="thumbnail-upload" className="block cursor-pointer">
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="thumbnail"
                className="w-full rounded-lg border border-gray-700 mb-2"
              />
            ) : (
              <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 mb-2">
                Click to upload thumbnail
              </div>
            )}
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </label>

          {/* Publish Button */}
          <button
            onClick={handleUpdateVideo}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Update Video"}
          </button>
          <button
            onClick={handleDeleteVideo}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Delete Video"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default UpdateVideo;
