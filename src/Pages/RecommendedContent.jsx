import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import VideoCard from "../components/VideoCard";

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

const RecommendedContent = () => {
  const { recommendedContent } = useSelector((state) => state.user);
  const { allVideosData } = useSelector((state) => state.content);

  const [durations, setDurations] = useState({});

  const allVideos = [
    ...(recommendedContent?.recommendedVideos || []),
    ...(recommendedContent?.remainingVideos || []),
  ];

  const allShorts = [
    ...(recommendedContent?.recommendedShorts || []),
    ...(recommendedContent?.remainingShorts || []),
  ];

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
    <div className="px-6 py-4 mb-[20px]">
      {/* Videos Section */}
      {allVideos.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-12">
          {allVideos?.map((video) => (
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
      )}

      {/* Shorts Section */}
      {allShorts?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-1">
            <SiYoutubeshorts className="w-6 h-6 text-red-600" /> Shorts
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {allShorts?.map((short) => (
              <div key={short?._id} className="flex-shrink-0">
                <ShortCard
                  shortUrl={short.shortsUrl}
                  title={short.title}
                  channelName={short.channel?.name}
                  views={short.views}
                  id={short._id}
                  avatar={short.channel?.avatar}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedContent;
