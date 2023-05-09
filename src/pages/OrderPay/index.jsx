import {
  useNavigate,
  useLocation,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";
import { Button, Dialog } from "antd-mobile";
import { orderPayByApp, resetOrderPayPromiseIng } from "@/utils/appGlobal";
import { cloudroomOrderGetById } from "@/api/OrderPay";
import { useEffect, useRef, useState } from "react";
import { debounce, fractionalConversionYuan, sleep } from "@/utils/common";
function OrderPay() {
  const navigate = useNavigate();
  const location = useLocation();
  // 医生信息
  const [orderDetail, setOrderDetail] = useState({});
  // 17:YZD20230322145657001
  // 18:YZD20230322153625001
  useEffect(() => {
    cloudroomOrderGetById({
      cloudroomOrderId: location.state.cloudroomOrderId,
    }).then((res) => {
      setOrderDetail(res.data);
    });
  }, []);
  // const orderDetail = {
  //   cloudroomOrderId: 17,
  //   userId: 22688,
  //   patientId: 45656,
  //   patientName: "就诊人",
  //   mobile: "13802417831",
  //   hospital: "就诊医院",
  //   keshiId: 12312366,
  //   keshiName: "预约科室",
  //   doctorId: 123123,
  //   doctorName: "预约医生",
  //   doctorAccount: "456456",
  //   diagnoseType: "1",
  //   prepareDate: "2023-03-22",
  //   prepareStartTime: "09:00",
  //   prepareTimeSlot: "09:00-10:00",
  //   arrangeBankId: 2,
  //   diseaseDesc: "问诊",
  //   costType: "1",
  //   costNum: 1,
  //   costTime: null,
  //   reportFile: "",
  //   registerOrder: 8,
  //   orderNo: "YZD20230322145657001",
  //   orderCostNo: null,
  //   orderStatus: "1",
  //   hzmyd: 0,
  //   createTime: null,
  //   updateTime: null,
  //   isDeleted: null,
  // };
  // const PayAmount = () => {
  //   const pay_amount = `${orderDetail.costNum}`.padStart(3, "0");
  //   const money = `${pay_amount.slice(
  //     0,
  //     pay_amount.length - 2
  //   )}.${pay_amount.slice(pay_amount.length - 2)}`;
  //   return <>{money || ''}</>;
  // };

  // 支付状态记录 有值的情况就 不用 拦截路由跳转
  const statusRef = useRef("");

  // 监听路由变化
  const blockerRef = useRef("1");
  const blocker = useBlocker(!!blockerRef.current);
  // 支付提示 弹框的 次数 当次数 为 0 的时候 才 提示 大于0 说明已经 展示 提示 了
  const dialogrNumRef = useRef(0);

  useEffect(() => {
    handleBlocker();
  }, [blocker]);

  const handleBlocker = () => {
    // statusRef.current 没有点击过 支付按钮 就是 空
    if (blocker && blocker.state === "blocked" && !statusRef.current) {
      if (dialogrNumRef.current > 0) {
        return;
      }
      Dialog.show({
        content: (
          <div className="text-align-center font-bold font-size-17">
            您的预约还未完成支付，请尽快支付！
          </div>
        ),
        closeOnAction: true,
        actions: [
          [
            {
              key: "cancel",
              text: "继续支付",
              className: "color-171a1d font-size-17",
              onClick: () => {
                dialogrNumRef.current = 0;
                blocker && blocker.reset && blocker.reset();
              },
            },
            {
              key: "delete",
              text: "确认离开",
              className: "color-007fff font-size-17",
              onClick: () => {
                dialogrNumRef.current = 0;
                blocker && blocker.proceed && blocker.proceed();
                blockerRef.current = "";
              },
            },
          ],
        ],
      });
      dialogrNumRef.current = 1;
    }
    // 点击了 支付 按钮 并且 成功 了 或者 失败了 状态已经变更 可以直接放行
    if (statusRef.current) {
      blocker && blocker.proceed && blocker.proceed();
      blockerRef.current = "";
    }
    console.log("🚀 blockerRef: 进来了这里");
  };

  // 支付 按钮
  const handleSubmit = debounce(() => {
    // const pay_amount = `${orderDetail.costNum}`.padStart(3, "0");
    // 重置
    resetOrderPayPromiseIng();
    orderPayByApp({
      // 支付内容
      body: `云诊断-订单`,
      // 订单编号
      order_id: `${orderDetail.cloudroomOrderId}`,
      order_source: `云诊断`,
      // 支付金额
      pay_amount: fractionalConversionYuan(orderDetail.costNum),
      // `${pay_amount.slice(
      //   0,
      //   pay_amount.length - 2
      // )}.${pay_amount.slice(pay_amount.length - 2)}`,
      // pay_amount: `${orderDetail.costNum}`,
      // 订单编号
      order_no: `${orderDetail.orderNo}`,
    }).then((res) => {
      console.log("🚀 handleSubmit ~ res:", res);
      if (res && (res.status == "success" || res.status == "fail")) {
        statusRef.current = "success";

        navigate("/orderPayStatus", {
          state: {
            status: res.status,
            order_id: `${orderDetail.cloudroomOrderId}`,
            order_no: `${orderDetail.orderNo}`,
          },
          replace: true,
        });
      }
    });
  }, 500);

  return (
    <div className="OrderPay padding-12">
      <div className="padding-lr-12 border-radius-8 bg-color-ffffff margin-bottom-12">
        <div className="padding-tb-16 flex align-center font-size-17 line-height-22">
          <div className="width-130 font-bold">预约科室</div>
          <div className="flex-sub">
            {orderDetail.keshiName || orderDetail.officesName || ""}
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-tb-16 flex align-center font-size-17 line-height-22">
          <div className="width-130 font-bold">问诊类型</div>
          <div className="flex-sub">视频问诊</div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-tb-16 flex align-center font-size-17 line-height-22">
          <div className="width-130 font-bold">预约时间</div>
          <div className="flex-sub">
            <div>{orderDetail.prepareDate || ""}</div>
            <div>{orderDetail.prepareTimeSlot || ""}</div>
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-tb-16 flex align-center font-size-17 line-height-22">
          <div className="flex-sub text-align-right">应付款</div>
          <div className="padding-left-10 font-bold color-ff5219">
            ¥{fractionalConversionYuan(orderDetail.costNum)}
            {/* <PayAmount /> */}
          </div>
        </div>
      </div>
      <div className="font-size-14 padding-14 line-height-22">
        已完成提交订单，请在 <span className="color-ff5219">30:00</span>{" "}
        内完成交费，否则系统自动取消该订单
      </div>

      <div className="padding-46"></div>
      {/* 底部 按钮 开始 */}
      <div className="height-66 padding-tb-12 padding-lr-16 position-fixed position-left-0 position-bottom-0 bg-color-ffffff position-right-0">
        <Button
          block
          color="primary"
          className="height-44 border-radius-8 font-size-17"
          onClick={() => {
            handleSubmit();
          }}
        >
          支付
        </Button>
      </div>
      {/* 底部 按钮 结束 */}
    </div>
  );
}

export default OrderPay;
