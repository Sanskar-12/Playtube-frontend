import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import {
  setAllShortsData,
  setAllVideosData,
} from "../redux/reducers/contentSlice";

const useGetAllContentData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/v1/get/all/videos`, {
          withCredentials: true,
        });

        dispatch(setAllVideosData(data.videos));
      } catch (error) {
        console.log(error);
        dispatch(setAllVideosData(null));
      }
    };
    fetchAllVideos();
  }, [dispatch]);

  useEffect(() => {
    const fetchAllShorts = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/v1/get/all/shorts`, {
          withCredentials: true,
        });

        dispatch(setAllShortsData(data.shorts));
      } catch (error) {
        console.log(error);
        dispatch(setAllShortsData(null));
      }
    };
    fetchAllShorts();
  }, [dispatch]);
};

export default useGetAllContentData;
