import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";

const useGetAllSubscribedContent = () => {
  useEffect(() => {
    const fetchSubscribedData = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/v1/get/all/subscribed/data`,
          {
            withCredentials: true,
          }
        );

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubscribedData();
  }, []);
};

export default useGetAllSubscribedContent;
