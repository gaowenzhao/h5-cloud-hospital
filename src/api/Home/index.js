import request from "@/utils/axios";

/**
 * @description: 用户列表
 * @param {number} currentNum: 页码
 * @param {number} size:: 页数
 * @return {*}
 */
export const getPatientList = (data = { currentNum: 1, size: 30 }) => {
  return request.post({
    url: "/cloudroom/api/patient/getPatientList",
    data,
  });
};

/**
 * @description: 获取就诊人ID
 * @param {*} patientId: 用户id
 * @return {*}
 */
export const getPatientInfo = (data = { patientId: '' }) => {
  return request.post({
    url: "/cloudroom/api/patient/getPatientInfo",
    data,
  });
};

/**
 * @description: 获取云诊室订单列表
 * @param {string} orderStatus: 订单状态 :1.待支付 2.待开始 3.问诊中 4.待评价 5.已完成 10.已取消
 * @param {string[]} statusList: 	状态列表	
 * @param {number} currentNum: 页码
 * @param {number} size: 页数
 * @return {=================================}
 * @return {integer} arrangeBankId	预约库存id
 * @return {integer} cloudroomOrderId	主键
 * @return {integer} costNum	支付费用
 * @return {string} costTime	支付时间	
 * @return {string} costType	支付类型	
 * @return {string} createTime	创建时间
 * @return {string} diagnoseType	问诊类型
 * @return {string} diseaseDesc	疾病描述
 * @return {string} doctorAccount	医生工号
 * @return {integer} doctorId	预约医生id
 * @return {string} doctorName	预约医生	
 * @return {string} hospital	就诊医院
 * @return {integer} hzmyd	患者满意度
 * @return {boolean} isDeleted	删除标识	
 * @return {integer} keshiId	科室id
 * @return {string} keshiName	预约科室	
 * @return {integer} millisLong	从提交时间到现在的毫秒数	
 * @return {integer} mobile	手机号
 * @return {string} orderCostNo	订单支付编号	
 * @return {string} orderNo	订单号	
 * @return {integer} orderStatus	订单状态 :1.待支付 2.待开始 3.问诊中 4.待评价 5.已完成 10.已取消
 * @return {integer} patientId	就诊人id
 * @return {string} patientName	就诊人	
 * @return {string} prepareDate	预约日期	
 * @return {string} prepareStartTime	预约开始时间	
 * @return {string} prepareTimeSlot	预约时间段
 * @return {integer} registerOrder	取号排序
 * @return {string} reportFile	报告附件	
 * @return {string} updateTime	更新时间
 * @return {integer} userId	发起人id
 */
export const cloudroomOrderList = (data = { currentNum: 1, size: 10 }) => {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/list",
    data,
  });
};
