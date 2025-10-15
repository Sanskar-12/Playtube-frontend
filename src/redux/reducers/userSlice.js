import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    channelData: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChannelData: (state, action) => {
      state.channelData = action.payload;
    },
  },
});

export const { setUser, setChannelData } = userSlice.actions;

export default userSlice.reducer;
