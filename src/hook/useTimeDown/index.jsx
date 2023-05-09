/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-14 11:53:18
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-03-27 15:21:25
 * @FilePath: \h5-cloud-hospital\src\hook\useTimeDown\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useEffect, useRef } from "react";
/**
 * 获取剩余时间
 */
//millisLong 从提交时间到现在的毫秒数
export default function useTimeDown(millisLong) {
  const getLeftTime = (millisLong) => {
    let leftTime = 0;
    if (millisLong && millisLong >= 0) {
      const thirtyMinute = 30 * 60 * 1000;
      leftTime =
        thirtyMinute > millisLong
          ? parseInt((thirtyMinute - millisLong) / 1000)
          : 0;
    }
    console.log("leftTime", leftTime);
    return leftTime;
  };
  const leftTime = getLeftTime(millisLong);
  const [timeDown, setCountDown] = useState(leftTime);
  const timerRef = useRef();
  useEffect(() => {
    if (timeDown) {
      timerRef.current = setInterval(() => {
        setCountDown((c) => c - 1);
      }, 1000);
    }
    //清除副作用
    return () => {
      clearInterval(timerRef.current);
    };
  }, [timeDown]);

  const setTimeDown = (millisLong) => {
    setCountDown(getLeftTime(millisLong));
  };
  return [timeDown, setTimeDown];
}
