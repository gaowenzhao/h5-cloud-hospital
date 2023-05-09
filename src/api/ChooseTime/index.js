import request from "@/utils/axios";

/**
 * @description: 获取医生排班列表(接下来的七天不分页)
 * @param {string} arrangeDateStr: 排班日期：YYYY-MM-DD
 * @param {integer} cloudroomArrangeId: 主键
 * @param {string} doctorId: ! 医生id
 * @param {integer} currentNum: 页码
 * @param {integer} size: 数量
 * @return {=================}
 * @return {string} arrangeBeginTime	排班开始时间
 * @return {string} arrangeDate	排班日期
 * @return {string} arrangeTimeslot	排班时间段
 * @return {integer} cloudroomArrangeId	主键
 * @return {string} createTime	创建时间
 * @return {string} doctorAccount	医生工号
 * @return {string} doctorName	医生姓名
 * @return {integer} hospitalArrangeId	院内排班表id
 * @return {boolean} isDeleted	删除标识
 * @return {string} status	状态：可预约|约满
 * @return {integer} totalNum	总号数
 * @return {string} weekDay	星期
 */

export const cloudroomArrangeList = (data = { currentNum: 1, size: 10 }) => {
  return request.post({
    url: "/cloudroom/api/cloudroomArrange/list",
    data,
  });
};


/**
 * @description: 通过主键ID获取时段
 * @param {string} arrangeDateStr: ! 排班日期：YYYY-MM-DD
 * @param {integer} cloudroomArrangeId: 主键
 * @param {string} doctorId: ! 医生id
 * @param {integer} currentNum: 页码
 * @param {integer} size: 数量
 * @return {=================}
 * @return {string} date	2023-03-24 星期五 上午
 * @return {object[]} timeList	排班日期
 * @return {string} num	剩余可预约数量
 * @return {integer} time	时间段
 */

export const cloudroomArrangeTimeList = (data = { cloudroomArrangeId: '',arrangeDateStr:'' }) => {
  return request.post({
    url: "/cloudroom/api/cloudroomArrange/timeList",
    data,
  });
};

