import { Button, Image, Toast } from "antd-mobile";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { RightOutline, CloseOutline, StarFill } from "antd-mobile-icons";
import { Popup } from "antd-mobile";
import "./index.scss";
import { InquirStatus, Role } from "@/constant";
import { addDoctorJudge, updateOrderStatus } from "@/api/UserInquiryHistory";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { h5ToChatRoom } from "@/utils/appGlobal";

function InquiryInfoItems({ orderInfo, onRefresh }) {
  const navigate = useNavigate();
  //根据评价状态来做评价弹窗处理
  const [visible, setVisible] = useState(false);
  const role = useSelector((state) => {
    return state.user.role;
  });
  const [startCount, setStartCount] = useState(() => {
    const count =
      orderInfo?.orderStatus === InquirStatus.Evaluate
        ? 0
        : Number(orderInfo?.hzmyd);
    return count;
  });
  //问诊评价
  const toComment = () => {
    setVisible(true);
  };
  //问诊小结
  const toInquirySummary = () => {
    navigate("/inquiresummary?cloudroomOrderId=" + orderInfo.cloudroomOrderId);
  };
  //电子处方
  const toEPrescribing = () => {
    navigate("/eprescribing", {
      state: orderInfo?.cloudroomOrderId,
    });
  };
  //复诊记录
  const toRepeatRecord = () => {
    h5ToChatRoom(orderInfo, role).then((res) => {});
  };

  const submitComment = async () => {
    const res = addDoctorJudge({
      doctorId: orderInfo?.doctorId,
      hzmyd: startCount?.toString(),
      cloudroomOrderId: orderInfo.cloudroomOrderId,
    });
    if (res.code === 200) {
      Toast.show("评价成功");
      onRefresh();
      setVisible(false);
    } else {
      Toast.show("评价失败");
    }
  };
  const cardList = useMemo(() => {
    const list = [
      {
        icon: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_wenzen_xiaojie.png",
        title: "问诊小结",
        defaultText: "查看本次问诊结果",
        clickEvent: toInquirySummary,
      },
      {
        icon: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_dianzichufang.png",
        title: "电子处方",
        defaultText: "查看本次问诊处方结果",
        clickEvent: toEPrescribing,
      },
      {
        icon: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_fuzenjilu.png",
        title: "复诊记录",
        defaultText: "查看本次复诊记录",
        clickEvent: toRepeatRecord,
      },
    ];
    if (role === Role.DOCTOR) {
      if (orderInfo?.orderStatus === InquirStatus.Finish) {
        //订单完成才显示问诊评价
        list.unshift({
          icon: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_wenzenpingjia.png",
          title: "问诊评价",
          defaultText: "查看本次问诊评价",
          clickEvent: toComment,
        });
      }
    } else {
      list.unshift({
        icon: "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_wenzenpingjia.png",
        title: "问诊评价",
        defaultText:
          orderInfo?.orderStatus === InquirStatus.Finish
            ? "查看本次问诊评价"
            : "去评价本次问诊",
        clickEvent: toComment,
      });
    }
    return list;
  }, [orderInfo.orderStatus]);
  const commentList = ["非常差", "差", "一般", "好", "非常好"];

  return (
    <>
      {cardList?.map((item) => (
        <div
          className="inquiry-info-items"
          key={item.title}
          onClick={item?.clickEvent}
        >
          <div className="card-item-left">
            <Image className="card-image width-36 height-36" src={item.icon} />
            <span className="card-item-title">{item.title}</span>
            <span className="card-item-default">{item.defaultText}</span>
          </div>
          <RightOutline fontSize={18} />
        </div>
      ))}

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          paddingBottom: "50px",
        }}
      >
        <div className="inquiry_comment_popu padding-left-16 padding-right-16">
          <div className="comment_popu_header">
            <div className="icon_close" onClick={() => setVisible(false)}>
              <CloseOutline fontSize={18} />
            </div>
            <span className="comment_popu_title">问诊评价</span>
          </div>
          <div className="margin-top-50">
            {orderInfo.orderStatus === InquirStatus.Evaluate
              ? "请对此次问诊进行评价"
              : "感谢您对我们进行评价"}
          </div>
          <div className="comment_popu_stars">
            {commentList.map((item, index) => {
              return (
                <div
                  className="comment-star-item"
                  onClick={() =>
                    orderInfo.orderStatus === InquirStatus.Evaluate &&
                    setStartCount(index + 1)
                  }
                  key={item}
                >
                  <StarFill
                    key={index}
                    fontSize={24}
                    color={index + 1 <= startCount ? "#FF9200" : "#D8D8D8"}
                  />
                  <span className="comment-item-text">{item}</span>
                </div>
              );
            })}
          </div>
          {orderInfo.orderStatus === InquirStatus.Evaluate && (
            <Button
              block
              color="primary"
              className="margin-left-16 margin-right-16 margin-top-44"
              onClick={submitComment}
            >
              提交评价
            </Button>
          )}
        </div>
      </Popup>
    </>
  );
}
InquiryInfoItems.propTypes = {};
export default InquiryInfoItems;
