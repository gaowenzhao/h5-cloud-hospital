import { Outlet, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

const InquiryCard = lazy(() => import("@/pagesBoth/InquiryCard"));
const PrescriptionReview = lazy(() => import("@/pagesBoth/PrescriptionReview"));

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
  // }, []);

  return (
    <Suspense fallback={<div></div>}>
      <props.comp />
    </Suspense>
  );
};

// 就诊人 用户 和 工作端 医生都可有的 路由
export default [
  // 问诊卡片 页
  {
    path: "inquirycard",
    meta: { title: "问诊卡片" },
    element: <ReactLazy comp={InquiryCard} meta={{ title: "问诊卡片" }} />,
  },
  // 工作端 处方审核
  {
    path: "prescriptionReview",
    meta: { title: "处方审核" },
    element: (
      <ReactLazy comp={PrescriptionReview} meta={{ title: "处方审核" }} />
    ),
  },
];

