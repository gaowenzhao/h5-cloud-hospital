import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const medicineSlice = createSlice({
  name: "medicine",
  initialState: {
    // 用于 选择
    medicineItemTemp: {},
    // 用于 确认 选择 或者
    medicineItemSure: {},
  },
  reducers: {
    // 1.这个用在 搜索 药品 页面 点击药品的时候用 2.添加药品页面也用到
    setMedicineItemTemp: (state, action = {}) => {
      state.medicineItemTemp = action.payload;
    },
    // 1.这个用在 搜索 药品 页面 点击药品的时候用 2.添加药品页面也用到
    setMedicineItemSure: (state, action = {}) => {
      state.medicineItemSure = action.payload;
    },
    // 初始化用这个 任何页面 跳转进入 添加 药品 页面 之前 调用这个方法
    setMedicineItemInit: (state, action = {}) => {
      state.medicineItemTemp = JSON.parse(JSON.stringify(action.payload));
      state.medicineItemSure = JSON.parse(JSON.stringify(action.payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMedicineItemTemp, setMedicineItemSure, setMedicineItemInit } =
  medicineSlice.actions;

export default medicineSlice.reducer;
