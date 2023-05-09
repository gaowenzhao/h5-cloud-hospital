import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Popup, SafeArea, Button } from "antd-mobile";
import { tipsList } from "@/assets/js/tips";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
const Tips = forwardRef((props, ref) => {
  const { beforeClose = () => {} } = props;
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [disable, setDisable] = useState(0);
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
  }));
  useEffect(() => {
    const todayIsTips = window.localStorage.getItem("todayIsTips") || "";
    const today = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const curHour = dayjs().hour();
    const tipsHour = dayjs(todayIsTips).hour();
    if (location.pathname == "/home") {
      if (
        !todayIsTips ||
        todayIsTips.slice(0, 10) != today.slice(0, 10) ||
        (todayIsTips.slice(0, 10) == today.slice(0, 10) &&
          curHour - tipsHour > 3)
      ) {
        setVisible(true);
        setDisable(5);
      }
    }
  }, []);
  useEffect(() => {
    if (disable > 0) {
      setTimeout(() => {
        setDisable((v) => {
          return v - 1;
        });
      }, 1000);
    }
  }, [disable]);
  const close = () => {
    if (disable) {
      return;
    }
    const today = dayjs().format("YYYY-MM-DD HH:mm:ss");
    window.localStorage.setItem("todayIsTips", today);
    setVisible(false);
    beforeClose();
  };
  return (
    <div className="tips">
      {/* <Button
        block
        color="primary"
        size="large"
        onClick={() => {
          setVisible(true);
        }}
      >
        知晓
      </Button> */}
      <Popup
        visible={visible}
        bodyClassName="min-height-40vh border-radius-t-16"
      >
        <div className="padding-bottom-30">
          <div className="font-bold font-size-20 text-align-center padding-tb-16">
            温馨提示
          </div>
          <div className="overflowY-scroll height-60vh padding-lr-16 ">
            {tipsList.map((v) => (
              <div className="line-height-26 font-size-16" key={v}>
                {v}
              </div>
            ))}
          </div>
          <div className="padding-lr-16">
            <Button
              block
              disabled={disable > 0}
              color="primary"
              className="height-44 border-radius-8 margin-top-30"
              onClick={close}
            >
              {disable > 0 ? `${disable}s` : "我已知晓"}
            </Button>
          </div>
          {/* <SafeArea position="bottom" /> */}
        </div>
      </Popup>
    </div>
  );
});

export default Tips;
