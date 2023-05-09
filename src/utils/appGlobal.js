import { Role } from "@/constant";

const u = navigator.userAgent;
// const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//  app 回调 js  ： 安卓 ：iso
// appGetUserInfo : app.getUserInfo ：iosAppGetUserInfo 获取用户信息
// appIntoChartRoom : app.intoChartRoom : iosAppIntoChartRoom 进去 聊天室
// appPayResult: app.orderPay ： iosAppOrderPay 支付回调
// appChoosePatient : app.choosePatient : iosAppChoosePatient 选择 就诊人

let getUserInfoPromiseIng = null;
window.appGetUserInfo = (res = {}) => {
  if (typeof res == "string") {
    res = JSON.parse(res);
  }
  getUserInfoPromiseIng(res);
  getUserInfoPromiseIng = null;
  return "123";
};
// 获取用户信息 token
/*  */
export const getUserInfoByApp = () => {
  if (getUserInfoPromiseIng) {
    return;
  }
  return new Promise((resolve, reject) => {
    if (isiOS || (window.app && window.app.getUserInfo)) {
      if (isiOS) {
        window.webkit.messageHandlers.iosAppGetUserInfo.postMessage("");
      } else {
        window.app.getUserInfo();
      }
      getUserInfoPromiseIng = resolve;
    } else {
      reject();
    }
  });
};

/**
 * @description: 跳转到 聊天室
 * @param {string} target_id: 用户ID
 * @param {string} target_jg_id: 极光id
 * @param {string} app_key: 极光key
 * @param {string} user_name: 用户名
 * @param {string} order_id: 云诊断订单号
 * @return {*}
 */
export const intoChartRoomByApp = (
  params = {
    target_id: "",
    target_jg_id: "",
    jgImId: "",
    app_key: "",
    user_name: "",
    order_id: "",
    diseaseDesc: "",
  }
) => {
  return new Promise((resolve, reject) => {
    if (isiOS || (window.app && window.app.intoChatRoom)) {
      console.log("params", params);
      const paramsStringify = JSON.stringify(params);
      if (isiOS) {
        window.webkit.messageHandlers.iosAppIntoChatRoom.postMessage(
          paramsStringify
        );
      } else {
        window.app.intoChatRoom(paramsStringify);
      }
      resolve();
    } else {
      reject();
    }
  });
};

export const h5ToChatRoom = (dataSource, role) => {
  return intoChartRoomByApp({
    gid: dataSource?.gid,
    target_id:
      role === Role.USER
        ? `${dataSource?.doctorId}`
        : `${dataSource?.patientId}`,
    // target_jg_id: dataSource?.targetJgId,
    // jgImId: dataSource?.jgImId,
    app_key:
      role === role.user ? dataSource?.userappkey : dataSource?.workappkey,
    user_name:
      role === Role.USER ? dataSource?.doctorName : dataSource?.patientName,
    order_id: `${dataSource?.cloudroomOrderId}`,
    diseaseDesc: dataSource?.diseaseDesc,
  });
};

//开处方/问诊小结成功后 结束关闭webview页面
export const inquireSummaryEnd = () => {
  console.log("🚀inquireSummaryEnd");
  if (isiOS) {
    console.log("🚀inquireSummaryEnd", 1);
    window.webkit.messageHandlers.InquireSummaryEnd.postMessage("");
  } else {
    console.log("🚀inquireSummaryEnd", 2);
    console.log("window", window);
    if (window.app && window.app.InquireSummaryEnd) {
      console.log("🚀inquireSummaryEnd", 3);
      window.app.InquireSummaryEnd();
    }
  }
};

let orderPayPromiseIng = null;
/**
 * @description: 重置 orderPayPromiseIng
 * @return {*}
 */
export const resetOrderPayPromiseIng = () => {
  orderPayPromiseIng = null;
};
// status : success 成功  fail 失败 cancel 取消支付
window.appPayResult = (res = { status: "" }) => {
  console.log(
    "🚀 ~ file: appGlobal.js:137 ~ orderPayPromiseIng:3",
    orderPayPromiseIng
  );
  if (typeof res == "string") {
    res = JSON.parse(res);
  }
  orderPayPromiseIng(res);
  orderPayPromiseIng = null;
};
/**
 * @description: 订单支付
 * @param {string} body: 支付内容
 * @param {string} order_id: 订单编号
 * @param {string} order_source: 云诊断
 * @param {string} pay_amount: 支付金额
 * @param {string} order_no: 订单编号
 * @return {*}
 */
export const orderPayByApp = (
  params = {
    body: "",
    order_id: "",
    order_source: "",
    pay_amount: "",
    order_no: "",
  }
) => {
  if (orderPayPromiseIng) {
    return;
  }
  console.log(
    "🚀 ~ file: appGlobal.js:137 ~ orderPayPromiseIng:1",
    orderPayPromiseIng
  );
  const paramsStringify = JSON.stringify(params);
  return new Promise((resolve, reject) => {
    if (isiOS || (window.app && window.app.orderPay)) {
      if (isiOS) {
        console.log("发起支付", isiOS);
        // window.webkit.messageHandlers.iosAppOrderPay.postMessage("");
        window.webkit.messageHandlers.iosAppOrderPay.postMessage(
          paramsStringify
        );
      } else {
        window.app.orderPay(paramsStringify);
      }
      orderPayPromiseIng = resolve;
    } else {
      reject();
    }
    console.log(
      "🚀 ~ file: appGlobal.js:137 ~ orderPayPromiseIng:2",
      orderPayPromiseIng
    );
  });
};

let choosePatientPromiseIng = null;
// patient_id : 就诊人id
window.appChoosePatient = (res = { patient_id: "" }) => {
  if (typeof res == "string") {
    res = JSON.parse(res);
  }
  choosePatientPromiseIng(res);
  choosePatientPromiseIng = null;
};
// 切换就诊人
export const choosePatientByApp = () => {
  if (choosePatientPromiseIng) {
    return;
  }
  return new Promise((resolve, reject) => {
    if (isiOS || (window.app && window.app.orderPay)) {
      if (isiOS) {
        window.webkit.messageHandlers.iosAppChoosePatient.postMessage("");
      } else {
        window.app.choosePatient();
      }
      choosePatientPromiseIng = resolve;
    } else {
      reject();
    }
  });
};
