import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { serverUrl } from "../App";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import { GoVideo } from "react-icons/go";
import VideoCard from "../components/VideoCard";
import { useSelector } from "react-redux";

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

const LikedContent = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [likedShorts, setLikedShorts] = useState([]);
  const [durations, setDurations] = useState({});

  const { allVideosData } = useSelector((state) => state.content);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/liked/videos`,
          {
            withCredentials: true,
          }
        );

        console.log(data);
        setLikedVideos(data.video);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching liked videos");
      }
    };
    const fetchLikedShorts = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/liked/shorts`,
          {
            withCredentials: true,
          }
        );

        console.log(data);
        setLikedShorts(data.shorts);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching liked shorts");
      }
    };
    fetchLikedVideos();
    fetchLikedShorts();
  }, []);

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
      {/* Liked Shorts */}
      {likedShorts.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-red-600" /> Liked Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {likedShorts?.map((short) => (
              <div className="flex-shrink-0" key={short?._id}>
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

      {/* Liked Videos */}
      {likedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="w-7 h-7 text-red-600" /> Liked Videos
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {likedVideos?.map((video) => (
              <div className="flex-shrink-0" key={video?._id}>
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LikedContent;
