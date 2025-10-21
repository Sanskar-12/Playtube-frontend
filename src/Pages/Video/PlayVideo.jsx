import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const videoRef = useRef();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);

  const { allVideosData } = useSelector((state) => state.content);

  useEffect(() => {
    if (!allVideosData) {
      return;
    }

    const currentVideo = allVideosData.find((video) => video._id === id);

    if (currentVideo) {
      setVideo(currentVideo);
      setChannel(currentVideo.channel);
    }
  }, [id, allVideosData]);

  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      <div className="flex-1">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
          <video
            src={video?.videoUrl}
            className="w-full h-full object-contain"
            controls={false}
            autoPlay
            ref={videoRef}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;
