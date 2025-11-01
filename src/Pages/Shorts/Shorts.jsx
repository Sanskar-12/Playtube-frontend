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
import { useSelector } from "react-redux";
import Description from "../../components/Description";
import IconButton from "../../components/IconButton";

const Shorts = () => {
  const { allShortsData } = useSelector((state) => state.content);
  const { user } = useSelector((state) => state.user);

  const [shortList, setShortList] = useState([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [openComment, setOpenComment] = useState(null);
  const videoRefs = useRef([]);

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

    const shuffled = [...allShortsData].sort(() => Math.random() - 0.5);
    setShortList(shuffled);
  }, [allShortsData]);

  return (
    <div className="h-[100vh] w-full overflow-y-scroll snap-y snap-mandatory">
      {shortList.map((short, index) => (
        <div
          key={index}
          className="min-h-screen w-full flex md:items-center items-start justify-center snap-start relative pt-[40px] md:pt-[0px]"
        >
          <div
            className="relative w-[420px] md:w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer"
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

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-2">
              <div className="flex items-center justify-start gap-2">
                <img
                  src={short?.channel?.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-1 border-gray-700"
                />
                <span className="text-sm text-gray-300">
                  @{short?.channel?.name.toLowerCase()}
                </span>
                <button className="bg-white text-black text-xs px-[20px] py-[10px] rounded-full cursor-pointer">
                  Subscribe
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

              <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 text-white">
                <IconButton
                  icon={FaThumbsUp}
                  label={"Likes"}
                  active={short?.likes?.includes(user?._id)}
                  count={short?.likes?.length}
                  // onClick={handleLike}
                />
                <IconButton
                  icon={FaThumbsDown}
                  label={"Dislikes"}
                  active={short?.dislikes?.includes(user?._id)}
                  count={short?.dislikes?.length}
                  // onClick={handleDislike}
                />
                <IconButton
                  icon={FaComment}
                  label={"Comment"}
                  onClick={() => handleOpenComment(short?._id)}
                />
                <IconButton
                  icon={FaDownload}
                  label={"Download"}
                  // onClick={handleDownload}
                />
                <IconButton
                  icon={FaBookmark}
                  label={"Save"}
                  active={short?.savedBy?.includes(user?._id)}
                  // onClick={handleSave}
                />
              </div>
            </div>
            {openComment === short?._id && (
              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comments</h3>
                  <button>
                    <FaArrowDown size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shorts;
