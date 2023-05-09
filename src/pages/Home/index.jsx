import {
  useNavigate,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";
import { Avatar, Button, Input, Dialog } from "antd-mobile";
import EntryTips from "@/components/EntryTips";
import Offices from "@/assets/images/offices.png";
import Doctor from "@/assets/images/doctor.png";
import Days from "@/assets/images/days.png";
import Record from "@/assets/images/record.png";
import Exchange from "@/assets/images/exchange.png";
import DoctorInfoSimple from "@/components/DoctorInfoSimple";
import DoctorInfo from "@/components/DoctorInfo";
import { choosePatientByApp, inquireSummaryEnd } from "@/utils/appGlobal";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "@/store/userSlice";
import { getPatientList, cloudroomOrderList } from "@/api/Home";
import EntryUrlChange from "@/components/EntryUrlChange";
import Camera from "@/assets/images/camera.png";
import { timeCount } from "@/utils/common";
import useTimeDown from "@/hook/useTimeDown";
function Home() {
  const navigate = useNavigate();
  // 导航栏 快捷入口
  const fastEnterList = [
    {
      title: "按科室",
      image: Offices,
      link: "/chooseOffices",
    },
    {
      title: "按医生",
      image: Doctor,
      link: "/chooseDocterByTab?tab=doctor",
    },
    {
      title: "按日期",
      image: Days,
      link: "/chooseDocterByTab?tab=day",
    },
    {
      title: "问诊记录",
      image: Record,
      link: "/userinquiryhistory",
    },
  ];

  const dispatch = useDispatch();
  // 就诊人 信息
  const userInfo = useSelector((state) => {
    return state.user.userInfo || {};
  });

  const DialogConfirm = () => {
    Dialog.confirm({
      content: "暂无就诊人，去添加就诊人",
      closeOnAction: true,
      onConfirm: () => {
        handleChangePatient();
      },
      onCancel: () => {
        inquireSummaryEnd();
      },
    });
  };

  // 是否请求过了
  const [isGetPatient, setIsGetPatient] = useState(false);

  // 在提示页面 弹出 点击关闭后 如果请求没回来 就不用做事情 如果请求回来了就判断要不要
  const beforeClose = () => {
    // 请求过了，并且 就诊人没拿到 就提示
    if (isGetPatient && !userInfo.patientId) {
      DialogConfirm();
    }
  };
  // 获取 就诊人 并且找到默认(或者 指定 patient_id) 的那个 如果没有就用第一个
  const getPatientUserList = (patientId = "") => {
    getPatientList().then((res) => {
      const resDataRecords = res.data || [];
      setIsGetPatient(true);
      if (!resDataRecords.length) {
        const todayIsTips = window.localStorage.getItem("todayIsTips");
        if (todayIsTips) {
          DialogConfirm();
        }
      } else {
        const find = resDataRecords.find((v) => {
          return v.patientId == patientId;
        });
        if (find) {
          dispatch(setUserInfo(find));
        } else {
          if (resDataRecords.length) {
            dispatch(setUserInfo(resDataRecords[0]));
          }
        }
      }
    });
  };
  // 切换就诊人 这里 和 app 交互 会 得到 就诊人patient_id 然后 再请求获取 详情
  const handleChangePatient = () => {
    choosePatientByApp().then((res) => {
      if (res && res.patient_id) {
        // 查找 就诊人 的详情信息
        getPatientUserList(res.patient_id);
      } else {
        if (!userInfo.patientId) {
          DialogConfirm();
        }
      }
    });
  };

  // 最近问诊 列表
  const [orderList, setOrderList] = useState([]);
  // 获取 最近问诊 记录 5条
  const getCloudroomOrderList = () => {
    cloudroomOrderList({ currentNum: 1, size: 5 }).then((res) => {
      setOrderList(res.data.records || []);
    });
  };

  useEffect(() => {
    getPatientUserList();
    getCloudroomOrderList();
  }, []);

  const EntryUrlChangeRef = useRef();
  const openEntryUrlChange = () => {
    EntryUrlChangeRef.current.open();
  };
  const colorObj = {
    待支付: "bg-color-007fff1f color-007fff", //待支付
    待开始: "bg-color-7e868e29", //待开始
    问诊中: "color-00b042 bg-color-00b0421f", //问诊中
    待评价: "bg-color-007fff1f color-007fff", //待评价
    已完成: "bg-color-7e868e29 color-171a1d99", //已经完成
    已取消: "bg-color-7e868e29 color-171a1d99", //已取消
  };

  // 监听路由变化
  const blockerRef = useRef("1");
  const blocker = useBlocker(!!blockerRef.current);
  // 支付提示 弹框的 次数 当次数 为 0 的时候 才 提示 大于0 说明已经 展示 提示 了
  const dialogrNumRef = useRef(0);

  useEffect(() => {
    handleBlocker();
  }, [blocker]);

  const handleBlocker = () => {
    if (blocker && blocker.state === "blocked" && !blockerRef.current) {
      blocker && blocker.proceed && blocker.proceed();
    } else {
      console.log("🚀 blockerRef: 进来了这里1",dialogrNumRef.current);
      if (dialogrNumRef.current > 0) {
        console.log("🚀 blockerRef: 进来了这里2",dialogrNumRef.current);
        inquireSummaryEnd();
      } else {
        console.log("🚀 blockerRef: 进来了这里3",dialogrNumRef.current);
        dialogrNumRef.current = 1;
        console.log("🚀 blockerRef: 进来了这里4",dialogrNumRef.current);
      }
    }
    console.log("🚀 blockerRef: 进来了这里");
  };

  return (
    <div className="home">
      <div className="padding-12">
        <div className="padding-16 bg-color-ffffff border-radius-6 flex justify-left align-start margin-bottom-12">
          <Avatar src={userInfo.headLogo} className="height-88 width-88" />
          <div className="flex-sub padding-left-16">
            <div className="flex justify-between">
              <div
                className="font-size-16 font-bold line-height-38"
                // onClick={() => {
                //   navigate("/medicine");
                // }}
              >
                {userInfo.userName || ""}
              </div>
              <div className="padding-top-6">
                <Avatar
                  src={Exchange}
                  className="width-24 height-24"
                  onClick={handleChangePatient}
                />
              </div>
            </div>
            <div className="font-size-14 opacity-6 line-height-24">
              {userInfo.age || "-"}岁
            </div>
            <div
              className="font-size-14 opacity-6 line-height-24"
              // onClick={() => {
              //   openEntryUrlChange();
              // }}
            >
              诊疗卡ID：{userInfo.cardNo || userInfo.patientCardNo || "-"}
            </div>
          </div>
        </div>

        <div className="padding-16 bg-color-ffffff border-radius-6 flex justify-between align-center margin-bottom-12">
          {fastEnterList.map((v) => {
            return (
              <div
                className="width-54 text-align-center flex-sub"
                key={v.title}
                onClick={() => {
                  blockerRef.current = "";
                  navigate(v.link);
                }}
              >
                <div className="text-align-center">
                  <img src={v.image} alt="" className="width-32 height-32" />
                </div>
                <div className="text-align-center font-size-14 line-height-20">
                  {v.title}
                </div>
              </div>
            );
          })}
        </div>
        {/* onClick={openEntryUrlChange} */}
        <div className="padding-tb-12 font-size-16">
          {orderList.length ? "最近问诊" : null}
        </div>
        {orderList.map((v, i) => {
          return (
            <div
              className="padding-tb-16 margin-bottom-12 bg-color-ffffff border-radius-6"
              key={v.orderNo || i}
              onClick={() => {
                blockerRef.current = "";
                navigate(
                  `/userInquiryDetail?cloudroomOrderId=${v.cloudroomOrderId}`
                );
              }}
            >
              {v.orderStatus == "问诊中" ? (
                <DoctorInfo
                  doctor={v}
                  BtnTopRightSlot={() => {
                    let color = colorObj[v.orderStatus] || "bg-color-7e868e29";
                    return (
                      <Button
                        color="default"
                        className={`height-28 border-radius-4 font-size-14 padding-tb-0 padding-lr-10 line-height-26 ${color}`}
                      >
                        {v.orderStatus}
                      </Button>
                    );
                  }}
                  ChildrnSlot={() => {
                    return (
                      <>
                        {/* 卡片底部 按钮 开始 */}
                        <div className="height-1 bg-color-7e868e29 margin-lr-4 margin-top-8 margin-bottom-12"></div>
                        <div className="padding-lr-12 flex justify-between align-center min-height-36">
                          <div className="flex-sub  flex justify-start align-center">
                            <img src={Camera} className="width-24 height-24" />
                            <div className="padding-left-8 opacity-6">
                              {`${v.prepareTimeSlot || ""}`}
                            </div>
                          </div>
                          <Button
                            color="primary"
                            className="height-36 font-size-14 width-74"
                          >
                            现在去
                          </Button>
                        </div>
                        {/* 卡片底部 按钮 结束 */}
                      </>
                    );
                  }}
                />
              ) : null}

              {v.orderStatus != "问诊中" ? (
                <>
                  <DoctorInfoSimple
                    className="padding-lr-12"
                    doctor={v}
                    BtnTopRightSlot={() => {
                      let color =
                        colorObj[v.orderStatus] || "bg-color-7e868e29";
                      return (
                        <Button
                          color="default"
                          className={`height-28 border-radius-4 font-size-14 padding-tb-0 padding-lr-10 line-height-26 ${color}`}
                        >
                          {v.orderStatus}
                        </Button>
                      );
                    }}
                  />

                  <div className="margin-lr-4 height-1 bg-color-7868ee margin-tb-8 opacity-2"></div>
                  <div className="padding-lr-12 font-size-14 padding-top-4">
                    <div className="opacity-6 flex justify-start margin-bottom-8">
                      <div className="label inline-block width-76">
                        就诊人：
                      </div>
                      <div className="label flex-sub">
                        {v.patientName || ""}
                      </div>
                    </div>

                    <div className="opacity-6 flex justify-start">
                      <div className="label inline-block width-76">
                        问诊时间：
                      </div>
                      <div className="label flex-sub">{`${
                        v.prepareDate || ""
                      } ${v.prepareTimeSlot || ""}`}</div>
                    </div>
                    {v.orderStatus == "待支付" ? (
                      <div className="padding-top-24 flex justify-between align-center">
                        <div className="color-007fff flex-sub">
                          {v.millisLong ? (
                            <Timer
                              millisLong={v.millisLong}
                              getCloudroomOrderList={getCloudroomOrderList}
                            />
                          ) : null}
                          后订单将自动取消
                        </div>
                        <Button
                          color="primary"
                          className="height-28 border-radius-4 font-size-14 padding-tb-0 padding-lr-12 line-height-26"
                        >
                          去支付
                        </Button>
                      </div>
                    ) : null}
                    {v.canCancel == "是" && v.orderStatus !== "待支付" ? (
                      <div className="padding-top-24 flex justify-between align-center">
                        <div className="color-007fff flex-sub"></div>
                        <Button
                          color="primary"
                          className="height-28 border-radius-4 font-size-14 padding-tb-0 padding-lr-12 line-height-26"
                        >
                          取消预约
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <EntryTips beforeClose={beforeClose} />
      <EntryUrlChange ref={EntryUrlChangeRef} />
    </div>
  );
}

const Timer = ({ millisLong, getCloudroomOrderList }) => {
  const [timeDown] = useTimeDown(millisLong);
  useEffect(() => {
    if (timeDown <= 0) {
      getCloudroomOrderList && getCloudroomOrderList();
    }
  }, [timeDown]);
  return <span>{timeCount(timeDown)}</span>;
};
export default Home;
