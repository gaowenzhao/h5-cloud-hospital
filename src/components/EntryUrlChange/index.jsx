import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Popup, Input, Button } from "antd-mobile";
const EntryUrlChange = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
  }));
  const close = () => {
    window.location.href = document.querySelector("#Input").value;
    setVisible(false);
  };
  return (
    <div className="EntryUrlChange">
      <Popup
        visible={visible}
        bodyClassName="min-height-40vh border-radius-t-16"
      >
        <div className="padding-bottom-30">
          <div className="font-bold font-size-20 text-align-center padding-tb-16">
            跳转地址
          </div>
          <div className="border-171a1d margin-lr-12 border-radius-6">
            <Input id="Input" />
          </div>
          <div className="padding-lr-16 flex justify-between">
            <Button
              className="height-44 border-radius-8 margin-top-30 width-150"
              onClick={() => setVisible(false)}
            >
              取消
            </Button>
            <Button
              color="primary"
              className="height-44 border-radius-8 margin-top-30 width-150"
              onClick={close}
            >
              切换
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
});

export default EntryUrlChange;
