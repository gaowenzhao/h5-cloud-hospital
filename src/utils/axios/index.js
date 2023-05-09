import { service } from "./service";

import { config } from "./config";

const { default_headers, default_app_id } = config;

const request = (option) => {
  const { url, method, params, data, headersType, responseType, appId } =
    option;
  return service({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      "Content-Type": headersType || default_headers,
      appId: appId || default_app_id,
    },
  });
};
export default {
  get: async (option) => {
    const res = await request({ method: "GET", ...option });
    return res;
  },
  post: async (option) => {
    const res = await request({ method: "POST", ...option });
    return res;
  },
  postOriginal: async (option) => {
    const res = await request({ method: "POST", ...option });
    return res;
  },
  delete: async (option) => {
    const res = await request({ method: "DELETE", ...option });
    return res;
  },
  put: async (option) => {
    const res = await request({ method: "PUT", ...option });
    return res;
  },
  download: async (option) => {
    const res = await request({
      method: "GET",
      responseType: "blob",
      ...option,
    });
    return res;
  },
  upload: async (option) => {
    option.headersType = "multipart/form-data";
    const res = await request({ method: "POST", ...option });
    return res;
  },
};
