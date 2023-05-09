import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Image } from "antd-mobile";
import PropTypes from "prop-types";
import "./index.scss";
import { useDispatch } from "react-redux";
import { setMedicineItemInit } from "@/store/medicineSlice";
// cloudroomMedicineId: "", //	药品ID		false	    integer
// cloudroomPrescriptId: "", //	处方ID		false	    integer
// cloudroomPrescriptMedicineId: "", //	主键ID		false	    integer
// createTime: "", //	创建时间		false	    string
// frequency: "", //	用药频率		false	    string
// medicineName: "", //	药品名称		false	    string
// remark: "", //	备注		false	    string
// takeType: "", //	服药方法:口服|外敷|注射		false	    string
// tbStatus: "", //	记录状态:正常:正常;删除:删除;		false	    string
// timeNum: "", //	单次用量		false	    integer
// timeUnit: "", //	单次单位		false	    string
// totalNum: "", //	总数量		false	    integer
// totalUnit: "", //	总的单位		false	    string
// medicinePrice: "",//	药品价格		false	    string
// medicineSpec: "",//	药品规格	false	    string
function DrugItem({ value, index, onDeleteItem, editable = true }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const list = [
    { label: "数量", value: `${value?.totalNum}${value?.totalUnit}` },
    { label: "单价", value: `¥${value?.medicinePrice}` },
    {
      label: "用法用量",
      value: `${value?.frequency}，每次${value?.timeNum}${value?.timeUnit}，${value?.takeType}`,
    },
  ];

  const editDrug = () => {
    dispatch(setMedicineItemInit(value));
    navigate("/medicine");
  };
  const icon_close =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_feature_close.png";
  return (
    <div className="drug-item">
      <div className="flex justify-between align-center">
        <div className="drug-name">
          <span>{value?.medicineName}</span>
          {editable && (
            <Image
              src={icon_close}
              className="margin-left-4 height-16 width-16"
              onClick={() => onDeleteItem(index)}
            />
          )}
        </div>
        {editable && (
          <div className="font-size-14 color-33afff" onClick={editDrug}>
            编辑
          </div>
        )}
      </div>

      <div className="font-size-14 margin-top-16 font-bold">
        {value?.medicineSpec}
      </div>
      {list.map((item, index) => (
        <div key={index}>
          <div className="font-size-15 margin-top-12 font-bold line-height-22">
            {item?.label}
          </div>
          <div className="font-size-13 margin-top-12 line-height-20">
            {item?.value}
          </div>
        </div>
      ))}
      <div className="bg-color-f9f9f9 padding-8 margin-top-12 border-radius-10 font-size-13">
        说明：{value?.remark}
      </div>
    </div>
  );
}
DrugItem.propTypes = {};
export default DrugItem;
