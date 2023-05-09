/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-14 20:10:26
 * @LastEditors: gaowenzhao lu7025199@163.com
 * @LastEditTime: 2023-03-23 11:03:50
 * @FilePath: \h5-cloud-hospital\src\pages\UserInquiryDetail\components\DoctorCard\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Button, Image } from "antd-mobile";
import PropTypes, { number } from "prop-types";
import { StarFill } from "antd-mobile-icons";
import "./index.scss";
function DoctorCard({ doctorInfo }) {
  return (
    <div className="doctor-card-contain">
      <div className="doctor-card">
        <Image
          className="doctor-image width-52 height-52"
          fit="cover"
          src="https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
        />
        <div className="doctor-info">
          <div className="doctor-top">
            <div>
              <span className="doctor-name">{doctorInfo?.doctorName}</span>
              <span className="doctor-level">
                {doctorInfo?.doctorTitle || ""}
              </span>
              {doctorInfo?.doctorTag === "是" && (
                <span className="doctor-label">处方</span>
              )}
            </div>
          </div>
          <div className="doctor-center">{doctorInfo?.hospitalName}</div>
        </div>
      </div>
      {doctorInfo.desc && (
        <div className="doctor-introduce">{doctorInfo.desc}</div>
      )}

      <div className="doctor-bottom margin-top-12">
        <Image
          className="width-28 height-28"
          src="https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_video.png"
        />
        <span className="project-price">￥{doctorInfo?.price}</span>
        <span className="inquiry-count">接诊量 {doctorInfo?.orderAmount}</span>
        <div className="margin-left-16">
          {[...new Array(5)].map((item, index) => {
            return (
              <StarFill
                key={index}
                fontSize={20}
                color={
                  index + 1 <= Number(doctorInfo?.grade) ? "#FF9200" : "#D8D8D8"
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
DoctorCard.propTypes = {};
export default DoctorCard;
