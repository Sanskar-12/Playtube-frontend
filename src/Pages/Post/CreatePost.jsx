import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaImage } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/reducers/userSlice";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { channelData } = useSelector((state) => state.user);

  const handleCreatePost = async () => {
    const formData = new FormData();

    formData.append("channelId", channelData?._id);
    formData.append("content", content);
    formData.append("image", image);

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/create/post`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(
        setChannelData({
          ...channelData,
          communityPosts: [...(channelData.communityPosts || []), data.post],
        })
      );

      navigate("/");
      toast.success("Community Post created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in creating Post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5 items-center justify-center">
      <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-4">
        <textarea
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none h-20"
          placeholder="Write something for your community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label
          htmlFor="image"
          className="flex items-center space-x-3 cursor-pointer"
        >
          <FaImage className="text-2xl text-gray-300" />
          <span className="text-gray-300">Add Image (optional)</span>
          <input
            type="file"
            className="hidden"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {image && (
          <div className="mt-3">
            <img
              src={URL.createObjectURL(image)}
              alt="Image"
              className="rounded-lg max-h-64 object-cover"
            />
          </div>
        )}

        <button
          disabled={!content}
          className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
          onClick={handleCreatePost}
        >
          {loading ? "Creating Post" : "Create Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
