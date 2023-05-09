/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-22 09:43:06
 * @LastEditors: gaowenzhao lu7025199@163.com
 * @LastEditTime: 2023-03-22 10:20:48
 * @FilePath: \h5-cloud-hospital\src\pages\PrescriptionReview\components\DrugList\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Image, Space } from "antd-mobile";
import PropTypes from "prop-types";
import "./index.scss";
import DrugItem from "../DrugItem";
function DrugList({ onDeleteDrug, onAddDrug, value, editable = true }) {
  const addIcon =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon-add-logo.png";
  return (
    <div className="drug-list">
      <div className="flex align-center padding-bottom-16 border-bottom-f2f2f2">
        <span className="font-size-16 color-e75353 font-bold">*</span>
        <span>Rp</span>
      </div>
      {value?.map((item, index) => (
        <DrugItem
          key={item.cloudroomMedicineId}
          value={item}
          index={index}
          onDeleteItem={onDeleteDrug}
          editable={editable}
        />
      ))}
      {editable && (
        <div className="flex justify-center margin-top-20">
          <Button
            color="warning"
            shape="rounded"
            className="padding-left-20 padding-right-20"
            onClick={onAddDrug}
          >
            <div className="flex align-center">
              <Image src={addIcon} className="width-16 height-16" />
              <span className="margin-left-4 font-size-12">添加药品</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
DrugList.propTypes = {};
export default DrugList;
