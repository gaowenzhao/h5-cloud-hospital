/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-18 21:05:17
 * @LastEditors: gaowenzhao lu7025199@163.com
 * @LastEditTime: 2023-03-23 09:17:13
 * @FilePath: \h5-cloud-hospital\src\constant\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const InquirStatus = {
  ToPay: "待支付", //待支付
  ToBeStarted: "待开始", //待开始
  Inquiring: "问诊中", //问诊中
  Evaluate: "待评价", //待评价
  Finish: "已完成", //已经完成
  Canceled: "已取消", //已取消
};

export const Role = {
  USER: "user",
  DOCTOR: "worker",
  CHECKER: "checker",
};

export const CheckStatus = {
  Reject: "已驳回",
  Approval: "已审核",
  ToBeReviewed: "待审核",
  Recalled: "已撤回",
  CanEdit: "可编辑",
  ToBeSign: "待签名",
};
