import { useState } from "react";
import PropTypes from "prop-types";
import { TextArea } from "antd-mobile";
function CustomTextArea({ value, title, placeholder, maxLength, onChange }) {
  return (
    <div className="margin-top-16 item-contain">
      <div className="flex align-center">
        <span className="font-size-16 color-e75353 font-bold">*</span>
        <span>{title}</span>
      </div>
      <TextArea
        value={value}
        placeholder={placeholder}
        className="font-size-14 margin-top-20"
        maxLength={maxLength}
        rows={3}
        showCount
        onChange={onChange}
      />
    </div>
  );
}
CustomTextArea.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default CustomTextArea;
