/**
 * 处方相关的接口
 */
import request from "@/utils/axios";
/**
 * 根据主键Id获取处方
 * @param {cloudroomPrescriptId} string
 * @returns
 */
export function getPrescriptById(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomPrescript/getById",
    data,
  });
}

/**
 *
 * @param {*} data
 * @returns
 */
export function getPrescriptByKeyWord(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomPrescript/getByKeyWord",
    data,
  });
}

/**
 *@description 增加处方
 * @param {*} data
 * @returns
 */
export function prescriptAdd(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomPrescript/add",
    data,
  });
}
/**
 *
 * @param {*} data
 */
export function prescriptUpdate(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomPrescript/update",
    data,
  });
}
/**
 * 撤回处方
 * @param {} data
 * @returns
 */
export function prescriptRecall(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomPrescript/recall",
    data,
  });
}

/**
 * 医生签名
 * @param {cloudroomPrescriptId} 处方ID
 * @returns
 */
export function doctorSignApi(data = {}) {
  return request.post({
    url: "/cloudroom/api/sign/doctorSign",
    data,
  });
}

/**
 * 审核员签名
 * @param {cloudroomPrescriptId} 处方ID
 * @returns
 */
export function verifySignApi(data = {}) {
  return request.post({
    url: "/cloudroom/api/sign/verifySign",
    data,
  });
}
