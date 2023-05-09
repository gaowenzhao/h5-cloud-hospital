import {
  useLocation,
  useNavigate,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";
import { Button, Avatar } from "antd-mobile";
import StatusSuccess from "@/assets/images/status-success.png";
import StatusError from "@/assets/images/status-error.png";
import { useEffect, useRef, useState } from "react";
function OrderPayStatus() {
  const [state, setState] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setState(location.state || {});
  }, []);

  const toRecords = () => {
    blockerRef.current = "";
    navigate("/home", { replace: true });
  };

  // 监听路由变化
  const blockerRef = useRef("1");
  const blocker = useBlocker(!!blockerRef.current);
  // 支付提示 弹框的 次数 当次数 为 0 的时候 才 提示 大于0 说明已经 展示 提示 了
  // const dialogrNumRef = useRef(0);

  useEffect(() => {
    handleBlocker();
  }, [blocker]);

  const handleBlocker = () => {
    if (blocker && blocker.state === "blocked" && !blockerRef.current) {
      blocker && blocker.proceed && blocker.proceed();
    }
    // else {
    //   if (dialogrNumRef.current > 0) {
    //     inquireSummaryEnd();
    //   } else {
    //     dialogrNumRef.current = 1;
    //   }
    // }
    console.log("🚀 blockerRef: 进来了这里");
  };
  return (
    <div className="OrderPayStatus padding-12">
      <div className="bolder-radius-8 bg-color-ffffff padding-top-50 padding-bottom-70">
        {state.status == "fail" ? (
          <div className="text-align-center">
            <img
              src={StatusError}
              className="width-160 height-160 margin-0-auto"
            />
            <div className="font-bold line-height-22 margin-tb-10 text-align-center font-size-17">
              支付失败
            </div>
            <div className="text-align-center font-size-14 color-171a1d99 line-height-22">
              <div>请查问诊记录，重新支付</div>
            </div>
          </div>
        ) : null}
        {state.status == "success" ? (
          <div className="text-align-center">
            <img
              src={StatusSuccess}
              className="width-160 height-160 margin-0-auto"
            />
            <div className="font-bold line-height-22 margin-tb-10 text-align-center font-size-17">
              预约成功
            </div>
            <div className="text-align-center font-size-14 color-171a1d99 line-height-22">
              <div>医生将在预约时间发起视频邀请</div>
              <div>请您留意问诊时间，留意消息通知</div>
            </div>
          </div>
        ) : null}
        <div className="text-align-center padding-top-18">
          <Button
            color="primary"
            className="height-44 border-radius-8 font-size-17 padding-lr-40"
            onClick={toRecords}
          >
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderPayStatus;
