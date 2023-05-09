import {
  Button,
  Image,
  Loading,
  NavBar,
  SpinLoading,
  Toast,
  ErrorBlock,
  Dialog,
} from "antd-mobile";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import Tabs from "@/components/Tabs";
import InquiryInfoItems from "./components/InquiryInfoItems";
import DoctorCard from "./components/DoctorCard";
import RefundFlow from "./components/RefundFlow";
import {
  cancelOrderApi,
  getWaitNum,
  startInquiry,
  userInquiryDetailApi,
} from "@/api/UserInquiryHistory";
import { InquirStatus, Role } from "@/constant";
import { h5ToChatRoom } from "@/utils/appGlobal";
import copyTextToClipboard from "copy-text-to-clipboard";
import { ExclamationCircleOutline } from "antd-mobile-icons";
import { doctorList, getByDoctorId } from "@/api/ChooseDocterByTab";
import useTimeDown from "@/hook/useTimeDown";
import { fractionalConversionYuan, getUrlParams, sleep } from "@/utils/common";
import { useSelector } from "react-redux";
//对比当前时间看是否要获取等待的人数
export const compareOrderTime = (data) => {
  const prepareDate = data?.prepareDate;
  const prepareStartTime = data?.prepareStartTime;
  const time = `${prepareDate} ${prepareStartTime}`;
  const timestamp = time.replace(/-/g, "/");
  var orderDate = new Date(timestamp);
  const orderDateTime = orderDate.getTime();
  const nowTime = new Date().getTime();
  return nowTime > orderDateTime;
};
function UserInquiryDetail() {
  const [dataSource, setDataSource] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const infoDetailRef = useRef(null);
  const currentLocation = useLocation();
  const [doctorInfo, setDoctorInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [waitNum, setWaitNum] = useState(0);
  const [timeDown, setTimeDown] = useTimeDown(0);
  const navigate = useNavigate();
  const role = useSelector((state) => {
    return state.user.role;
  });
  useEffect(() => {
    getDataSource();
  }, []);
  useEffect(() => {
    setHasMore(
      infoDetailRef.current?.clientHeight < infoDetailRef.current?.scrollHeight
    );
  }, [dataSource]);
  /**取消订单 */
  const cancelOrder = async () => {
    try {
      await cancelOrderApi({
        cloudroomOrderId: dataSource?.cloudroomOrderId,
      });
      Toast.show("成功取消订单");
      getDataSource();
    } catch (error) {
      Toast.show("取消订单失败");
    }
  };

  const toPayPage = () => {
    navigate("/orderPay", {
      state: {
        cloudroomOrderId: `${dataSource?.cloudroomOrderId}`,
      },
    });
  };
  const copyText = () => {
    const res = copyTextToClipboard(dataSource?.orderNo);
    if (res) {
      Toast.show("复制成功");
    }
  };
  const timeCount = (second) => {
    var minute = Math.floor(second / 60);
    second %= 60;
    if (minute > 0) {
      return `${minute}分${second}秒`;
    } else {
      return `${second}秒`;
    }
  };
  const toInquiryChatRoom = async () => {
    try {
      const res = await startInquiry({
        cloudroomOrderId: dataSource?.cloudroomOrderId,
      });
      await sleep(1500); //防止太快进入聊天室导致房间没创建好
      await h5ToChatRoom(res.data, role);
    } catch (error) {
      Toast.show(error);
    }
  };
  //工作人员发起问诊
  const showStartDialog = async () => {
    let title = "";
    if (compareOrderTime(dataSource)) {
      title = "确定要发起问诊吗？";
    } else {
      title = "当前未到预约时间，确定要发起问诊吗？";
    }
    Dialog.confirm({
      content: title,
      onConfirm: async () => {
        await toInquiryChatRoom();
        getDataSource();
      },
    });
  };
  const getDataSource = async () => {
    const params = getUrlParams(currentLocation.search);
    if (params?.cloudroomOrderId) {
      setLoading(true);
      try {
        const response = await userInquiryDetailApi({
          cloudroomOrderId: params?.cloudroomOrderId,
        });
        if (response.code === 200) {
          const resultData = response.data;
          setDataSource(resultData);
          if (
            resultData.orderStatus === InquirStatus.ToPay &&
            !!resultData?.millisLong
          ) {
            setTimeDown(resultData.millisLong);
          }
          if (resultData.orderStatus === InquirStatus.ToBeStarted) {
            const getWait = compareOrderTime(resultData);
            if (getWait) {
              const result = await getWaitNum({
                doctorId: resultData.doctorId,
              });
              setWaitNum(result.data);
            }
          }
          if (resultData.orderStatus === InquirStatus.Finish) {
            getByDoctorId({ doctorId: resultData.doctorId }).then((res) => {
              setDoctorInfo(res.data);
            });
          }
        } else {
          Toast.show(response.message);
          setLoading(false);
        }
      } catch (error) {
        Toast.show(error);
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show("订单Id为空");
    }
  };

  const openAll = () => {
    setShowMore(!showMore);
  };
  const orderList = useMemo(() => {
    const list = [
      {
        label: "订单编号",
        value: dataSource?.orderNo,
        copy: "复制",
      },
      {
        label: "订单金额",
        value: `¥${fractionalConversionYuan(dataSource?.costNum)}`,
      },
      {
        label: "预约时间",
        value: [dataSource?.prepareDate, dataSource?.prepareTimeSlot],
      },
    ];
    if (dataSource?.costType) {
      list.push({
        label: "支付类型",
        value: dataSource?.costType,
      });
    }
    if (dataSource?.duration) {
      list.push({
        label: "问诊时长",
        value: dataSource?.duration,
      });
    }
    return list;
  }, [dataSource]);
  const statusInfo = useMemo(() => {
    switch (dataSource?.orderStatus) {
      case InquirStatus.Evaluate:
        return {
          url: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_comment_start.png",
          title: "待评价",
          content: "本次问诊已完成，请及时对此次问诊进行评价",
        };
      case InquirStatus.Finish:
        return {
          url: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_inquiry_success.png",
          title: "已完成",
          content: "本次问诊已完成，如有需要可再次咨询",
        };
      case InquirStatus.Canceled:
        return {
          url: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_order_canceld.png",
          title: "订单取消",
        };
      case InquirStatus.ToBeStarted:
        return {
          url: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_order_tobestart.png",
          title: "待开始",
        };
      case InquirStatus.Inquiring:
        return {
          url: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_inquirying.png",
          title: "问诊中",
        };
      case InquirStatus.ToPay:
        return {
          url: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_topay.png",
          title: "待支付",
        };
      default:
        return "";
    }
  }, [dataSource?.orderStatus]);
  const toChatRoom = () => {
    h5ToChatRoom(dataSource, role).then((res) => {
      //todo
    });
  };
  const renderButton = useMemo(() => {
    switch (dataSource?.orderStatus) {
      case InquirStatus.ToBeStarted:
        if (role === Role.DOCTOR) {
          return (
            <div className="flex align-center">
              <Button
                color="default"
                block
                className="width-120"
                onClick={cancelOrder}
              >
                取消问诊
              </Button>
              <Button
                color="primary"
                block
                className="flex-sub margin-left-10"
                onClick={showStartDialog}
              >
                发起问诊
              </Button>
            </div>
          );
        } else {
          return (
            <div className="flex align-center justify-between">
              {dataSource?.canCancel === "是" && (
                <Button
                  color="default"
                  block
                  className="width-120 margin-right-14"
                  onClick={cancelOrder}
                >
                  取消预约
                </Button>
              )}
              <Button color="primary" block className="flex-sub" disabled>
                现在去
              </Button>
            </div>
          );
        }

      case InquirStatus.Inquiring:
        return (
          <Button
            color="primary"
            block
            className="flex-sub"
            onClick={toChatRoom}
          >
            {role === Role.DOCTOR ? "进入问诊" : "现在去"}
          </Button>
        );
      case InquirStatus.ToPay:
        return (
          <div className="flex align-center justify-between">
            <Button
              color="default"
              block
              className="flex-sub"
              className="width-100"
              onClick={cancelOrder}
            >
              取消预约
            </Button>
            <Button
              color="primary"
              block
              className="flex-sub"
              onClick={toPayPage}
              className="flex-sub margin-left-20"
            >
              立即支付
            </Button>
          </div>
        );
    }
    return null;
  }, [dataSource?.orderStatus]);

  return (
    <>
      {loading ? (
        <div className="height-100vh width-100vw flex justify-center align-center">
          <SpinLoading color="primary" />
        </div>
      ) : dataSource ? (
        <div
          className={`userinquiry-detail ${
            dataSource?.orderStatus === InquirStatus.Inquiring ||
            dataSource?.orderStatus === InquirStatus.ToBeStarted
              ? "padding-bottom-100"
              : "padding-bottom-40"
          }`}
        >
          <div className="detail-top">
            <Image
              className="icon_success width-90 height-90"
              src={statusInfo?.url}
            />
            <span className="inquiry-status">{statusInfo?.title}</span>
            <span className="inquiry-status-desc">
              {statusInfo?.content || ""}
            </span>
            {dataSource?.orderStatus === InquirStatus.ToBeStarted &&
              waitNum > 0 && (
                <div className="flex align-center bg-color-e0edfe padding-12 width-326 border-radius-8 margin-top-14">
                  <ExclamationCircleOutline color="#007fff" fontSize={20} />
                  <span className="color-007fff margin-left-10">
                    前面还剩{waitNum}人等待
                  </span>
                </div>
              )}
            {dataSource?.orderStatus === InquirStatus.ToPay && (
              <div className="flex align-center bg-color-e0edfe padding-12 width-326 border-radius-8 margin-top-14">
                <ExclamationCircleOutline color="#007fff" fontSize={20} />
                <span className="color-007fff margin-left-10">
                  {timeDown > 0
                    ? `等待支付，剩余${timeCount(timeDown)}`
                    : "支付超时,订单将会自动取消"}
                </span>
              </div>
            )}
          </div>
          <div className="detail-content">
            {(dataSource?.orderStatus === InquirStatus.Evaluate ||
              dataSource?.orderStatus === InquirStatus.Finish) && (
              <InquiryInfoItems
                orderInfo={dataSource}
                onRefresh={getDataSource}
              />
            )}

            {/* <RefundFlow /> */}
            <div className="inquiry-info">
              <div className="inquiry-info-label">问诊信息</div>
              <div className="inquiry-people">
                就诊人: {dataSource?.patientName}
              </div>
              <div
                ref={infoDetailRef}
                className={
                  showMore
                    ? "inquiry-info-detail"
                    : "inquiry-info-detail inquiry-info-detail-more"
                }
              >
                病情描述：{dataSource?.diseaseDesc}
              </div>
              {hasMore && (
                <div className="open-all-button" onClick={openAll}>
                  {showMore ? "收起" : "展开全部"}
                </div>
              )}
            </div>

            <div className="order-items">
              {orderList?.map((item, index) => (
                <div className="order-item" key={item.label}>
                  <span>{item.label}</span>
                  {Array.isArray(item.value) ? (
                    <div className="padding-left-50">
                      <div>{item.value[0]}</div>
                      <div>{item.value[1]}</div>
                    </div>
                  ) : (
                    <span
                      className={`padding-left-50 ${
                        index === 0 ? "font-size-14" : ""
                      }`}
                    >
                      {item.value}
                    </span>
                  )}
                  {item.copy && (
                    <span className="order-copy" onClick={copyText}>
                      {item.copy}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {dataSource?.reportFile?.length > 0 && (
              <div className="bg-color-ffffff margin-top-16 padding-bottom-10 border-radius-12">
                <div className="base-title">报告附件</div>
                <div className="image-contain">
                  {dataSource?.reportFile?.split(",")?.map((item, index) => (
                    <div
                      className="image-content"
                      key={index}
                      onClick={() => setVisible(true)}
                    >
                      <Image
                        key={index}
                        className="width-74 height-74 border-radius-2"
                        src={item}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!!doctorInfo && (
              <div className="margin-top-12">
                <DoctorCard doctorInfo={doctorInfo} />
              </div>
            )}
          </div>
          {renderButton && <div className="fix-bottom">{renderButton}</div>}
        </div>
      ) : (
        <div className="height-100vh flex flex-direction-column justify-center">
          <ErrorBlock status="default" />
        </div>
      )}
    </>
  );
}

export default UserInquiryDetail;
