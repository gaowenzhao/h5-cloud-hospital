import useTimeDown from "@/hook/useTimeDown";
import { Button, Image } from "antd-mobile";
import { StarFill } from "antd-mobile-icons";
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { InquirStatus } from "@/constant";
// import { countDown } from "@/utils/common";
function InquiryItem({ dataSource, dataIndex, onDeleteItem }) {
  const [timeDown] = useTimeDown(dataSource?.millisLong);
  const navigate = useNavigate();
  const labelStyle = useMemo(() => {
    switch (dataSource.orderStatus) {
      case InquirStatus.Inquiring:
        return {
          title: "问诊中",
          className: "inquiry-status-ing",
        };
      case InquirStatus.Evaluate:
        return {
          title: "待评价",
          className: "inquiry-status-comment",
        };
      case InquirStatus.Finish:
        return {
          title: "已经完成",
          className: "inquiry-status-finish",
        };
      case InquirStatus.Canceled:
        return {
          title: "已取消",
          className: "inquiry-status-finish",
        };
      case InquirStatus.ToBeStarted:
        return {
          title: "待开始",
          className: "inquiry-status-to-start",
        };
      case InquirStatus.ToPay:
        return {
          title: "待支付",
          className: "inquiry-status-comment",
        };
    }
  }, [dataSource.orderStatus]);
  useEffect(() => {
    if (dataSource.orderStatus === InquirStatus.ToPay && timeDown === 0) {
      onDeleteItem(dataSource);
    }
  }, [timeDown]);

  useEffect(() => {
    if (dataSource.orderStatus === InquirStatus.ToPay && timeDown === 0) {
      onDeleteItem(dataSource);
    }
  }, []);
  const toDetail = () => {
    navigate(
      `/userInquiryDetail?cloudroomOrderId=${dataSource.cloudroomOrderId}`
    );
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
  return (
    <div className="inquiry-item" onClick={toDetail}>
      <div className="doctor-info-contain">
        <Image
          className="doctor-image width-52 height-52"
          src={dataSource?.doctorLogo}
        />
        <div className="doctor-info">
          <div className="doctor-top">
            <div>
              <span className="doctor-name">{dataSource?.doctorName}</span>
              <span className="doctor-level">{dataSource?.title || ""}</span>
              {dataSource?.prescribe === "是" && (
                <span className="doctor-label">处方</span>
              )}
            </div>
            <span className={`inquiry-status ${labelStyle?.className}`}>
              {labelStyle?.title}
            </span>
          </div>
          <div className="doctor-center">
            <span>{dataSource?.hospital}</span>
            <span className="margin-left-10">{dataSource?.keshiName}</span>
          </div>
          {/*  {dataSource?.orderStatus === InquirStatus.Inquiring && (
            <div className="doctor-bottom">
              擅长肺心病、心肺感染、内科康复按时的离开家福利卡撒的发生的第三方
            </div>
          )} */}
        </div>
      </div>
      {/* 问诊中的底部操作 */}
      {/*       {dataSource?.orderStatus === InquirStatus.Inquiring && (
        <div className="order-doctor-info-inquiring">
          <div className="order-doctor-info-left">
            <Image
              width={28}
              height={28}
              src="https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_video.png"
            />
            <span className="order-time">10:30-11:00</span>
          </div>
          <Button className="order-button" color="primary">
            现在去
          </Button>
        </div>
      )} */}

      <div className="order-doctor-info-other">
        <span className="order-doctor-text">
          就诊人: {dataSource?.patientName}
        </span>
        <span className="order-doctor-text">
          预约时间:{dataSource?.prepareDate} {dataSource?.prepareTimeSlot}
        </span>
        {/* 待支付 */}
        {dataSource?.orderStatus === InquirStatus.ToPay &&
          (timeDown !== 0 ? (
            <div className="order-operate">
              <div className="order-time-down">
                {timeCount(timeDown)}后订单将自动取消
              </div>
               
              <Button
                className="order-status-button"
                color="primary"
                fill="solid"
              >
                去支付
              </Button>
            </div>
          ) : (
            <div className="font-size-14 color-f53f3f">
              支付超时,订单将会自动取消
            </div>
          ))}
        {dataSource?.orderStatus === InquirStatus.ToBeStarted &&
          dataSource?.canCancel === "是" && (
            <Button
              className="order-status-button"
              color="primary"
              fill="solid"
            >
              取消预约
            </Button>
          )}
        {dataSource?.orderStatus === InquirStatus.Inquiring && (
          <Button className="order-status-button" color="primary" fill="solid">
            现在去
          </Button>
        )}
      </div>
    </div>
  );
}
InquiryItem.propTypes = {
  dataSource: PropTypes.object.isRequired,
};
export default InquiryItem;
