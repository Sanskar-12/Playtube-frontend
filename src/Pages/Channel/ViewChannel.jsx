import { useSelector } from "react-redux";

const ViewChannel = () => {
  const { channelData } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-3">
      {/* Banner */}
      <div className="w-full h-50 bg-gray-700 mb-10 mt-10 rounded-lg border-1 border-gray-500">
        {channelData?.banner ? (
          <img
            src={channelData?.banner}
            alt="Banner"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900"></div>
        )}
      </div>
    </div>
  );
};

export default ViewChannel;
