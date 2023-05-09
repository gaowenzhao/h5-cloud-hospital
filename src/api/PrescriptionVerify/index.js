import request from "@/utils/axios";

/**
 * @description: 获取处方审核列表
 * @param {string} beginTime:	开始时间
 * @param {integer} cloudroomOrderId:	订单ID
 * @param {integer} cloudroomPrescriptId:	主键ID
 * @param {string} createTime:	创建时间
 * @param {integer} currentNum:	页码
 * @param {integer} doctorId:	医生ID
 * @param {integer} doctorSignId:	医生签名ID
 * @param {string} endTime:	结束时间
 * @param {string} logStatus:	处方状态:待审核|已审核
 * @param {integer} medicinePrice:	价格：（分）
 * @param {string} medicineSpec:	规格
 * @param {string} orderSort:	排序[ASC|DESC(默认DESC)]
 * @param {string} remark:	备注
 * @param {integer} size:	数量
 * @param {string} tbStatus:	记录状态:正常:正常;删除:删除;
 * @param {string} updateTime:	更新时间
 * @param {string} verifyId:	审核人ID
 * @param {string} verifyReason:	驳回原因
 * @param {integer} verifySignId:	审核签名ID
 * @param {string} verifyTime:	审核时间
 * @return {=================}
 * @return {integer} cloudroomOrderId:	订单ID
 * @return {integer} cloudroomPrescriptId:	主键ID
 * @return {string} createTime:	创建时间
 * @return {integer} doctorId:	医生ID
 * @return {string} doctorName:	医生姓名
 * @return {integer} doctorSignId:	医生签名ID
 * @return {string} logStatus:	处方状态:待审核|已审核
 * @return {array} medicineList:	药品列表
 * @return {integer} medicinePrice:	价格：（分）
 * @return {string} medicineSpec:	规格
 * @return {string} patientAge:	就诊认年龄
 * @return {string} patientLogo:	就诊认头像
 * @return {string} patientName:	就诊认姓名
 * @return {string} patientSex:	就诊认性别
 * @return {string} remark:	备注	string
 * @return {array} resultList:	结果列表
 * @return {string} tbStatus:	记录状态:正常:正常;删除:删除;
 * @return {string} title:	标题
 * @return {string} updateTime:	更新时间
 * @return {integer} verifyId:	审核人ID
 * @return {string} verifyReason:	驳回原因
 * @return {integer} verifySignId:	审核签名ID
 * @return {string} verifyTime:	审核时间	string
 */

export const prescriptList = (data = { logStatus: "" }) => {
  return request.post({
    url: "/cloudroom/api/cloudroomPrescript/prescriptList",
    data,
  });
};
/**
 * @description: 获取我的处方列表
 * @param {integer} size:	数量
 * @param {integer} currentNum:	页码
 * @return {*} 同 获取处方审核列表
 */
export const myPrescriptList = (data = { logStatus: "" }) => {
  return request.post({
    url: "/cloudroom/api/cloudroomPrescript/list",
    data,
  });
};

