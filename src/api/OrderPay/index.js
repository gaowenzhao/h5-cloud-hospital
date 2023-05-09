import request from "@/utils/axios";

/**
 * @description: 根据主键ID获取订单详情
 * @param {string} cloudroomOrderId: 订单主键 id
 * @return {=================}
 * @return {integer} arrangeBankId:	预约库存id
 * @return {integer} cloudroomOrderId:	主键
 * @return {integer} costNum:	支付费用
 * @return {string} costTime:	支付时间	string
 * @return {string} costType:	支付类型	string
 * @return {string} createTime:	创建时间	string
 * @return {string} diagnoseType:	问诊类型	string
 * @return {string} diseaseDesc:	疾病描述	string
 * @return {string} doctorAccount:	医生工号	string
 * @return {integer} doctorId:	预约医生id
 * @return {string} doctorName:	预约医生	string
 * @return {string} hospital:	就诊医院	string
 * @return {integer} hzmyd:	患者满意度
 * @return {boolean} isDeleted:	删除标识	boolean
 * @return {integer} keshiId:	科室id
 * @return {string} keshiName:	预约科室	string
 * @return {integer} millisLong:	从提交时间到现在的毫秒数
 * @return {string} mobile:	手机号	string
 * @return {string} orderCostNo:	订单支付编号	string
 * @return {string} orderNo:	订单号	string
 * @return {string} orderStatus:	订单状态:1.待支付 2.待开始 3.问诊中 4.待评价 5.已完成 10.已取消	string
 * @return {integer} patientId:	就诊人id
 * @return {string} patientName:	就诊人	string
 * @return {string} prepareDate:	预约日期	string
 * @return {string} prepareStartTime:	预约开始时间	string
 * @return {string} prepareTimeSlot:	预约时间段	string
 * @return {integer} registerOrder:	取号排序
 * @return {string} reportFile:	报告附件	string
 * @return {string} updateTime:	更新时间	string
 * @return {integer} userId:	发起人id
 */
export const cloudroomOrderGetById = (data = { cloudroomOrderId: "" }) => {
  return request.post({
    url: "/cloudroom/api/cloudroomOrder/getById",
    data,
  });
};
