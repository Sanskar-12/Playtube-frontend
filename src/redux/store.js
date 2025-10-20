import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import contentReducer from "./reducers/contentSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    content: contentReducer,
  },
});
