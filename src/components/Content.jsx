import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const { channelData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Videos");

  return (
    <div className="text-white min-h-screen pt-5 px-4 sm:px-6 mb-16">
      <div className="flex flex-wrap gap-6 border-b border-gray-800 mb-6">
        {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
          <button
            key={tab}
            className={`pb-3 relative font-medium transition ${
              activeTab === tab
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}{" "}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
      <div className="space-y-8">
        {activeTab === "Videos" && (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Thumbnail</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Views</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.videos?.map((v) => (
                    <tr
                      key={v?._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="p-3">
                        <img
                          src={v?.thumbnail}
                          alt="Thumbnail"
                          className="w-20 h-1/2 rounded object-cover"
                        />
                      </td>
                      <td className="text-start p-3">{v?.title}</td>
                      <td className="text-start p-3">
                        {v?.views?.length || "0"}
                      </td>
                      <td className="p-3">
                        <FaEdit
                          className="cursor-pointer hover:text-orange-400"
                          onClick={() =>
                            navigate(`/ptstudio/managevideo/${v?._id}`)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {channelData?.videos?.map((v) => (
                <div
                  key={v?._id}
                  className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <img
                    src={v?.thumbnail}
                    alt={v?.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h3 className="text-base font-semibold">{v?.title}</h3>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
                    <span>{v?.views?.length || "0"} Views</span>
                    <FaEdit
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() =>
                        navigate(`/ptstudio/managevideo/${v?._id}`)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
