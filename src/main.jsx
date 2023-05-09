import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import "reset-css";
import "./index.scss";
import { ConfigProvider } from "antd-mobile";
import zhCN from "antd-mobile/es/locales/zh-CN";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { persistor } from "./store";

import { getUserInfoByApp } from "@/utils/appGlobal";
import { setToken, setUserId, setUserRole } from "@/store/userSlice";
// import VConsole from "vconsole";
import { PersistGate } from "redux-persist/integration/react";
import routes from "./routes";

// new VConsole();
// console.log("🚀 ~window", window);

const initReactDOM = () => {
  const router = createBrowserRouter(routes);
  ReactDOM.createRoot(document.getElementById("root")).render(
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <BrowserRouter>
            <App />
          </BrowserRouter> */}
          <RouterProvider
            router={router}
            fallbackElement={<></>}
          ></RouterProvider>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
};
getUserInfoByApp()
  .then((res) => {
    console.log("🚀 getUserInfoByApp:", res);
    store.dispatch(setToken(res.token));
    store.dispatch(setUserId(res.user_id));
    store.dispatch(setUserRole(res.role || ""));
    initReactDOM();
  })
  .catch(() => {
    console.log("🚀 getUserInfoByApp:", "app 没给");
    if (import.meta.env.MODE == "development") {
      const isPatient = 1 || localStorage.getItem("isPatient") - 0; // 是否就诊人 0 否 1是  切换 这里 进入不同角色

      if (!!isPatient) {
        const userId = 22751;
        /* 用户端 */
        store.dispatch(
          setToken(
            "OrganizationeyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzgwMDAwMDAwMCIsImNyZWF0ZWQiOjE2ODAzMzI4MDc2MDMsImV4cCI6MTY4MDkzNzYwN30.qQ_mdTB_ZCGwhOjkAIRdWuOHtQvghZlbZSe21voQu2bRBqFcKLN6gPMwd9-IVUbZQ3X2iAS6zbzPE2XHCCtXKw"
          )
        );
        store.dispatch(setUserId(userId));
      } else {
        const doctorId = 22725;
        /* 工作端 */
        store.dispatch(
          setToken(
            "CommunityeyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxOTgwMjAxMzY0MiIsImNyZWF0ZWQiOjE2ODA3NzY0NDc0NzAsImV4cCI6MTY4MTM4MTI0N30.EDBWP288Ru4vDrMaHujHDA-oG9unayQAmTD0xPrS8bXbmbmzGc6wqxJ709cmWp8Y_MqK68WpwH-EPk7Au0QBsQ"
          )
        );
        store.dispatch(setUserId(doctorId));
      }
    }
    initReactDOM();
  });
