import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Shorts = () => {
  const { allShortsData } = useSelector((state) => state.content);

  const [shortList, setShortList] = useState([]);
  const videoRefs = useRef([]);

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
          <div className="relative w-[420px] md:w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer">
            <video
              src={short?.shortsUrl}
              data-index={index}
              ref={(el) => (videoRefs.current[index] = el)}
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shorts;
