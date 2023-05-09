import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Picker } from "antd-mobile";
// let resolveTemp = null;
const PickerSelf = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [columns, setColumns] = useState([]);
  const [value, setValue] = useState("");
  const [resolveTemp, setResolveTemp] = useState({});

  useImperativeHandle(ref, () => ({
    initData: ({ columns = [], value = [] }) => {
      return new Promise((resolve) => {
        setColumns(columns);
        setValue(value);
        setVisible(true);
        setResolveTemp({resolve});
      });
    },
  }));
  const close = () => {
    resolveTemp.resolve();
    setVisible(false);
    setResolveTemp({});
  };
  const confirm = (v) => {
    setValue(v);
    resolveTemp.resolve(v);
    setVisible(false);
    setResolveTemp({});
  };
  return (
    <>
      {/* 用药频率 选择器 开始 */}
      <Picker
        columns={columns}
        visible={visible}
        onClose={close}
        value={value}
        onConfirm={(v) => {
          confirm(v);
        }}
      />
      {/* 用药频率 选择器 结束 */}
    </>
  );
});

export default PickerSelf;
