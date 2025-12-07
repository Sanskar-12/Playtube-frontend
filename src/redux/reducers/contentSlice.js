import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: {
    allVideosData: [],
    allShortsData: [],
    contentRevenue: null,
  },
  reducers: {
    setAllVideosData: (state, action) => {
      state.allVideosData = action.payload;
    },
    setAllShortsData: (state, action) => {
      state.allShortsData = action.payload;
    },
    setContentRevenueData: (state, action) => {
      state.contentRevenue = action.payload;
    },
  },
});

export const { setAllVideosData, setAllShortsData, setContentRevenueData } =
  contentSlice.actions;

export default contentSlice.reducer;
