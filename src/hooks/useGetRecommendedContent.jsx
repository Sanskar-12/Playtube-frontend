import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setRecommendedContent } from "../redux/reducers/userSlice";

const useGetRecommendedContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecommendedContent = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/recommendations`,
          {
            withCredentials: true,
          }
        );

        console.log(data);

        dispatch(setRecommendedContent(data));
      } catch (error) {
        console.log(error);
        dispatch(setRecommendedContent(null));
      }
    };
    fetchRecommendedContent();
  }, [dispatch]);
};

export default useGetRecommendedContent;
