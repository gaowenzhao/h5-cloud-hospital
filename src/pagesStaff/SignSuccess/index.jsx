import {
  useLocation,
  useNavigate,
  unstable_useBlocker as useBlocker,
  useSearchParams,
} from "react-router-dom";
import { Button, Avatar } from "antd-mobile";
import StatusSuccess from "@/assets/images/status-success.png";
import StatusError from "@/assets/images/status-error.png";
import { useEffect, useState, useRef } from "react";
import { inquireSummaryEnd } from "@/utils/appGlobal";
import { Role } from "@/constant";
function OrderPayStatus() {
  const [urlSearch, setUrlSearch] = useSearchParams();
  const navigate = useNavigate();
  const role = urlSearch.get("role");
  const toPage = () => {
    if (role === Role.CHECKER) {
      console.log("role", role);
      navigate("/prescriptionVerify");
    } else {
      inquireSummaryEnd();
    }
  };

  return (
    <div className="OrderPayStatus padding-12">
      <div className="bolder-radius-8 bg-color-ffffff padding-top-50 padding-bottom-70">
        <div className="text-align-center">
          <img
            src={StatusSuccess}
            className="width-160 height-160 margin-0-auto"
          />
          <div className="font-bold line-height-22 margin-tb-10 text-align-center font-size-17">
            {role === Role.CHECKER
              ? "签名成功并审核通过"
              : "签名成功并提交审核"}
          </div>
        </div>
        <div className="text-align-center padding-top-18">
          <Button
            color="primary"
            className="height-44 border-radius-8 font-size-17 padding-lr-40"
            onClick={toPage}
          >
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderPayStatus;
