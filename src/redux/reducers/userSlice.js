import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    channelData: null,
    allChannelData: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChannelData: (state, action) => {
      state.channelData = action.payload;
    },
    setAllChannelData: (state, action) => {
      state.allChannelData = action.payload;
    },
  },
});

export const { setUser, setChannelData, setAllChannelData } = userSlice.actions;

export default userSlice.reducer;
