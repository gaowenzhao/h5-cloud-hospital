/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-13 15:20:09
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-03-27 08:50:03
 * @FilePath: \h5-cloud-hospital\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import postcsspxtoviewport from "postcss-px-to-viewport";
// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd();

// 路径查找
function pathResolve(dir) {
  return resolve(root, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/variables.scss";`,
        JavascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: "px", // 要转化的单位
          viewportWidth: 375, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          exclude: [],
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },
  resolve: {
    alias: [
      {
        find: /\@\//,
        replacement: `${pathResolve("src")}/`,
      },
    ],
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/cloudroom": {
        target: "https://devapi.jiahubao.net",
        changeOrigin: true,
        rewrite: (path) => {
          console.log("🚀 proxy:", path);
          // return path.replace(/^\/ajax/, "");
          return path;
        },
      },
      "/multimedia": {
        target: "https://devapi.jiahubao.net",
        changeOrigin: true,
        rewrite: (path) => {
          console.log("🚀 proxy:", path);
          // return path.replace(/^\/ajax/, "");
          return path;
        },
      },
    },
  },
});
