import { Button, Image } from "antd-mobile";
import PropTypes from "prop-types";
import {} from "antd-mobile-icons";
import "./index.scss";
function RefundFlow({}) {
  const RefundUrls = {
    success:
      "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_apply_success.png",
    refunding:
      "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_refundinhg.png",
  };
  return (
    <div className="refund-flow">
      <div className="refund-flow-title">退款流程</div>
      <div className="apply-refund-contain margin-top-16">
        <Image src={RefundUrls.success} className="width-24 height-24" />
        <span className="apply-refund-label">申请退款</span>
        <span className="apply-refund-time">2022-12-30 14:12</span>
      </div>
      <div className="refund-count">退款金额:￥189.9</div>
      {/* 退款中 */}
      <div className="apply-refund-contain">
        <Image src={RefundUrls.refunding} className="width-24 height-24" />
        <span className="refunding">退款中</span>
        <span className="apply-refund-time">2022-12-30 14:12</span>
      </div>
      <div className="refund-count refund-count-grey">
        退款金额退回余额中，请注意查收
      </div>
      {/* 退款成功 */}
      <div className="apply-refund-contain">
        <div className="refund-dot" />
        <span className="refund-success">退款成功</span>
      </div>
    </div>
  );
}
RefundFlow.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default RefundFlow;
