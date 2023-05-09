import request from "@/utils/axios";

/**
 * @description: 增加云诊室订单
 * @param {string} cloudroomArrangeId: 排班表id
 * @param {string} costNum: 支付费用
 * @param {string} costType: 支付类型
 * @param {string} diagnoseType: 问诊类型
 * @param {string} diseaseDesc: 疾病描述
 * @param {string} doctorAccount: 医生工号
 * @param {string} doctorId: 预约医生id
 * @param {string} doctorName: 预约医生
 * @param {string} hospital: 就诊医院
 * @param {string} keshiId: 科室id
 * @param {string} keshiName: 预约科室
 * @param {string} mobile: 手机号
 * @param {string} orderNo: 订单号
 * @param {string} patientId: 就诊人id
 * @param {string} patientName: 就诊人
 * @param {string} prepareDate: 预约日期 YYYY-MM-DD
 * @param {string} prepareStartTime: 预约开始时间
 * @param {string} prepareTimeSlot: 预约时间段
 * @param {string} reportFile: 报告附件
 * @param {string} userId: 发起人id
 * @return 
 */

export const cloudroomOrderAdd = (data = {}) => {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/add",
    data,
  });
};
// 上传多媒体信息(图片|视频)
export const mediaInfoUpload = (data = {}) => {
  return request.upload({
    url: "/multimedia/api/mediaInfo/upload",
    data,
  });
};

