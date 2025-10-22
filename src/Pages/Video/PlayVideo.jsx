import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const videoRef = useRef();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { allVideosData } = useSelector((state) => state.content);

  const onTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += 10;
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime -= 10;
  };

  // Update seek bar as video plays
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  // Seek video when user drags seek bar
  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newTime = e.target.value;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Set duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const min = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hrs}:${min}:${sec}`;
  };

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
        <div
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
        >
          <video
            src={video?.videoUrl}
            className="w-full h-full object-contain"
            controls={false}
            autoPlay
            ref={videoRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          {showControls && (
            <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20">
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={skipBackward}
              >
                <FaBackward size={24} />
              </button>
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={() => onTogglePlay()}
              >
                {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={skipForward}
              >
                <FaForward size={24} />
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            className="w-full accent-orange-600"
            onChange={(e) => handleSeek(e)}
          />
          <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200">
            <div className="flex items-center gap-3">
              <span>
                {formatTime(currentTime)}/{formatTime(duration)}
              </span>
              <button
                className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                onClick={skipBackward}
              >
                <FaBackward size={14} />
              </button>
              <button
                className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                onClick={() => onTogglePlay()}
              >
                {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
              </button>
              <button
                className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                onClick={skipForward}
              >
                <FaForward size={14} />
              </button>
            </div>

            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;
