import { findDOMNode } from "react-dom";
/**
 * @desc  函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param  func 需要执行的函数
 * @param  wait 延迟执行时间（毫秒）
 * @param  immediate---true 表立即执行，false 表非立即执行
 **/
export function debounce(func, wait = 200, immediate = false) {
  let timer;

  return function () {
    let context = this;
    let args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 * @description: 获取url上面的 参数
 * @param {*} url: ?key=val
 * @return {*}
 */
export function getUrlParams(url) {
  if (!url) return null;
  let urlStr = url.split("?")[1];
  const urlSearchParams = new URLSearchParams(urlStr);
  const result = Object.fromEntries(urlSearchParams.entries());
  return result;
}
/**
 * @description: 时间格式化 YYYY-MM-DD 如果没有参数 就会获取今天的 YYYY-MM-DD
 * @param {*} date:  new Date()
 * @return {*}
 */
export function changeDateFormat(date) {
  if (!date) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份是从0开始的
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const newTime =
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day) +
    " " +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (min < 10 ? "0" + min : min) +
    ":" +
    (sec < 10 ? "0" + sec : sec);

  return newTime;
}
/**
 * @description: 横向tab 设置滚动位置 滚动 只接受 classname
 * @param {*} tag: scroll-smooth 这里一般是 父级classname
 * @param {*} tagChild: border-007fff 这里一般是 选中的子classname
 * @return {*}
 */
export const scrollSmoothTo = (params = { tag: "", tagChild: "" }) => {
  const scrollSmoothBox = document.querySelector(`.${params.tag}`);
  if (scrollSmoothBox) {
    let boxWidth = "";
    const index = Array.from(scrollSmoothBox.children).findIndex((el) => {
      if (el.className.includes(`${params.tagChild}`)) {
        boxWidth = el.clientWidth;
        return true;
      }
    });
    if (index > -1) {
      const scrollLeft = boxWidth * index || 0;
      // 设置滚动条的位置
      findDOMNode(scrollSmoothBox).scrollTo(scrollLeft, 0);
    }
  }
};

/**
 * @description: 文件下载方法 具体文件地址下载
 * @param {*} href: 地址
 * @param {*} filename: 文件名称
 * @return {*}
 */
export function downloadFileByUrl(href, filename) {
  if (href && filename) {
    let a = document.createElement("a");
    a.download = filename; //指定下载的文件名
    a.href = href; //  URL对象
    a.click(); // 模拟点击

    window.URL = window.URL || window.webkitURL;
    window.URL.revokeObjectURL(a.href); // 释放URL 对象
  }
}

/**
 * @description: 下载文件 数据转成文件下载
 * @param {*} data:Blob
 * @param {*} fileName:string
 * @param {*} mineType:string
 * @return {*}
 */
const downloadFileByBlob = (data = "", fileName = "", mineType = "") => {
  // 创建 blob
  const blob = new Blob([data], { type: mineType });
  // 创建 href 超链接，点击进行下载
  window.URL = window.URL || window.webkitURL;
  const href = URL.createObjectURL(blob);
  const downA = document.createElement("a");
  downA.href = href;
  downA.download = fileName;
  downA.click();
  // 销毁超连接
  window.URL.revokeObjectURL(href);
};

export const download = {
  // 下载 Excel 方法
  excel: (data, fileName) => {
    downloadFileByBlob(data, fileName, "application/vnd.ms-excel");
  },
  // 下载 Word 方法
  word: (data, fileName) => {
    downloadFileByBlob(data, fileName, "application/msword");
  },
  // 下载 Zip 方法
  zip: (data, fileName) => {
    downloadFileByBlob(data, fileName, "application/zip");
  },
  // 下载 Html 方法
  html: (data, fileName) => {
    downloadFileByBlob(data, fileName, "text/html");
  },
  // 下载 Markdown 方法
  markdown: (data, fileName) => {
    downloadFileByBlob(data, fileName, "text/markdown");
  },
};

/**
 * @description: rmb 分转元
 * @param {*} costNum:
 * @return {*}
 */
export const fractionalConversionYuan = (costNum = "") => {
  const pay_amount = `${costNum}`.padStart(3, "0");
  const money = `${pay_amount.slice(
    0,
    pay_amount.length - 2
  )}.${pay_amount.slice(pay_amount.length - 2)}`;
  return money;
};

/**
 * @description: 秒 转 分秒
 * @param {*} second: 数字
 * @return {*}
 */
export const timeCount = (second) => {
  var minute = Math.floor(second / 60);
  second %= 60;
  if (minute > 0) {
    return `${minute}分${second}秒`;
  } else {
    return `${second}秒`;
  }
};
/**
 * @description: input输入框只能输入数字和 小数点后两位
 * @param {*} obj:
 * @param {*} val:
 * @return {*}
 */
export function inputNum(value = "") {
  value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  value.replace(/^\./g, ""); //验证第一个字符是数字
  value.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
  value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
  return value;
}
export const sleep = (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));
