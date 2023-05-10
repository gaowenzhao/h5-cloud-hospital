import request from "@/utils/axios";

export  function checkListApi(data = {}) {
  return request.post({
    url: "/cloudroom/api/cloudroomReport/list",
    data
  });
}
