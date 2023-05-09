import { useEffect, useState } from "react";
import { useNavigate, useLocation, useBeforeUnload } from "react-router-dom";
import { InfiniteScroll, Avatar, Button, Dialog } from "antd-mobile";
import DoctorInfoSimple from "@/components/DoctorInfoSimple";
import dayjs from "dayjs";
import {
  cloudroomArrangeList,
  cloudroomArrangeTimeList,
} from "@/api/ChooseTime/index";
import { scrollSmoothTo } from "@/utils/common";
import EmptyPng from "@/assets/images/empty.png";

function ChooseTime() {
  const navigate = useNavigate();
  const location = useLocation();
  // 加载中
  const [ajaxing, setAjaxing] = useState(false);
  // 医生信息
  const [doctor, setDoctor] = useState(location.state || {});
  // 日期列表
  const [dayList, setDayList] = useState([]);
  // 选中的日期
  const [activeData, setActiveData] = useState({
    cloudroomArrangeId: "",
    activetTime: "",
    curDay: "",
    timeList: [],
  });
  // 初始化 日期 选择
  const initDayList = () => {
    return new Promise((resolve) => {
      setAjaxing(true);
      cloudroomArrangeList({
        currentNum: 1,
        size: 30,
        doctorId: doctor.doctorId,
      })
        .then((res) => {
          const arr = [];
          for (let ov of res.data || []) {
            arr.push({
              week: ov.weekDay,
              day: ov.arrangeDate,
              status: ov.status,
              cloudroomArrangeId: ov.cloudroomArrangeId,
            });
          }
          setDayList(arr);
          resolve(arr);
        })
        .catch(() => {
          setAjaxing(false);
        });
    });
  };
  // 初始化 时间 选择 cloudroomArrangeId 班次id
  const initTimeList = ({ day = "", cloudroomArrangeId = "" }) => {
    setAjaxing(true);
    if (!cloudroomArrangeId) {
      setAjaxing(false);
      return;
    }
    cloudroomArrangeTimeList({
      arrangeDateStr: day || "",
      cloudroomArrangeId: cloudroomArrangeId || "",
    })
      .then((res) => {
        setAjaxing(false);
        setActiveData({
          cloudroomArrangeId: cloudroomArrangeId || "",
          activetTime: "",
          curDay: day,
          timeList: res.data || [],
        });
      })
      .catch(() => {
        setAjaxing(false);
      });
  };
  useEffect(() => {
    initDayList().then((res) => {
      initTimeList({
        day: (res[0] && res[0].day) || "",
        cloudroomArrangeId: (res[0] && res[0].cloudroomArrangeId) || "",
      });
    });
  }, []);

  const today = dayjs().format("YYYY-MM-DD");

  const handlerTime = (ov) => {
    if (ov.num > 0) {
      const nowTime = dayjs().format("YYYY-MM-DD HH:mm");
      const startTime = `${activeData.curDay} ${ov.time.split("-")[0]}`;
      // 这里是 当前时间 大于 开始时间 就置灰
      if (nowTime > startTime) {
        initTimeList({
          day: activeData.curDay,
          cloudroomArrangeId: activeData.cloudroomArrangeId,
        });
      } else {
        setActiveData({
          ...activeData,
          activetTime: ov.time,
          // 当前 时间段的精确 id
          timeCloudroomArrangeId: ov.cloudroomArrangeId,
        });
      }
    }
  };
  // 监听 日期 变化 对应滚动设置
  useEffect(() => {
    scrollSmoothTo({ tag: "scroll-smooth", tagChild: "border-007fff" });
  }, [activeData.curDay]);

  // 时间 列表 模板
  const TimeListTpl = (props) => {
    const { list = [] } = props;
    const nowTime = dayjs().format("YYYY-MM-DD HH:mm");
    return (
      <div className="flex justify-between flex-wrap padding-lr-16">
        {list.map((v) => {
          let color = "";
          let numColor = "";
          let bolder = "border-171a1d3d";
          if (activeData.activetTime == v.time) {
            color = "color-007fff";
            bolder = "border-007fff";
          }
          if (v.num == 0) {
            color = "color-171a1d3d";
          }
          const startTime = `${activeData.curDay} ${v.time.split("-")[0]}`;
          // 这里是 当前时间 大于 开始时间 就置灰
          if (nowTime > startTime) {
            color = "color-171a1d3d";
            numColor = "color-171a1d3d";
          }
          return (
            <div
              className={`width-150 flex border-radius-4 margin-bottom-20 ${bolder}`}
              key={v.time}
              onClick={() => {
                if (nowTime < startTime) {
                  handlerTime(v);
                }
              }}
            >
              <div
                className={`flex-sub line-height-28 font-size-17 padding-left-8 ${color} `}
              >
                {v.time}
              </div>
              <div
                className={`width-30 text-align-center line-height-28 height-28  ${
                  v.num != "0" ? "bg-color-007fff1f" : "bg-color-ff920029"
                } ${numColor}`}
              >
                {v.num}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ChooseTime">
      {/* 医生信息 开始 */}
      <div className="padding-lr-24 padding-tb-12 bg-color-ffffff">
        <DoctorInfoSimple doctor={doctor} />
      </div>
      {/* 医生信息 结束 */}

      {/* 日期列表开始 */}
      <div className="overflow-hidden overflowX-auto nowrap flex flex-nowrap width-100vw bg-color-ffffff padding-bottom-12 scroll-smooth">
        {dayList.map((v) => {
          let bgColor = "";
          let textColor = "";
          let tipsTextColor = "color-317ed0";
          // 可预约
          if (v.status == "可预约") {
            bgColor = "bg-color-f5f5f5 border-ffffff";
            textColor = "";
            tipsTextColor = "color-007fff";
            if (v.day == activeData.curDay) {
              bgColor = "bg-color-ffffff border-007fff";
              textColor = "color-007fff";
            }
          } else {
            // 已月满
            bgColor = "bg-color-ffedd6 border-ffffff";
            textColor = "color-ffc16f";
            tipsTextColor = "color-ffc16f";
            if (v.day == activeData.curDay) {
              bgColor = "bg-color-ffedd6 border-007fff";
            }
          }
          return (
            <div
              className={`border-radius-8 margin-lr-4 text-align-center padding-top-4 padding-bottom-8 flex-shrink width-68 ${bgColor}`}
              key={v.day}
              onClick={() => {
                initTimeList({
                  day: v.day,
                  cloudroomArrangeId: v.cloudroomArrangeId,
                });
              }}
            >
              <div
                className={`width-0 height-4 bg-color-007fff margin-0-auto border-radius-4 ${
                  v.day == today ? "width-4" : ""
                }`}
              ></div>
              <div
                className={`font-size-15 line-height-22  margin-top-4 ${textColor}`}
              >
                {v.week}
              </div>
              <div
                className={`font-size-12 line-height-18 margin-tb-6 ${textColor}`}
              >
                {`${v.day || ""}`.length > 5 ? v.day.slice(5) : v.day}
              </div>
              <div className={`font-size-12 line-height-22 ${tipsTextColor}`}>
                {v.status}
              </div>
            </div>
          );
        })}
      </div>
      {/* 日期列表结束 */}

      {/* 选择 时间 列表 开始 */}
      <div
        className={`margin-12 border-radius-8 padding-tb-16 ${
          activeData.timeList.length ? "bg-color-ffffff" : ""
        }`}
      >
        <div className="">
          {activeData.timeList.map((v) => {
            return (
              <div key={v.date}>
                <div className="font-bold padding-left-16 font-size-17 line-height-22 margin-bottom-20">
                  {v.date || ""}
                </div>
                <TimeListTpl list={v.timeList} />
              </div>
            );
          })}
        </div>

        {(!ajaxing && !dayList.length) ||
        (!ajaxing && !activeData.timeList.length) ? (
          <div className="padding-10 text-align-center">
            <Avatar
              src={EmptyPng}
              className="width-180 height-180 margin-0-auto"
            />
            <div className="text-align-center font-size-17 color-171a1d99 padding-tb-20">
              {!dayList.length && !activeData.timeList.length
                ? "~暂无排班~"
                : ""}
              {dayList.length && !activeData.timeList.length
                ? "~当日暂无排班~"
                : ""}
            </div>
          </div>
        ) : null}
      </div>
      {/* 选择 时间 列表 结束 */}

      <div className="padding-46"></div>
      {/* 底部 按钮 开始 */}
      <div className="height-66 padding-tb-12 padding-lr-16 position-fixed position-left-0 position-bottom-0 bg-color-ffffff position-right-0">
        <Button
          block
          color="primary"
          className="height-44 border-radius-8 font-size-17"
          disabled={!activeData.activetTime}
          onClick={() => {
            navigate(`/orderEdit`, {
              state: {
                ...doctor,
                activetTime: activeData.activetTime || "",
                curDay: activeData.curDay || "",
                // cloudroomArrangeId: activeData.cloudroomArrangeId || "",
                cloudroomArrangeId: activeData.timeCloudroomArrangeId || "",
              },
              // replace: true
            });
          }}
        >
          下一步
        </Button>
      </div>
      {/* 底部 按钮 结束 */}
    </div>
  );
}

export default ChooseTime;
