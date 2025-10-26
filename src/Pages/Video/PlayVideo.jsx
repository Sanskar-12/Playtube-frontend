import { useEffect, useRef, useState } from "react";
import {
  FaBackward,
  FaBookmark,
  FaDownload,
  FaExpand,
  FaForward,
  FaPause,
  FaPlay,
  FaThumbsDown,
  FaThumbsUp,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ShortCard from "../../components/ShortCard";
import { ClipLoader } from "react-spinners";
import IconButton from "../../components/IconButton";
import Description from "../../components/Description";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/reducers/userSlice";
import { setAllVideosData } from "../../redux/reducers/contentSlice";

const PlayVideo = () => {
  const { allVideosData, allShortsData } = useSelector(
    (state) => state.content
  );
  const { user, channelData } = useSelector((state) => state.user);

  const videoRef = useRef();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [vol, setVol] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(
    channel?.subscribers?.some(
      (sub) =>
        sub?.toString() === user?._id?.toString() ||
        sub?._id?.toString() === user?._id?.toString()
    )
  );
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const suggestedVideo =
    allVideosData?.filter((video) => video._id !== id).slice(0, 10) || [];
  const suggestedShorts = allShortsData?.slice(0, 10) || [];

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

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVol(vol);
    if (vol === 0) {
      setIsMuted(true);
    }
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleFullScreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = video.videoUrl;
    link.download = "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubscribe = async () => {
    if (!channel?._id) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/or/remove/subscribers`,
        {
          channelId: channel?._id,
        },
        {
          withCredentials: true,
        }
      );

      setChannel((prev) => ({
        ...prev,
        subscribers: data?.updatedChannel?.subscribers || prev.subscribers,
      }));

      dispatch(
        setChannelData({
          ...channelData,
          subscribers: data?.updatedChannel?.subscribers,
        })
      );
    } catch (error) {
      toast.error("Error in Subscribing the channel");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/toggle/likes`,
        {
          videoId: video?._id,
        },
        {
          withCredentials: true,
        }
      );

      setVideo((prev) => ({
        ...prev,
        likes: data?.video?.likes,
        dislikes: data?.video?.dislikes,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/toggle/dislikes`,
        {
          videoId: video?._id,
        },
        {
          withCredentials: true,
        }
      );

      setVideo((prev) => ({
        ...prev,
        likes: data?.video?.likes,
        dislikes: data?.video?.dislikes,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/toggle/save`,
        {
          videoId: video?._id,
        },
        {
          withCredentials: true,
        }
      );

      setVideo((prev) => ({
        ...prev,
        savedBy: data?.video?.savedBy,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (!newComment) return;
    setCommentLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/comment`,
        {
          videoId: video?._id,
          message: newComment,
        },
        {
          withCredentials: true,
        }
      );

      setComments(data?.video?.comments);
      setNewComment("");
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };

  console.log(comments);

  const handleReply = async ({ commentId, replyText }) => {
    if (!replyText) return;
    setReplyLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/reply`,
        {
          videoId: video?._id,
          commentId,
          message: newComment,
        },
        {
          withCredentials: true,
        }
      );

      setComments(data?.video?.comments);
    } catch (error) {
      console.log(error);
    } finally {
      setReplyLoading(false);
    }
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
    setIsSubscribed(
      channel?.subscribers?.some(
        (sub) =>
          sub?.toString() === user?._id?.toString() ||
          sub?._id?.toString() === user?._id?.toString()
      )
    );
  }, [channel?.subscribers, user?._id]);

  useEffect(() => {
    if (!id || !Array.isArray(allVideosData)) return;

    const currentVideo = allVideosData.find((vid) => vid._id === id);

    if (currentVideo) {
      setVideo(currentVideo);
      setChannel(currentVideo.channel);
      setComments(currentVideo?.comments);
    }

    const addViews = async () => {
      try {
        const { data } = await axios.put(
          `${serverUrl}/api/v1/add/views`,
          { videoId: video?._id },
          { withCredentials: true }
        );

        setVideo((prev) =>
          prev ? { ...prev, views: data?.video?.views } : prev
        );

        dispatch(
          setAllVideosData(
            allVideosData.map((v) =>
              v._id === id ? { ...v, views: data?.video?.views } : v
            )
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

    addViews();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, video?._id]);

  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      {/* Left Side */}
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

              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={handleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  value={isMuted ? 0 : vol}
                  onChange={handleVolume}
                  className="accent-orange-600 w-16 sm:w-24"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <button onClick={handleFullScreen}>
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* More Options */}
        <h1 className="mt-4 text-lg sm:text-xl font-bold text-white flex">
          {video?.title}
        </h1>
        <p className="text-sm text-gray-400">
          {" "}
          {Number(video?.views?.length) >= 1_000_000
            ? Math.floor(Number(video?.views?.length) / 1_000_000) + "M"
            : Number(video?.views?.length) >= 1_000
            ? Math.floor(Number(video?.views?.length) / 1_000) + "K"
            : Number(video?.views?.length) || 0}{" "}
          views
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between">
          {/* Left Div */}
          <div className="flex items-center justify-start gap-4">
            <img
              src={channel?.avatar}
              alt="Channel Avatar"
              className="w-12 h-12 rounded-full border-2 border-gray-600"
            />
            <div>
              <h1 className="text-md font-bold">{channel?.name}</h1>
              <h3 className="text-[13px]">
                {channel?.subscribers?.length} Subscribers
              </h3>
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
          {/* Right Div */}
          <div className="flex items-center gap-6 mt-3">
            <IconButton
              icon={FaThumbsUp}
              label={"Likes"}
              active={video?.likes?.includes(user?._id)}
              count={video?.likes?.length}
              onClick={handleLike}
            />
            <IconButton
              icon={FaThumbsDown}
              label={"Dislikes"}
              active={video?.dislikes?.includes(user?._id)}
              count={video?.dislikes?.length}
              onClick={handleDislike}
            />
            <IconButton
              icon={FaDownload}
              label={"Download"}
              onClick={handleDownload}
            />
            <IconButton
              icon={FaBookmark}
              label={"Save"}
              active={video?.savedBy?.includes(user?._id)}
              onClick={handleSave}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg">
          <h2 className="text-md font-semibold mb-2">Description</h2>
          <Description text={video?.description} />
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-600"
              placeholder="Add a Comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              onClick={handleComment}
            >
              {commentLoading ? <ClipLoader size={20} color="black" /> : "Post"}
            </button>
          </div>
          <div className="space-y-3">
            {comments?.map((comment) => (
              <div
                key={comment?._id}
                className="p-3 bg-[#1a1a1a] rounded-lg shadow-sm text-sm"
              >
                <div className="flex items-center justify-start gap-1">
                  <img
                    src={comment?.author?.photoUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <h2 className="text-[13px]">{comment?.author?.userName}</h2>
                </div>
                <p className="font-medium px-[20px] py-[20px]">
                  {comment?.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-[380px] px-4 py-4 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto">
        {suggestedShorts?.length && (
          <h2 className="flex items-center gap-2 font-bold text-lg mb-3">
            <SiYoutubeshorts className="text-orange-600" />
            Shorts
          </h2>
        )}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
          {suggestedShorts.map((short) => (
            <div key={short?._id}>
              <ShortCard
                id={short?._id}
                shortUrl={short?.shortsUrl}
                avatar={short?.channel?.avatar}
                channelName={short?.channel?.name}
                title={short?.title}
                views={short?.views}
                key={short?._id}
              />
            </div>
          ))}
        </div>

        <div className="font-bold text-lg mt-4 mb-3">Up Next</div>
        <div className="space-y-3">
          {suggestedVideo?.map((video) => (
            <div
              key={video?._id}
              className="flex gap-2 sm:gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition"
              onClick={() => navigate(`/watch-video/${video?._id}`)}
            >
              <img
                src={video?.thumbnail}
                alt="Thumbnail"
                className="w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold line-clamp-2 text-sm sm:text-base text-white">
                  {video?.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {video?.channel?.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {video?.views}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;
