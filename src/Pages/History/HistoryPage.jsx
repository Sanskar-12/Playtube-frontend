import { useSelector } from "react-redux";
import logo from "../../assets/playtube1.png";
import ShortCard from "../../components/ShortCard";
import VideoCard from "../../components/VideoCard";
import { useEffect, useState } from "react";
import { SiYoutubeshorts } from "react-icons/si";

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

const HistoryPage = () => {
  const { allVideosData } = useSelector((state) => state.content);
  const { historyVideo, historyShort } = useSelector((state) => state.user);

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

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]">
      <h1 className="text-3xl font-bold text-white mb-8">Watch History</h1>

      {/* Shorts History */}
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
        <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
        Shorts History
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {historyShort?.length > 0 ? (
          historyShort.map((item) => {
            const short = item.contentId;
            return (
              <div key={item._id} className="flex-shrink-0">
                <ShortCard
                  shortUrl={short.shortsUrl}
                  title={short.title}
                  channelName={short.channel?.name}
                  views={short.views}
                  id={short._id}
                  avatar={short.channel?.avatar}
                />
              </div>
            );
          })
        ) : (
          <p>No shorts watched yet.</p>
        )}
      </div>

      {/* Video History */}
      <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
        <img src={logo} className="w-7 h-7" alt="" />
        Video History
      </h2>
      <div className="flex flex-wrap gap-6 mb-12">
        {historyVideo?.length > 0 ? (
          historyVideo.map((item) => {
            const video = item.contentId;
            return (
              <VideoCard
                key={item._id}
                thumbnail={video.thumbnail}
                duration={durations[video._id] || "0:00"}
                channelLogo={video.channel?.avatar}
                title={video.title}
                channelName={video.channel?.name}
                views={`${video.views}`}
                time={new Date(video.createdAt).toLocaleDateString()}
                id={video._id}
              />
            );
          })
        ) : (
          <p>No videos watched yet.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
