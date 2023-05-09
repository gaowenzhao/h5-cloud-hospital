import request from "@/utils/axios";

/**
 * @description: 获取医生列表
 * @param {string} date: 排班日期：YYYY-MM-DD
 * @param {integer} doctorId: 医生工号
 * @param {string} doctorName: 医生姓名
 * @param {integer} currentNum: 页码
 * @param {integer} size: 数量
 * @return {=================}
 * @return {string} avatar:	头像或者封面
 * @return {string} desc:	医生描述 擅长儿科几十年
 * @return {integer} doctorId:	医生id
 * @return {string} doctorName:	医生名称
 * @return {string} doctorTag:	处方
 * @return {string} doctorTagId:	处方id
 * @return {string} doctorTitle:	主任医师
 * @return {string} doctorTitleId:	主任医师id
 * @return {string} grade:	评分
 * @return {integer} hospitalId:	医院id
 * @return {string} hospitalName:	医院名称
 * @return {string} officesName:	科室名称
 * @return {string} officeslId:	科室id
 * @return {integer} orderAmount:	接诊量 订单量
 * @return {string} price:	价格
 * @return {string} status:	状态 是否 可预约
 */
export const doctorList = (data = { currentNum: 1, size: 10 }) => {
  return request.post({
    url: "/cloudroom/api/doctor/list",
    data,
  });
};
/**
 * @description: 获取单个医生
 * @param {integer} doctorId: 医生工号
 * @return {=================}
 * @return {string} avatar:	头像或者封面
 * @return {string} desc:	医生描述 擅长儿科几十年
 * @return {integer} doctorId:	医生id
 * @return {string} doctorName:	医生名称
 * @return {string} doctorTag:	处方
 * @return {string} doctorTagId:	处方id
 * @return {string} doctorTitle:	主任医师
 * @return {string} doctorTitleId:	主任医师id
 * @return {string} grade:	评分
 * @return {integer} hospitalId:	医院id
 * @return {string} hospitalName:	医院名称
 * @return {string} officesName:	科室名称
 * @return {string} officeslId:	科室id
 * @return {integer} orderAmount:	接诊量 订单量
 * @return {string} price:	价格
 * @return {string} status:	状态 是否 可预约
 */
export const getByDoctorId = (data = { doctorId: 0 }) => {
  return request.post({
    url: "/cloudroom/api/doctor/getByDoctorId",
    data,
  });
};

/**
 * @description: 获取医院内医生排班列表
 * @param {string} banbie:?班别
 * @param {string} beginTime:?开始时间
 * @param {integer} cloudroomHospitalArrangeId:?主键
 * @param {number} currentNum:?页码
 * @param {string} czsj:?操作时间
 * @param {string} endTime:?结束时间
 * @param {string} generateTime:?生成时间
 * @param {string} ghlb:?挂号类别
 * @param {string} hospitalId:?院内ID
 * @param {boolean} isGenerated:?是否已生成排班
 * @param {integer} jiange:?间隔分钟数
 * @param {string} jssj:?结束时间
 * @param {string} kssj:?开始时间
 * @param {string} orderSort:?排序[ASC|DESC(默认DESC)]
 * @param {string} rq?日期:
 * @param {integer} size:?数量
 * @param {string} ysgh:?医生工号
 * @param {string} ysxm:?医生姓名
 * @return {==========================}
 * @return {}
 */
export const cloudroomHospitalArrangeList = (
  data = { currentNum: 1, size: 10 }
) => {
  return request.post({
    url: "/cloudroom/api/cloudroomHospitalArrange/list",
    data,
  });
};
