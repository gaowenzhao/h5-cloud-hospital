import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, NavBar, Image, ImageViewer, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import "./index.scss";
import Header from "@/components/Header";
import { getInquiryCardByOrderId } from "@/api/CloudroomDiagnose";
import { getUrlParams } from "@/utils/common";
//传入?cloudroomOrderId = 订单Id
function InquiryCard() {
  const [visible, setVisible] = useState(false);
  const [defaultIndex, setDefaultIndex] = useState();
  const [dataSource, setDataSource] = useState(false);
  const location = useLocation();
  // const [imageList, setImageList] = useState([]);
  const iconRepeatInquiry =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon-repeat-inquiry.png";

  const getInquiryCard = () => {
    const params = getUrlParams(location.search);
    if (params?.cloudroomOrderId) {
      getInquiryCardByOrderId({ cloudroomOrderId: params.cloudroomOrderId })
        .then((res) => {
          if (res.code === 200) {
            setDataSource(res.data);
          }
        })
        .catch((err) => {
          Toast.show(err);
        });
    } else {
      Toast.show("订单Id为空");
    }
  };
  const baseInfos = useMemo(() => {
    return [
      { label: "就诊人", value: dataSource?.userName },
      { label: "性  别", value: dataSource?.sex },
      { label: "年  龄", value: `${dataSource?.age || ""}岁` },
    ];
  }, [dataSource]);
  useEffect(() => {
    getInquiryCard();
  }, []);
  return (
    <>
      <div className="inquiry-card">
        <div className="padding-16 inquiry-card-content">
          <div className="baseInfo">
            <div className="base-title flex align-center">
              <span>基本信息</span>
              <Image
                src={iconRepeatInquiry}
                className="width-34 height-16 margin-left-8"
              />
            </div>
            {baseInfos.map((item, index) => (
              <div className="baseInfo-item" key={index}>
                <div className="width-70">{item.label}</div>
                <div className="margin-left-40">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="disease-desc">
            <div className="base-title">基本信息</div>
            <div className="desc">{dataSource?.diseaseDesc || ""}</div>
          </div>

          <div className="bg-color-ffffff margin-top-16 padding-bottom-10 border-radius-12">
            <div className="base-title">报告附件</div>
            <div className="image-contain">
              {dataSource?.annexList?.map((item, index) => (
                <div
                  className="image-content"
                  key={index}
                  onClick={() => setVisible(true)}
                >
                  <Image
                    key={index}
                    className="width-74 height-74 border-radius-2"
                    src={item}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="disease-desc">
            <div className="base-title">既往在院病史信息</div>
            <div className="desc">
              {dataSource?.diseaseHistory || "暂无既往病史"}
            </div>
          </div>
        </div>
      </div>
      <ImageViewer.Multi
        images={dataSource?.annexList}
        visible={visible}
        defaultIndex={defaultIndex}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
InquiryCard.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default InquiryCard;
