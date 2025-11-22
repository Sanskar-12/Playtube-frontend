import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { serverUrl } from "../../App";
import { FaList } from "react-icons/fa";
import PlaylistCard from "../../components/PlaylistCard";

const SavedPlaylist = () => {
  const [savedPlaylist, setSavedPlaylist] = useState([]);

  useEffect(() => {
    const fetchSavedPlaylist = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/saved/playlist`,
          {
            withCredentials: true,
          }
        );

        console.log(data);
        setSavedPlaylist(data?.playlists);
      } catch (error) {
        console.log(error);
        toast.error("Error in fetching saved Playlist");
      }
    };
    fetchSavedPlaylist();
  }, []);

  return savedPlaylist.length === 0 ? (
    <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
      No Saved Playlist
    </div>
  ) : (
    <div className="p-6 min-h-screen bg-black text-white mt-[40px] lg:mt-[20px]">
      <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
        <FaList className="w-7 h-7 text-red-600" /> Saved Playlist
      </h2>
      <div className="flex flex-wrap gap-4">
        {savedPlaylist?.map((pl) => (
          <PlaylistCard
            key={pl?._id}
            id={pl?._id}
            title={pl?.title}
            videos={pl?.videos}
            savedBy={pl?.savedBy}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedPlaylist;
