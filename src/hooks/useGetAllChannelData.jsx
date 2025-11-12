import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setAllChannelData } from "../redux/reducers/userSlice";

const useGetAllChannelData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/all/channels`,
          {
            withCredentials: true,
          }
        );

        dispatch(setAllChannelData(data.channels));
      } catch (error) {
        console.log(error);
        dispatch(setAllChannelData(null));
      }
    };
    fetchData();
  }, [dispatch]);
};

export default useGetAllChannelData;
