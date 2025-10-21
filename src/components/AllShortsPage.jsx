import { useSelector } from "react-redux";
import ShortCard from "./ShortCard";
import { SiYoutubeshorts } from "react-icons/si";

const AllShortsPage = () => {
  const { allShortsData } = useSelector((state) => state.content);

  const latestShorts = allShortsData?.slice(0, 10) || [];

  return (
    <div className="px-6 py-4">
      {/* Heading */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-1">
        <SiYoutubeshorts className="w-6 h-6 text-red-600" />
        Shorts
      </h2>
      {/* Horizontal scroll with fixed width cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {latestShorts?.map((short) => (
          <div key={short?._id} className="flex-shrink-0">
            <ShortCard
              key={short?._id}
              id={short?._id}
              title={short?.title}
              channelName={short?.channel?.name}
              avatar={short?.channel?.avatar}
              shortUrl={short?.shortsUrl}
              views={short?.views}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllShortsPage;
