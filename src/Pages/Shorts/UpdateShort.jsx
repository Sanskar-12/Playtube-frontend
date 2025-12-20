import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaCloudUploadAlt } from "react-icons/fa";
import { setAllShortsData } from "../../redux/reducers/contentSlice";
import { setChannelData } from "../../redux/reducers/userSlice";

const UpdateShort = () => {
  const { shortId } = useParams();
  const { channelData } = useSelector((state) => state.user);
  const { allShortsData } = useSelector((state) => state.content);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUpdateShort = async () => {
    const formData = new FormData();

    setLoading(true);

    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );

    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/update/short/${shortId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      const updatedShorts = allShortsData.map((v) =>
        v?._id === shortId ? data?.short : v
      );

      dispatch(setAllShortsData(updatedShorts));
      dispatch(
        setChannelData({
          ...channelData,
          shorts: updatedShorts,
        })
      );

      navigate("/");
      toast.success("Short Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in Updating short");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShort = async () => {
    setLoading(true);

    try {
      await axios.delete(
        `${serverUrl}/api/v1/delete/short/${shortId}`,

        {
          withCredentials: true,
        }
      );

      const updatedShorts = allShortsData.filter((v) => v?._id !== shortId);

      dispatch(setAllShortsData(updatedShorts));
      dispatch(
        setChannelData({
          ...channelData,
          shorts: updatedShorts,
        })
      );

      navigate("/");
      toast.success("Short Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in Deleting short");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/short/${shortId}`,
          {
            withCredentials: true,
          }
        );

        setTitle(data?.short?.title);
        setDescription(data?.short?.description || "");
        setTags(data?.short?.tags?.join(", "));
      } catch (error) {
        console.log(error);
        toast.error("Cannot Fetch Current Short");
        navigate("/");
      }
    };
    fetchVideo();
  }, [navigate, shortId]);

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg  flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col space-y-4 w-full">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none h-28"
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <button
              onClick={handleUpdateShort}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Update Short"
              )}
            </button>
            <button
              onClick={handleDeleteShort}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Delete Short"
              )}
            </button>

            {loading && (
              <p className="text-center text-gray-300 text-sm animate-pulse">
                Short updating... please wait...
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateShort;
