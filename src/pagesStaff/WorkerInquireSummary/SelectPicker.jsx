import { useState } from "react";
import PropTypes from "prop-types";
import { TextArea, Popup } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";
function SelectPicker({ value, title, onChange }) {
  const [visible, setVisible] = useState(false);
  const handleChange = (value) => {
    onChange(value);
    setVisible(false);
  };
  return (
    <>
      <div
        className="margin-top-12 item-contain flex justify-between"
        onClick={() => setVisible(true)}
      >
        <div className="flex align-center">
          <span className="font-size-16 color-e75353 font-bold">*</span>
          <span>{title}</span>
        </div>
        <div className="flex align-center">
          <div className="margin-right-30">{value}</div>
          <RightOutline fontSize={14} />
        </div>
      </div>

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <div>
          <div
            className="text-align-center padding-14 font-size-16"
            onClick={() => handleChange("有")}
          >
            有
          </div>
          <div
            className="text-align-center padding-14 font-size-16"
            onClick={() => handleChange("无")}
          >
            无
          </div>
          <div className="bg-color-f6f8fa height-16" />
          <div
            className="text-align-center padding-14 font-size-16 margin-bottom-20 color-646566"
            onClick={() => setVisible(false)}
          >
            取消
          </div>
        </div>
      </Popup>
    </>
  );
}
SelectPicker.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default SelectPicker;
