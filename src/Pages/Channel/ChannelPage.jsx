import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import VideoCard from "../../components/VideoCard";
import ShortCard from "../../components/ShortCard";
import PlaylistCard from "../../components/PlaylistCard";

// Helper to get duration
const getVideoDuration = (url) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.onloadedmetadata = () => {
      const totalSeconds = Math.floor(video.duration);
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      const formatted = [
        hrs.toString().padStart(2, "0"),
        mins.toString().padStart(2, "0"),
        secs.toString().padStart(2, "0"),
      ].join(":");

      resolve(formatted);
    };
    video.onerror = () => resolve("00:00:00");
  });
};

const ChannelPage = () => {
  const { id } = useParams();
  const { user, allChannelData } = useSelector((state) => state.user);
  const { allVideosData } = useSelector((state) => state.content);
  const channel = allChannelData.find((channel) => channel?._id === id);

  const [channelData, setChannelData] = useState(channel);
  const [isSubscribed, setIsSubscribed] = useState(
    channelData?.subscribers?.some(
      (sub) =>
        sub?.toString() === user?._id?.toString() ||
        sub?._id?.toString() === user?._id?.toString()
    )
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");
  const [durations, setDurations] = useState({});

  const handleSubscribe = async () => {
    if (!channelData?._id) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/or/remove/subscribers`,
        {
          channelId: channelData?._id,
        },
        {
          withCredentials: true,
        }
      );

      setChannelData((prev) => ({
        ...prev,
        subscribers: data?.updatedChannel?.subscribers || prev.subscribers,
      }));
    } catch (error) {
      toast.error("Error in Subscribing the channel");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsSubscribed(
      channelData?.subscribers?.some(
        (sub) =>
          sub?.toString() === user?._id?.toString() ||
          sub?._id?.toString() === user?._id?.toString()
      )
    );
  }, [channelData?.subscribers, user?._id]);

  useEffect(() => {
    const fetchDurations = async () => {
      if (!allVideosData?.length) return;

      const results = await Promise.all(
        allVideosData.map(async (video) => {
          const duration = await getVideoDuration(video?.videoUrl);
          return { id: video._id, duration };
        })
      );

      const durationMap = results.reduce(
        (acc, { id, duration }) => ({ ...acc, [id]: duration }),
        {}
      );
      setDurations(durationMap);
    };

    fetchDurations();
  }, [allVideosData]);

  return (
    <div className="text-white min-h-screen pt-[10px]">
      {/* Banner */}
      <div className="relative">
        <img
          src={channelData?.banner}
          alt="Banner"
          className="w-full h-60 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Channel Info */}
      <div className="relative flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl flex-wrap">
        <div>
          <img
            src={channelData?.avatar}
            alt="Avatar"
            className="rounded-full w-28 h-28 border-4 border-gray-800 shadow-lg hover:scale-105 hover:ring-4 hover: ring-orange-600 transition-transform duration-300"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-wide">
            {channelData?.name}
          </h1>
          <p className="text-gray-400 mt-1">
            <span className="font-semibold text-white">
              {channelData?.subscribers?.length}{" "}
            </span>{" "}
            Subscribers.{" "}
            <span className="font-semibold text-white">
              {channelData?.videos?.length}
            </span>{" "}
            Videos
          </p>
          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
            {channelData?.category}
          </p>
        </div>
        <button
          className={`px-[20px] py-[8px] rounded-4xl border border-gray-600 ml-[20px] text-md ${
            isSubscribed
              ? "bg-black text-white hover:bg-orange-600 hover:text-black"
              : "bg-white text-black hover:bg-orange-600 hover:text-black"
          }`}
          onClick={handleSubscribe}
        >
          {loading ? (
            <ClipLoader size={20} color="gray" />
          ) : isSubscribed ? (
            "Subscribed"
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {/* Tab */}
      <div className="flex gap-8 px-6 border-b border-gray-800 mb-6 relative">
        {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
          <button
            key={tab}
            className={`pb-3 relative font-medium transition ${
              activeTab === tab
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}{" "}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
      <div className="px-6 space-y-8">
        {activeTab === "Videos" && (
          <div className="flex flex-wrap gap-5 pb-[40px]">
            {channelData?.videos?.map((video) => (
              <VideoCard
                key={video?._id}
                thumbnail={video?.thumbnail}
                title={video?.title}
                channelLogo={channelData?.avatar}
                channelName={channelData?.name}
                views={video?.views?.length}
                id={video?._id}
                duration={durations[video._id] || "00:00:00"}
              />
            ))}
          </div>
        )}

        {activeTab === "Shorts" && (
          <div className="flex flex-wrap gap-5 pb-[40px]">
            {channelData?.shorts?.map((short) => (
              <ShortCard
                key={short?._id}
                id={short?._id}
                title={short?.title}
                channelName={channelData?.name}
                avatar={channelData?.avatar}
                shortUrl={short?.shortsUrl}
                views={short?.views}
              />
            ))}
          </div>
        )}

        {activeTab === "Playlists" && (
          <div className="flex flex-wrap gap-5 pb-[40px]">
            {channelData?.playlists?.map((playlist) => (
              <PlaylistCard
                key={playlist?._id}
                id={playlist?._id}
                title={playlist?.title}
                videos={playlist?.videos}
                savedBy={playlist?.savedBy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
