import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/reducers/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/current/user`,
          {
            withCredentials: true,
          }
        );

        dispatch(setUser(data.user));
      } catch (error) {
        console.log(error);
        dispatch(setUser(null));
      }
    };
    fetchData();
  }, [dispatch, channelData]);
};

export default useGetCurrentUser;
