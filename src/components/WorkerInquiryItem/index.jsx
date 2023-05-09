import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Button, Dialog, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import "./index.scss";
import { h5ToChatRoom } from "@/utils/appGlobal";
import { cancelOrderApi, startInquiry } from "@/api/UserInquiryHistory";
import { InquirStatus } from "@/constant";
import { StatusEnum } from "@/pagesStaff/WorkerInquiryRecord";
import { compareOrderTime } from "@/pages/UserInquiryDetail";
import { useSelector } from "react-redux";
import { sleep } from "@/utils/common";

function WorkerInquiryItem({
  value,
  deleteItemEvent,
  index,
  extra,
  onRefresh,
}) {
  const logo =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_worker_logo.png";
  const icon_inquiry_cancel =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_inquiry_cancel.png";
  const icon_inquiry_finished =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_inquiry_finished.png";

  const [dataSource, setDataSource] = useState(value);
  const navigate = useNavigate();
  const role = useSelector((state) => {
    return state.user.role;
  });
  const showDeleteDialog = async () => {
    Dialog.confirm({
      content: "确定要取消问诊吗？",
      onConfirm: async () => {
        await cancelOrder();
      },
    });
  };
  /**取消订单 */
  const cancelOrder = async () => {
    try {
      await cancelOrderApi({
        cloudroomOrderId: dataSource.cloudroomOrderId,
      });
      deleteItemEvent(index);
      Toast.show("成功取消订单");
    } catch (error) {
      Toast.show("取消订单失败");
    }
  };
  const toChatRoom = () => {
    h5ToChatRoom(dataSource, role).then((res) => {});
  };
  const toInquiryChatRoom = async () => {
    try {
      const res = await startInquiry({
        cloudroomOrderId: dataSource?.cloudroomOrderId,
      });
      await sleep(1500); //防止太快进入聊天室导致房间没创建好
      await h5ToChatRoom(res.data, role);
      onRefresh && onRefresh();
    } catch (error) {
      Toast.show(error);
    }
  };
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
      },
    });
  };
  const renderButon = () => {
    if (dataSource?.orderStatus === InquirStatus.Inquiring) {
      return (
        <div className="width-322 flex justify-end">
          <Button
            shape="rounded"
            color="primary"
            className="margin-left-8 font-size-12"
            onClick={toChatRoom}
            style={{
              background: "#33AFFF",
              "--border-color": "#33AFFF",
            }}
          >
            进入问诊
          </Button>
        </div>
      );
    } else if (dataSource?.orderStatus === InquirStatus.ToBeStarted) {
      return (
        <>
          <Button
            shape="rounded"
            color="default"
            className="margin-left-8 font-size-12"
            onClick={showDeleteDialog}
          >
            取消问诊
          </Button>
          <Button
            shape="rounded"
            color="primary"
            className="margin-left-8 font-size-12"
            onClick={showStartDialog}
            style={{
              background: "#33AFFF",
              "--border-color": "#33AFFF",
            }}
          >
            发起问诊
          </Button>
        </>
      );
    }
    return null;
  };
  const statusLogo = () => {
    if (dataSource?.orderStatus === InquirStatus.Finish) {
      return <Image src={icon_inquiry_finished} className="inquiry-status" />;
    } else if (dataSource?.orderStatus === InquirStatus.Canceled) {
      return <Image src={icon_inquiry_cancel} className="inquiry-status" />;
    }
    return null;
  };
  const toOrderDetail = () => {
    navigate(
      `/userInquiryDetail?cloudroomOrderId=${dataSource?.cloudroomOrderId}`
    );
  };
  return (
    <>
      <div className="worker-inquiry-item">
        <div className="flex align-center">
          <Image className="width-20 height-20" src={logo} />
          <span className="margin-left-8 font-bold">云诊断-视频复诊</span>
        </div>
        <div className="flex margin-top-20" onClick={toOrderDetail}>
          <Image
            className="width-76 height-76 border-radius-4"
            src={dataSource?.patientLogo}
          />
          <div className="margin-left-8">
            <div>
              <span>{dataSource.patientName}</span>
              <span className="margin-left-10">{dataSource?.sex}</span>
              <span className="margin-left-10">{dataSource?.patientAge}岁</span>
            </div>

            <div className="introduce">病情描述：{dataSource?.diseaseDesc}</div>
          </div>
        </div>
        {extra !== StatusEnum.Finish && (
          <div className="margin-top-20 padding-top-12 flex justify-between align-center">
            {extra === StatusEnum.AtOnceStart && (
              <span className="color-33afff">
                预约时间:{dataSource?.prepareTimeSlot}
              </span>
            )}
            {extra === StatusEnum.UnStart && (
              <span>预约时间:{dataSource?.prepareDate}</span>
            )}
            <div>{renderButon()}</div>
          </div>
        )}
        {statusLogo()}
      </div>
    </>
  );
}
WorkerInquiryItem.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default WorkerInquiryItem;
