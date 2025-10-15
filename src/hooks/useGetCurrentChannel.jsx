import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setChannelData } from "../redux/reducers/userSlice";

const useGetCurrentChannel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/v1/get/channel`, {
          withCredentials: true,
        });

        dispatch(setChannelData(data.channel));
      } catch (error) {
        console.log(error);
        dispatch(setChannelData(null));
      }
    };
    fetchData();
  }, [dispatch]);
};

export default useGetCurrentChannel;
