import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";
import { useEffect, useState } from "react";

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

const AllVideosPage = () => {
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

  return (
    <div className="flex flex-wrap gap-6 mb-12 sm:items-center sm:justify-center">
      {allVideosData?.map((video) => (
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
  );
};

export default AllVideosPage;
