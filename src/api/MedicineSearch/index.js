import request from "@/utils/axios";

/**
 * @description: 获取药品列表
 * @param {string} beginTime	开始时间
 * @param {integer} cloudroomMedicineId	主键ID
 * @param {string} createTime	创建时间
 * @param {integer} currentNum	页码
 * @param {string} medicineName	药品名称
 * @param {string} size	数量
 * @param {string} endTime	结束时间
 * @param {string} remark	备注
 * @param {string} orderSort	排序[ASC|DESC(默认DESC)]
 * @param {integer} tbStatus	记录状态:正常:正常;删除:删除;
 * @return {=================}
 * @return {integer} cloudroomMedicineId:		主键ID
 * @return {string} medicineName:		药品名称
 * @return {integer} remark:		备注
 * @return {string} tbStatus:		记录状态:正常:正常;删除:删除;
 * @return {string} updateTime:	更新时间
 */

export const cloudroomMedicineList = (data = { currentNum: 1, size: 10 }) => {
  return request.post({
    url: "/cloudroom/api/cloudroomMedicine/list",
    data,
  });
};