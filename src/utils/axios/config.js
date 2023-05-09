const config = {
  /**
   * api请求基础路径
   */
  base_url: "https://devapi.jiahubao.net",

  apiFormUrl: "",
  /**
   * 接口成功返回状态码
   */
  result_code: 200,

  /**
   * 接口请求超时时间
   */
  request_timeout: 20000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: "application/json",

  /**
   * 终端 appid
   */
  default_app_id: "",
};

export { config };
