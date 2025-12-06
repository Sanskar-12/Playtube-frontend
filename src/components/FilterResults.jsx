import { useSelector } from "react-redux";
import ChannelCard from "./ChannelCard";
import VideoCard from "./VideoCard";
import { useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import ShortCard from "./ShortCard";

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

const FilterResults = ({ filterResults }) => {
  const { allVideosData } = useSelector((state) => state.content);
  const [durations, setDurations] = useState({});

  const isEmpty =
    (!filterResults?.videos || filterResults.videos.length === 0) &&
    (!filterResults?.shorts || filterResults.shorts.length === 0) &&
    (!filterResults?.playlists || filterResults.playlists.length === 0) &&
    (!filterResults?.channels || filterResults.channels.length === 0);

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
    <div className="px-6 py-4 bg-[#00000051] border-1 border-gray-800 mb-[20px]">
      <h2 className="text-2xl font-bold mb-4">Filter Results :</h2>
      {isEmpty ? (
        <p className="text-gray-400 text-lg">No Results found</p>
      ) : (
        <>
          {/* Videos Section */}
          {filterResults?.videos?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Videos</h3>
              <div className="flex flex-wrap gap-6 mb-12">
                {filterResults?.videos?.map((video) => (
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
            </div>
          )}

          {/* Shorts Section */}
          {filterResults?.shorts?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {filterResults?.shorts?.map((short) => (
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
        </>
      )}
    </div>
  );
};

export default FilterResults;
