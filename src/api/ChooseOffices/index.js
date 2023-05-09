import request from "@/utils/axios";

/**
 * @description: 获取组织架构树
 * @param {string} beginTime:	开始时间
 * @param {string} createTime:	创建时间
 * @param {integer} currentNum:	页码
 * @param {string} description:	详细描述
 * @param {integer} dictId:	主键
 * @param {string} dictLabel:	字典名称
 * @param {string} dictValue:	字典值
 * @param {string} endTime:	结束时间
 * @param {boolean} isDeleted:	删除标识
 * @param {string} orderSort:	排序[ASC|DESC(默认DESC)]
 * @param {integer} size:	数量
 * @param {integer} sortNo:	排序
 * @param {string} tenantId:	租户id
 * @param {string} updateTime:	更新时间
 * @return {=================}
 * @return {array} children: [],
 * @return {string} name: "科室名称",
 * @return {integer} pid: 父级id,
 * @return {integer} officesId: 科室id,
 * @return {string} status: 当前状态是否可选
 */
export const orgTree = (data = { tenantId: "" }) => {
  return request.post({
    url: "/cloudroom/api/org/tree",
    data,
  });
};
