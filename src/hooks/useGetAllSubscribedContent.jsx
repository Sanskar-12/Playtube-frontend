import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import {
  setSubscribedChannels,
  setSubscribedPlaylists,
  setSubscribedPosts,
  setSubscribedShorts,
  setSubscribedVideos,
} from "../redux/reducers/userSlice";

const useGetAllSubscribedContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSubscribedData = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/all/subscribed/data`,
          {
            withCredentials: true,
          }
        );

        dispatch(setSubscribedChannels(data?.subscribedChannels));
        dispatch(setSubscribedVideos(data?.videos));
        dispatch(setSubscribedShorts(data?.shorts));
        dispatch(setSubscribedPlaylists(data?.playlists));
        dispatch(setSubscribedPosts(data?.communityPosts));
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubscribedData();
  }, [dispatch]);
};

export default useGetAllSubscribedContent;
