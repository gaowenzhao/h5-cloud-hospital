/**问诊小结相关的 */
import request from "@/utils/axios";
/**
 * @description: 增加问诊小结
 * @param {string} cloudroomOrderId:订单ID
 * @param {string} cloudroomDiagnoseContent：诊断内容
 * @param {string} cloudroomDiagnoseSuggest：诊断建议
 * @param {string} cloudroomDiagnoseAllergy?：过敏史（如果有就填写，为空即是无）
 * @param {string} resultList:诊断结果
 * @returns
 */
export function diagnoseAdd(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomDiagnose/add",
    data,
  });
}
/**
 * @description: 获取问诊小结
 * @param {sting} cloudroomDiagnoseId：问诊小结的主键Id
 * @returns
 */
export function diagnoseInfoById(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomDiagnose/getById",
    data,
  });
}

/**
 * @description: 获取问诊小结
 * @param {sting} cloudroomOrderId：订单Id
 * @returns
 */
export function diagnoseInfoByKeyWord(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomDiagnose/getByKeyWord",
    data,
  });
}

/**
 * 获取问诊卡片的接口
 * @param {*} data
 * @returns
 */
export function getInquiryCardByOrderId(data = {}) {
  return request.post({
    url: "/cloudroom/api/message/getById",
    data,
  });
}
