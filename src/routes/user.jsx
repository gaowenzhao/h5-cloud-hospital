import { Outlet, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

const ChooseDocterByTab = lazy(() => import("@/pages/ChooseDocterByTab"));
const ChooseOffices = lazy(() => import("@/pages/ChooseOffices"));
const ChooseTime = lazy(() => import("@/pages/ChooseTime"));
const EPrescribing = lazy(() => import("@/pages/EPrescribing"));
const Home = lazy(() => import("@/pages/Home"));
const InquireSummary = lazy(() => import("@/pages/InquireSummary"));
const MyPrescription = lazy(() => import("@/pages/MyPrescription"));
const OrderEdit = lazy(() => import("@/pages/OrderEdit"));
const OrderPay = lazy(() => import("@/pages/OrderPay"));
const OrderPayStatus = lazy(() => import("@/pages/OrderPayStatus"));
const TakeMedicine = lazy(() => import("@/pages/TakeMedicine"));
const UserInquiryHistory = lazy(() => import("@/pages/UserInquiryHistory"));
const UserInquiryDetail = lazy(() => import("@/pages/UserInquiryDetail"));

const EmptyElement = () => {
  return <Outlet />;
};
const ReactLazy = (props) => {
  // const location = useLocation();
  // 获取匹配路由地址 做面包屑
  // const mathchs = matchRoutes(routes, location);
  // useEffect(() => {
  //   if (props.meta && props.meta.title) {
  //     document.title = props.meta.title;
  //   }
  // }, [props.meta]);

  return (
    <Suspense fallback={<div></div>}>
      <props.comp />
    </Suspense>
  );
};

// 就诊人 用户 路由
export default [
  // 视频复诊 首页
  {
    path: "home",
    meta: { title: "视频复诊" },
    element: <ReactLazy comp={Home} meta={{ title: "视频复诊" }} />,
  },
  // 选择科室 页
  {
    path: "chooseOffices",
    meta: { title: "选择科室" },
    element: <ReactLazy comp={ChooseOffices} meta={{ title: "选择科室" }} />,
  },
  // 选择医生 页 1.直接 按医生 tab=doctor 进来的 2.直接 按日期 tab=day 进来的 3.通过科室进来的 tab='' 或者不传tab
  {
    path: "ChooseDocterByTab",
    meta: { title: "选择医生" },
    element: (
      <ReactLazy comp={ChooseDocterByTab} meta={{ title: "选择医生" }} />
    ),
  },
  // 选择时间 页
  {
    path: "chooseTime",
    meta: { title: "选择时间" },
    element: <ReactLazy comp={ChooseTime} meta={{ title: "选择时间" }} />,
  },
  // 视频问诊 页
  {
    path: "orderEdit",
    meta: { title: "视频问诊" },
    element: <ReactLazy comp={OrderEdit} meta={{ title: "视频问诊" }} />,
  },
  // 确认订单 页 付款
  {
    path: "orderPay",
    meta: { title: "确认订单" },
    element: <ReactLazy comp={OrderPay} meta={{ title: "确认订单" }} />,
  },
  // 确认订单 页 付款
  {
    path: "orderPayStatus",
    meta: { title: "确认订单" },
    element: <ReactLazy comp={OrderPayStatus} meta={{ title: "确认订单" }} />,
  },
  // 问诊记录 页
  {
    path: "userInquiryHistory",
    meta: { title: "问诊记录" },
    element: (
      <ReactLazy comp={UserInquiryHistory} meta={{ title: "问诊记录" }} />
    ),
  },
  // 问诊详情 页
  {
    path: "userInquiryDetail",
    meta: { title: "问诊详情" },
    element: (
      <ReactLazy comp={UserInquiryDetail} meta={{ title: "问诊详情" }} />
    ),
  },
  // 问诊小结 页
  {
    path: "inquiresummary",
    meta: { title: "问诊小结" },
    element: <ReactLazy comp={InquireSummary} meta={{ title: "问诊小结" }} />,
  },
  // 电子处方 页
  {
    path: "eprescribing",
    meta: { title: "电子处方" },
    element: <ReactLazy comp={EPrescribing} meta={{ title: "电子处方" }} />,
  },
  // 我的处方
  {
    path: "myPrescription",
    meta: { title: "我的处方" },
    element: <ReactLazy comp={MyPrescription} meta={{ title: "我的处方" }} />,
  },
  // 到店取药
  {
    path: "takeMedicine",
    meta: { title: "到店取药" },
    element: <ReactLazy comp={TakeMedicine} meta={{ title: "到店取药" }} />,
  },
];

