import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Image, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import { RightOutline } from "antd-mobile-icons";
import "./index.scss";
import Header from "@/components/Header";
import {
  diagnoseInfoById,
  diagnoseInfoByKeyWord,
} from "@/api/CloudroomDiagnose";
import { getUrlParams } from "@/utils/common";
import { userInquiryDetailApi } from "@/api/UserInquiryHistory";

//inquireSummary?诊断cloudroomDiagnoseId 或者cloudroomOrderId
function InquireSummary(props) {
  const [dataSource, setDataSource] = useState([]);
  const [orderInfo, setOrderInfo] = useState([]);
  const currentLocation = useLocation();
  const navigate = useNavigate();
  const params = getUrlParams(currentLocation.search);
  useEffect(() => {
    getInquireSummary();
    getOrderInfo();
  }, []);
  const getOrderInfo = async () => {
    if (params?.cloudroomOrderId) {
      const response = await userInquiryDetailApi({
        cloudroomOrderId: params?.cloudroomOrderId,
      });
      setOrderInfo(response.data);
    }
  };
  const getInquireSummary = async () => {
    try {
      if (params?.cloudroomOrderId) {
        const response = await diagnoseInfoByKeyWord({
          cloudroomOrderId: params?.cloudroomOrderId,
        });
        if (response.code === 200) {
          setDataSource(response.data);
        } else {
          Toast.show(response.message);
        }
      } else {
        Toast.show("订单Id为空");
      }
    } catch (error) {
      Toast.show(error);
    }
  };
  const resultTexts = useMemo(() => {
    const texts = dataSource?.resultList?.reduce(
      (total, currentValue, index) => {
        if (index === 0) {
          return currentValue?.cloudroomDiagnoseResultDesc;
        } else {
          total += `,${currentValue?.cloudroomDiagnoseResultDesc}`;
          return total;
        }
      },
      ""
    );
    return texts;
  }, [dataSource?.resultList]);
  return (
    <div className="inquiry-summary">
      <div className="padding-16 inquiry-summary-content">
        <div className="height-80 bg-color-007fff border-radius-12">
          <div className="font-bold color-ffffff font-size-20 padding-16 opacity-8">
            <span>就诊人:</span>
            <span className="margin-left-20">{orderInfo.patientName}</span>
            <span className="margin-left-30">{orderInfo.patientSex}</span>
            <span className="margin-left-30">{orderInfo.patientAge}岁</span>
          </div>
        </div>
        <div className="flex-direction-column flex border-radius-12 bg-color-ffffff padding-16 content-card">
          <div className="font-size-17 color-171a1d font-bold padding-bottom-18 border-bottom-f2f2f2">
            主诉
          </div>
          <span className="color-171a1d99 margin-top-12 font-size-17 line-height-26">
            {dataSource?.cloudroomDiagnoseContent || "暂无主诉内容"}
          </span>
          <div className="font-size-17 color-171a1d font-bold padding-bottom-18 border-bottom-f2f2f2 margin-top-20">
            过敏史
          </div>
          <span className="color-171a1d99 margin-top-12 font-size-17 line-height-26">
            {dataSource?.cloudroomDiagnoseAllergy || "无"}
          </span>
          <div className="font-size-17 color-171a1d font-bold padding-bottom-18 border-bottom-f2f2f2 margin-top-20">
            诊断结果
          </div>
          <span className="color-171a1d99 margin-top-12 font-size-17 line-height-26">
            {resultTexts || "暂无诊断结果"}
          </span>
          <div className="font-size-17 color-171a1d font-bold padding-bottom-18 border-bottom-f2f2f2 margin-top-20">
            诊断建议
          </div>
          <span className="color-171a1d99 margin-top-12 font-size-17 line-height-26">
            {dataSource?.cloudroomDiagnoseSuggest || "暂无诊断建议"}
          </span>
        </div>
      </div>
    </div>
  );
}
InquireSummary.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default InquireSummary;
