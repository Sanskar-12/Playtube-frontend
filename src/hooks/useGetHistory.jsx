import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setHistoryShort, setHistoryVideo } from "../redux/reducers/userSlice";

const useGetHistory = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/v1/get/history`, {
          withCredentials: true,
        });

        const videos = data?.history?.filter(
          (hist) => hist?.contentType === "Video"
        );
        const shorts = data?.history?.filter(
          (hist) => hist?.contentType === "Shorts"
        );

        dispatch(setHistoryVideo(videos));
        dispatch(setHistoryShort(shorts));
      } catch (error) {
        console.log(error);
        dispatch(setHistoryVideo(null));
        dispatch(setHistoryShort(null));
      }
    };
    fetchHistory();
  }, [dispatch]);
};

export default useGetHistory;
