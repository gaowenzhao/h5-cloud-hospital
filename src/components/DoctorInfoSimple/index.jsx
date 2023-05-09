import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "antd-mobile";
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
// 医生信息
function DoctorInfoSimple(props) {
  const { BtnTopRightSlot, ChildrnSlot, className = "", doctor = {} } = props;
  const navigate = useNavigate();
  doctor.avatar = doctor.avatar || doctor.doctorLogo || "";
  doctor.hospitalName = doctor.hospitalName || doctor.hospital || "";
  doctor.officesName = doctor.officesName || doctor.keshiName || "";
  doctor.grade = doctor.grade || doctor.hzmyd || "0";
  doctor.orderAmount = doctor.orderAmount || doctor.orderTotalNum || "0";
  doctor.desc = doctor.desc || (doctor.majorSkillList || []).join(',') || "";
  return (
    <div className={`DoctorInfoSimple ${className}`}>
      <div className="flex">
        <Avatar
          src={doctor.avatar || ""}
          className="height-52 width-52 border-dddddd border-radius-8"
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
                <div className="font-size-10 color-00b042 border-00b042 border-radius-4 padding-lr-4 line-height-16 height-16">
                  {doctor.doctorTag || ""}
                </div>
              ) : null}
            </div>
            {BtnTopRightSlot ? <BtnTopRightSlot doctor={doctor} /> : null}
          </div>
          <div className="padding-top-2 font-size-14 line-height-22 ellipsis">
            {doctor.hospitalName || ""} {doctor.officesName || ""}
          </div>
        </div>
      </div>
      {ChildrnSlot ? <ChildrnSlot doctor={doctor} /> : null}
      {props.children ? props.children : null}
    </div>
  );
}
export default DoctorInfoSimple;
