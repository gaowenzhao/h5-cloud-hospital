import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";
import userSlice from "./userSlice";
import medicineSlice from "./medicineSlice";
import prescriptionSlice from "./prescriptionSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const reducers = combineReducers({
  counter: counterSlice,
  user: userSlice,
  medicine: medicineSlice,
  prescription: prescriptionSlice,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: [], //持久化白名单
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  //不添加这句 redux-toolkit 会报无法序列化Warning
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
export default store;

// 栗子
// import { useSelector, useDispatch } from 'react-redux'
// import { decrement, increment } from '@/store/counterSlice'
// const count = useSelector((state) => state.counter.value)
// const dispatch = useDispatch()
// onClick={() => dispatch(increment())}
// onClick={() => dispatch(decrement())}
