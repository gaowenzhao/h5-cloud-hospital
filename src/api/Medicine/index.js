import request from "@/utils/axios";

/**
 * @description: 增加云诊室订单
 * @param {integer} cloudroomMedicineId	药品主键ID
 * @return {=================}
 * @return {integer} cloudroomMedicineId	药品主键ID	
 * @return {integer} cloudroomMedicineSpec	主键ID	
 * @return {string} createTime	创建时间
 * @return {string} remark	备注
 * @return {string} specName	规格名称：瓶|盒|粒
 * @return {string} tbStatus	记录状态:正常:正常;删除:删除;	
 * @return {string} updateTime	更新时间
 */

export const getByMedicineId = (data = {}) => {
  return request.post({
    url: "/cloudroom/api/cloudroomMedicineSpec/getByMedicineId",
    data,
  });
};

