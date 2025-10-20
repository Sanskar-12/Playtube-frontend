import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { setAllVideosData } from "../../redux/reducers/contentSlice";
import { setChannelData } from "../../redux/reducers/userSlice";

const CreateVideo = () => {
  const { channelData } = useSelector((state) => state.user);
  const { allVideosData } = useSelector((state) => state.content);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handlePublish = async () => {
    if (!video || !thumbnail || !title) {
      toast.error("Video, thumbnail and title are required!");
      return;
    }
    const formData = new FormData();

    setLoading(true);

    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );
    formData.append("channelId", channelData?._id);
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/create/video`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setAllVideosData([...allVideosData, data.newVideo]));
      dispatch(
        setChannelData({
          ...channelData,
          videos: [...(channelData.videos || []), data.newVideo],
        })
      );

      navigate("/");
      toast.success("Video Published Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in Publishing video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-5">
      {/* MAIN */}
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* Video Upload */}
          <label
            htmlFor="video-upload"
            className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-1  hover:border-blue-500 transition"
          >
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleVideoChange}
            />
          </label>

          {/* Title */}
          <input
            type="text"
            placeholder="Title (required)"
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
            onClick={handlePublish}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Publish"}
          </button>
          {loading && (
            <p className="text-center text-gray-300 text-sm animate-pulse">
              Video uploading... please wait...
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateVideo;
