import request from "@/utils/axios";
/**
 * 获取字典列表
 * @param {*} data
 * @returns
 */
export function dictListApi(data = {}) {
  return request.post({
    url: "/cloudroom/api/dict/list",
    data,
  });
}
/**
 * 获取字典详情列表
 */
export function dictItemListApi(data = {}) {
  return request.post({
    url: "/cloudroom/api/dictItem/list",
    data,
  });
}
