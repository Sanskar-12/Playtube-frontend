import { useEffect, useRef, useState } from "react";
import {
  FaArrowDown,
  FaBookmark,
  FaComment,
  FaDownload,
  FaPause,
  FaPlay,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Description from "../../components/Description";
import IconButton from "../../components/IconButton";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { setChannelData } from "../../redux/reducers/userSlice";
import { setAllShortsData } from "../../redux/reducers/contentSlice";
import ReplySection from "../../components/ReplySection";
import { useNavigate, useParams } from "react-router-dom";

const WatchShorts = () => {
  const { allShortsData } = useSelector((state) => state.content);
  const { user, channelData } = useSelector((state) => state.user);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shortList, setShortList] = useState([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [openComment, setOpenComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [newComments, setNewComments] = useState("");
  const [comments, setComments] = useState([]);
  const videoRefs = useRef([]);
  const selectedShort = allShortsData?.find((s) => s._id === id);

  const togglePlay = (index) => {
    const short = videoRefs.current[index];
    if (short.paused) {
      setPlayIndex(null);
      short.play();
    } else {
      setPlayIndex(index);
      short.pause();
    }
  };

  const handleOpenComment = (shortId) => {
    if (openComment === shortId) {
      setOpenComment(null);
    } else {
      setOpenComment(shortId);
    }
  };

  const handleSubscribe = async (e, channelId) => {
    if (!channelId) return;
    e.stopPropagation();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/or/remove/subscribers`,
        {
          channelId,
        },
        {
          withCredentials: true,
        }
      );

      setShortList((prev) =>
        prev.map((short) =>
          short?.channel?._id === channelId
            ? {
                ...short,
                channel: data?.updatedChannel,
              }
            : short
        )
      );

      dispatch(
        setChannelData({
          ...channelData,
          subscribers: data?.updatedChannel?.subscribers,
        })
      );
    } catch (error) {
      console.log(error);
      toast.error("Error in Subscribing the channel");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (shortId) => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/toggle/short/likes`,
        {
          shortId,
        },
        {
          withCredentials: true,
        }
      );

      setShortList((prev) =>
        prev.map((short) =>
          short?._id === shortId
            ? {
                ...short,
                dislikes: data?.short?.dislikes,
                likes: data?.short?.likes,
              }
            : short
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async (shortId) => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/toggle/short/dislikes`,
        {
          shortId,
        },
        {
          withCredentials: true,
        }
      );

      setShortList((prev) =>
        prev.map((short) =>
          short?._id === shortId
            ? {
                ...short,
                dislikes: data?.short?.dislikes,
                likes: data?.short?.likes,
              }
            : short
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = (short) => {
    const link = document.createElement("a");
    link.href = short.shortsUrl;
    link.download = "shorts.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = async (shortId) => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/add/short/views`,
        {
          shortId,
        },
        {
          withCredentials: true,
        }
      );

      setShortList((prev) =>
        prev.map((short) =>
          short?._id === shortId
            ? {
                ...short,
                views: data?.short?.views,
              }
            : short
        )
      );

      setAllShortsData(
        allShortsData.map((short) =>
          short?._id === shortId
            ? {
                ...short,
                views: data?.short?.views,
              }
            : short
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (shortId) => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/v1/toggle/short/save`,
        {
          shortId,
        },
        {
          withCredentials: true,
        }
      );

      setShortList((prev) =>
        prev.map((short) =>
          short?._id === shortId
            ? {
                ...short,
                savedBy: data?.short?.savedBy,
              }
            : short
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (shortId) => {
    if (!newComments) return;
    setCommentLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/short/comment`,
        {
          shortId,
          message: newComments,
        },
        {
          withCredentials: true,
        }
      );

      setComments(data?.short?.comments);
      setShortList((prev) =>
        prev.map((short) =>
          short?._id === shortId
            ? {
                ...short,
                comments: data?.short?.comments,
              }
            : short
        )
      );
      setNewComments("");
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async ({ shortId, commentId, replyText }) => {
    if (!replyText) return;
    setReplyLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/add/short/reply`,
        {
          shortId,
          commentId,
          message: replyText,
        },
        {
          withCredentials: true,
        }
      );

      setComments(data?.short?.comments);
      setShortList((prev) =>
        prev.map((short) =>
          short?._id === shortId
            ? {
                ...short,
                comments: data?.short?.comments,
              }
            : short
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setReplyLoading(false);
    }
  };

  // logic to play only the current video and pause others
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = entry.target.dataset.index;

          const short = videoRefs.current[index];

          if (entry.isIntersecting) {
            // play current video
            short.play();
            short.muted = false;

            const currentShort = shortList[index];
            handleView(currentShort?._id);

            setComments(currentShort?.comments);
          } else {
            // pause other videos
            short.pause();
            short.muted = true;
            short.currentTime = 0;
          }
        });
      },
      { threshold: 0.75 } // video plays when 75% visible
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));

    return () => observer.disconnect();
  }, [shortList]);

  useEffect(() => {
    if (!allShortsData || allShortsData.length === 0) return;

    if (selectedShort) {
      const selected = allShortsData.find(
        (short) => short._id === selectedShort._id
      );

      const remaining = allShortsData.filter(
        (short) => short._id !== selectedShort._id
      );

      if (selected) {
        setShortList([selected, ...remaining]);
        // setActiveIndex(0);
      } else {
        setShortList(allShortsData);
      }
    } else {
      setShortList(allShortsData);
    }
  }, [selectedShort, allShortsData]);

  return (
    <div className="h-[100vh] w-full overflow-y-scroll snap-y snap-mandatory">
      {shortList.map((short, index) => (
        <div
          key={index}
          className="min-h-screen w-full flex md:items-center items-start  justify-center snap-start relative pt-[40px] md:pt-[0px]"
        >
          <div
            className="relative w-[420px] md:w-[350px] aspect-[9/16] bg-black rounded-2xl mt-[50px] md:mt-[0px] overflow-hidden shadow-xl border border-gray-700 cursor-pointer"
            onClick={() => togglePlay(index)}
          >
            <video
              src={short?.shortsUrl}
              data-index={index}
              ref={(el) => (videoRefs.current[index] = el)}
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {playIndex === index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPlay className="text-white text-lg" />
              </div>
            )}
            {playIndex !== index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPause className="text-white text-lg" />
              </div>
            )}

            <div
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-start gap-2">
                <img
                  src={short?.channel?.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-1 border-gray-700"
                  onClick={() => navigate(`/channel/${short?.channel?._id}`)}
                />
                <span
                  className="text-sm text-gray-300"
                  onClick={() => navigate(`/channel/${short?.channel?._id}`)}
                >
                  @{short?.channel?.name.toLowerCase()}
                </span>
                <button
                  className={`${
                    short?.channel?.subscribers?.includes(user?._id)
                      ? "bg-[#000000a1] text-white border-1 border-gray-700"
                      : "bg-white text-black"
                  }  text-xs px-[20px] py-[10px] rounded-full cursor-pointer`}
                  disabled={loading}
                  onClick={(e) => handleSubscribe(e, short?.channel?._id)}
                >
                  {loading ? (
                    <ClipLoader size={20} color="gray" />
                  ) : short?.channel?.subscribers?.some(
                      (sub) =>
                        sub?.toString() === user?._id?.toString() ||
                        sub?._id?.toString() === user?._id?.toString()
                    ) ? (
                    "Subscribed"
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
              <div className="flex items-center justify-start">
                <h3 className="font-bold text-lg line-clamp-2">
                  {short?.title}
                </h3>
              </div>
              <div>
                {short?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <Description text={short?.description} />
              </div>

              <div
                className="absolute right-3 bottom-28 flex flex-col items-center gap-5 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <IconButton
                  icon={FaThumbsUp}
                  label={"Likes"}
                  active={short?.likes?.includes(user?._id)}
                  count={short?.likes?.length}
                  onClick={() => handleLike(short?._id)}
                />
                <IconButton
                  icon={FaThumbsDown}
                  label={"Dislikes"}
                  active={short?.dislikes?.includes(user?._id)}
                  count={short?.dislikes?.length}
                  onClick={() => handleDislike(short?._id)}
                />
                <IconButton
                  icon={FaComment}
                  label={"Comment"}
                  onClick={() => handleOpenComment(short?._id)}
                />
                <IconButton
                  icon={FaDownload}
                  label={"Download"}
                  onClick={() => handleDownload(short)}
                />
                <IconButton
                  icon={FaBookmark}
                  label={"Save"}
                  active={short?.savedBy?.includes(user?._id)}
                  onClick={() => handleSave(short?._id)}
                />
              </div>
            </div>
            {openComment === short?._id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comments</h3>
                  <button>
                    <FaArrowDown
                      size={20}
                      onClick={() => setOpenComment(false)}
                    />
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-gray-900 text-white p-2 rounded"
                    placeholder="Add a comment..."
                    value={newComments}
                    onChange={(e) => setNewComments(e.target.value)}
                  />
                  <button
                    className="bg-black px-4 py-2 border-1 border-gray-700 rounded-xl"
                    onClick={() => handleComment(short?._id)}
                  >
                    {commentLoading ? (
                      <ClipLoader size={20} color="white" />
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
                <div className="space-y-3 mt-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => {
                      return (
                        <div
                          key={comment?._id}
                          className="bg-gray-800/40 p-2 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <img
                              src={comment?.author?.photoUrl}
                              alt="avatar"
                              className="w-6 h-6 rounded-full"
                            />
                            <h3 className="text-sm font-semibold">
                              {comment?.author?.userName}
                            </h3>
                          </div>
                          <p className="text-sm ml-8">{comment.message}</p>
                          <div>
                            {comment?.replies?.map((reply) => (
                              <div
                                key={reply?._id}
                                className="p-2 bg-[#2a2a2a] rounded"
                              >
                                <div className="flex items-center justify-start gap-1">
                                  <img
                                    src={reply?.author?.photoUrl}
                                    alt="avatar"
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <h2 className="text-[13px]">
                                    @{reply?.author?.userName.toLowerCase()}
                                  </h2>
                                  <p className="px-[20px] py-[20px]">
                                    {reply?.message}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <ReplySection
                            shortId={short?._id}
                            loading={replyLoading}
                            comment={comment}
                            handleReply={handleReply}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400">No comments yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WatchShorts;
