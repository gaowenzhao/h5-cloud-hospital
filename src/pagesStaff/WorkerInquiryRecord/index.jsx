import { Button, NavBar, InfiniteScroll, List } from "antd-mobile";
import { useState } from "react";
import "./index.scss";
import { Tabs } from "antd-mobile";
import OrderList from "./OrderList";
import { InquirStatus } from "@/constant";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

export const StatusEnum = {
  AtOnceStart: 1,
  UnStart: 2,
  Inquiring: 3,
  Finish: 4,
};
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dateStr = [
    year,
    month < 10 ? "0" + month : month,
    day < 10 ? "0" + day : day,
  ].join("-");
  return dateStr;
};

function WorkerInquiryRecord() {
  const tabsInfo = [
    {
      title: "即将开始",
      key: StatusEnum.AtOnceStart,
      value: {
        orderStatus: InquirStatus.ToBeStarted,
        prepareDate: getCurrentDate(),
      },
    },
    {
      title: "待接诊",
      key: StatusEnum.UnStart,
      value: {
        orderStatus: InquirStatus.ToBeStarted,
      },
    },
    {
      title: "问诊中",
      key: StatusEnum.Inquiring,
      value: {
        orderStatus: InquirStatus.Inquiring,
      },
    },
    {
      title: "已完成",
      key: StatusEnum.Finish,
      value: {
        statusList: [
          InquirStatus.Evaluate,
          InquirStatus.Finish,
          InquirStatus.Canceled,
        ],
      },
    },
  ];
  let location = useLocation();
  const activeKey = location.search?.split("=")?.[1] || "1";

  const onTabChange = (value) => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="worker-inquiry-record">
      <Tabs
        onChange={onTabChange}
        activeLineMode="fixed"
        defaultActiveKey={activeKey}
        style={{
          "--title-font-size": "3.6vw",
          "--active-line-color": "#33AFFF",
          "--active-title-color": "#33AFFF",
          "--fixed-active-line-width": "5vw",
          "--content-padding": "0",
        }}
      >
        {tabsInfo.map((item) => (
          <Tabs.Tab title={item.title} key={item.key}>
            <OrderList orderStatus={item.value} extra={item.key} />
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default WorkerInquiryRecord;
