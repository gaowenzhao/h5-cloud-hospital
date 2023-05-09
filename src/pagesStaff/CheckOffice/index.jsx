/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-23 10:17:04
 * @LastEditors: gaowenzhao lu7025199@163.com
 * @LastEditTime: 2023-03-23 10:48:05
 * @FilePath: \h5-cloud-hospital\src\pages\CheckOffice\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Image } from "antd-mobile";
import PropTypes from "prop-types";
import { RightOutline } from "antd-mobile-icons";
import "./index.scss";
function CheckOffice(props) {
  const currentLocation = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const navigate = useNavigate();
  const icon_checkout =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_checkoffice_checkout.png";
  const icon_kaidan =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_checkout_kaidan.png";
  const toCheckoutList = () => {
    navigate(`/checkList?patientId=${patientId}`);
  };
  return (
    <div className="check-office">
      <div
        className="padding-16 bg-color-ffffff flex border-radius-12 align-center position-relative"
        onClick={toCheckoutList}
      >
        <Image src={icon_checkout} className="width-22 height-22" />
        <span className="margin-left-24">检验查询</span>
        <RightOutline className="position-absolute position-right-10" />
      </div>

      <div className="padding-16 bg-color-ffffff margin-top-12 flex border-radius-12 align-center position-relative">
        <Image src={icon_kaidan} className="width-22 height-22" />
        <span className="margin-left-24">检验开单</span>
        <RightOutline className="position-absolute position-right-10" />
      </div>
    </div>
  );
}
CheckOffice.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default CheckOffice;
