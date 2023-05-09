import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rate, Avatar, Button } from "antd-mobile";
import { StarFill } from "antd-mobile-icons";
import doctorAvatar from "@/assets/images/doctor-avatar.png";
// const doctorer = {
//   avatar: "头像或者封面",
//   doctorName: "医生名称",
//   doctorId: "医生id",
//   doctorTitle: "主任医师",
//   doctorTitleId: "主任医师id",
//   doctorTag: "处方",
//   doctorTagId: "处方id",
//   hospitalId: "医院id",
//   hospitalName: "医院名称",
//   officeslId: "科室id",
//   officesName: "科室名称",
//   desc: "医生描述 擅长儿科几十年",
//   orderAmount: "接诊量 订单量",
//   grade: "评分",
//   price: "价格",
//   status: "状态 是否 可预约",
// };
const StartSlot = (props) => {
  const { doctor = {} } = props;
  return (
    <div className="padding-lr-22 margin-top-8 flex justify-start align-center height-36">
      <Rate
        readOnly
        allowHalf
        defaultValue={doctor.grade}
        character={
          <StarFill
            fontSize={22}
            style={{
              "--active-color": "#FF9200",
            }}
          />
        }
      />
      <span className="opacity-6 font-size-14 padding-left-16">
        接诊量 {doctor.orderAmount || 0}
      </span>
    </div>
  );
};
// 医生信息
function DoctorInfo(props) {
  const { BtnTopRightSlot, ChildrnSlot, className = "", doctor = {} } = props;
  doctor.avatar = doctor.avatar || doctor.doctorLogo || "";
  doctor.hospitalName = doctor.hospitalName || doctor.hospital || "";
  doctor.officesName = doctor.officesName || doctor.keshiName || "";
  doctor.grade = doctor.grade || doctor.hzmyd || "0";
  doctor.orderAmount = doctor.orderAmount || doctor.orderTotalNum || "0";
  doctor.desc = doctor.desc || (doctor.majorSkillList || []).join(",") || "";
  const navigate = useNavigate();

  return (
    <div className={`DoctorInfo ${className}`}>
      <div className="flex padding-lr-12">
        <Avatar
          src={doctor.avatar || ""}
          className="height-88 width-88 border-dddddd border-radius-8"
        />
        <div className="padding-left-12 flex-sub overflow-hidden">
          <div className="flex justify-between align-center min-height-28">
            <div className="flex flex-sub align-center">
              <div className="font-size-15 margin-right-16 font-bold line-height-28">
                {doctor.doctorName || ""}
              </div>
              <div className="font-size-12 margin-right-12 font-bold color-007fff line-height-28">
                {doctor.doctorTitle || ""}
              </div>
              {doctor.doctorTag ? (
                <div className="font-size-10 color-00b042 border-00b042 border-radius-4 padding-lr-4 line-height-16">
                  {doctor.doctorTag || ""}
                </div>
              ) : null}
            </div>
            {BtnTopRightSlot ? <BtnTopRightSlot doctor={doctor} /> : null}
          </div>
          <div className="padding-top-6 font-size-14 line-height-22 ellipsis">
            {doctor.hospitalName || ""} {doctor.officesName || ""}
          </div>
          <div className="padding-top-10 font-size-14  line-height-22 opacity-4 ellipsis">
            {doctor.desc || ""}
          </div>
        </div>
      </div>
      <StartSlot doctor={doctor} />
      {ChildrnSlot ? <ChildrnSlot doctor={doctor} /> : null}
      {props.children ? props.children : null}
    </div>
  );
}
export default DoctorInfo;
