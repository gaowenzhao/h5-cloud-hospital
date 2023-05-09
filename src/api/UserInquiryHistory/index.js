/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-16 16:34:32
 * @LastEditors: gaowenzhao lu7025199@163.com
 * @LastEditTime: 2023-03-23 15:43:45
 * @FilePath: \h5-cloud-hospital\src\api\UserInquiryHistory\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/utils/axios";
/**
 * 获取订单列表
 * @param {*} data
 * @returns
 */
export function inquiryListApi(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/list",
    data,
  });
}
/**
 * 获取订单详情
 * @param {cloudroomOrderId} string
 * @returns
 */
export function userInquiryDetailApi(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/getById",
    data,
  });
}
/**
 * 更新订单状态
 * @param {*} data
 * @returns
 */
export function updateOrderStatus(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/updateStatus",
    data,
  });
}
/**
 * @param {cloudroomOrderId} number
 * @param {remark} string
 */
export function cancelOrderApi(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/cancelOrder",
    data,
  });
}
/**
 * 增加医生评价
 */
export function addDoctorJudge(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomDoctorJudge/add",
    data,
  });
}
/**
 * 发起问诊
 * @param {} data
 * @returns
 */
export function startInquiry(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/start",
    data,
  });
}
/**
 *  前面等待的人
 * @param {} data
 * @returns
 */
export function getWaitNum(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/getWaitNum",
    data,
  });
}
