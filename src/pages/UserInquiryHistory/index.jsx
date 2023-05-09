import "./index.scss";
import { Tabs } from "antd-mobile";
import InquiryList from "./InquiryList";
import { InquirStatus } from "@/constant";
import { useLocation } from "react-router-dom";
import { useState } from "react";
function UserInquiryHistory() {
  const tabsInfo = [
    {
      title: "待完成",
      key: "1",
      value: [
        InquirStatus.ToPay,
        InquirStatus.ToBeStarted,
        InquirStatus.Inquiring,
      ],
    },
    {
      title: "已完成",
      key: "2",
      value: [InquirStatus.Evaluate, InquirStatus.Finish],
    },
    { title: "全部", key: "3" },
  ];
  let location = useLocation();
  const activeKey = location.search?.split("=")?.[1] || "1";
  const onTabChange = (value) => {
    console.log(value);
    window.scrollTo(0, 0);
  };

  return (
    <div className="user-inquiry-history">
      <Tabs
        defaultActiveKey={activeKey}
        onChange={onTabChange}
        activeLineMode="fixed"
        style={{
          "--title-font-size": "3.6vw",
          "--active-line-color": "#171A1D",
          "--active-title-color": "#171A1D",
          "--fixed-active-line-width": "5vw",
          "--content-padding": "0",
        }}
      >
        {tabsInfo.map((item) => (
          <Tabs.Tab title={item.title} key={item.key}>
            <InquiryList statusList={item.value} />
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default UserInquiryHistory;
