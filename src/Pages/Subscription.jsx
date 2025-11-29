import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import { GoVideo } from "react-icons/go";
import VideoCard from "../components/VideoCard";
import { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import PlaylistCard from "../components/PlaylistCard";
import PostCard from "../components/PostCard";
import { RiUserCommunityFill } from "react-icons/ri";

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

const Subscription = () => {
  const {
    subscribedChannels,
    subscribedVideos,
    subscribedShorts,
    subscribedPlaylists,
    subscribedPosts,
  } = useSelector((state) => state.user);

  console.log(subscribedPlaylists);

  const navigate = useNavigate();
  const { allVideosData } = useSelector((state) => state.content);

  const [durations, setDurations] = useState({});

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

      {/* Shorts Section */}
      {subscribedShorts?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
            Subscribed Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {subscribedShorts?.map((short) => (
              <div key={short?._id} className="flex-shrink-0">
                <ShortCard
                  shortUrl={short?.shortsUrl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  views={short?.views}
                  id={short?._id}
                  avatar={short?.channel?.avatar}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {subscribedVideos?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="w-7 h-7 text-red-600" />
            Subscribed Videos
          </h2>
          <div className="flex flex-wrap gap-4">
            {subscribedVideos?.map((video) => (
              <VideoCard
                key={video?._id}
                thumbnail={video?.thumbnail}
                title={video?.title}
                channelLogo={video?.channel?.avatar}
                channelName={video?.channel?.name}
                views={video?.views?.length}
                id={video?._id}
                duration={durations[video._id] || "00:00:00"}
              />
            ))}
          </div>
        </>
      )}

      {subscribedPlaylists?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <FaList className="w-7 h-7 text-red-600" />
            Saved Playlist
          </h2>
          <div className="flex flex-wrap gap-6">
            {subscribedPlaylists?.map((pl) => (
              <PlaylistCard
                key={pl?._id}
                id={pl?._id}
                title={pl?.title}
                videos={pl?.videos}
                savedBy={pl?.savedBy}
              />
            ))}
          </div>
        </>
      )}

      {subscribedPosts?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <RiUserCommunityFill className="w-7 h-7 text-red-600" />
            Subscribed Posts
          </h2>
          <div className="flex flex-wrap gap-6">
            {subscribedPosts?.map((post) => (
              <PostCard key={post?._id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Subscription;
