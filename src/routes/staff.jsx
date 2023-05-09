import { Outlet, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

const CheckList = lazy(() => import("@/pagesStaff/CheckList"));
const CheckOffice = lazy(() => import("@/pagesStaff/CheckOffice"));
const Medicine = lazy(() => import("@/pagesStaff/Medicine"));
const MedicineSearch = lazy(() => import("@/pagesStaff/MedicineSearch"));
const PrescriptionVerify = lazy(() =>
  import("@/pagesStaff/PrescriptionVerify")
);
const WorkerInquiryRecord = lazy(() =>
  import("@/pagesStaff/WorkerInquiryRecord")
);
const WorkerInquireSummary = lazy(() =>
  import("@/pagesStaff/WorkerInquireSummary")
);
const SignSuccess = lazy(() => import("@/pagesStaff/SignSuccess"));

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

// 就诊人 用户 路由
export default [
  // 工作端问诊记录 页
  {
    path: "workerInquiryRecord",
    meta: { title: "云诊断" },
    element: (
      <ReactLazy comp={WorkerInquiryRecord} meta={{ title: "云诊断" }} />
    ),
  },
  // 工作端问诊小结 页
  {
    path: "workerInquireSummary",
    meta: { title: "问诊小结" },
    element: (
      <ReactLazy comp={WorkerInquireSummary} meta={{ title: "问诊小结" }} />
    ),
  },
  // 处方审核 页
  {
    path: "prescriptionVerify",
    meta: { title: "处方审核" },
    element: (
      <ReactLazy comp={PrescriptionVerify} meta={{ title: "处方审核" }} />
    ),
  },
  // 检验科 页
  {
    path: "checkOffice",
    meta: { title: "检验科" },
    element: <ReactLazy comp={CheckOffice} meta={{ title: "检验科" }} />,
  },
  // 检验查询
  {
    path: "checkList",
    meta: { title: "检验查询" },
    element: <ReactLazy comp={CheckList} meta={{ title: "检验查询" }} />,
  },
  // 添加药品
  {
    path: "medicine",
    meta: { title: "添加药品" },
    element: <ReactLazy comp={Medicine} meta={{ title: "添加药品" }} />,
  },
  // 搜索药品
  {
    path: "medicineSearch",
    meta: { title: "搜索药品" },
    element: <ReactLazy comp={MedicineSearch} meta={{ title: "搜索药品" }} />,
  },
  {
    path: "signSuccess",
    meta: { title: "签名" },
    element: <ReactLazy comp={SignSuccess} meta={{ title: "签名" }} />,
  },
];
