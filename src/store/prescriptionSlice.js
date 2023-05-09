import { createSlice } from "@reduxjs/toolkit";

export const prescriptionSlice = createSlice({
  name: "prescription",
  initialState: {
    dataSource: {
      resultList: [], //诊断结果
      medicineList: [],
      remark: "",
      verifyReason: "",
      fromMedicePageBack: false, //是否从取药页面回来
      doctorSign: "",
      checkerSign: "",
      logStatus: "", //审核状态
      doctorSignId: "",
      doctorSignFileUrl: "", //医生签名图片
      verifySignId: "",
      verifySignFileUrl: "", //审核员签名图片
    },
  },
  reducers: {
    setInitial: (state, { payload }) => {
      state.dataSource = payload;
    },
    setFieldValue: (state, { payload }) => {
      state.dataSource = { ...state.dataSource, ...payload };
    },
    clearStore: (state, { payload }) => {
      state.dataSource = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFieldValue, setInitial, clearStore } =
  prescriptionSlice.actions;

export default prescriptionSlice.reducer;
