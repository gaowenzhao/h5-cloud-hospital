import { Outlet, Navigate, useLocation, matchRoutes } from "react-router-dom";
import { useEffect } from "react";
// 就诊人 用户 路由
import userRouters from "./user";
// 医生 员工 路由
import staffRouters from "./staff";

// 医生和用户都 公用的路由
import bothRouters from "./both";

const childrenRoutes = [
  { path: "", element: <Navigate to="/home" replace={true} /> },
  ...userRouters,
  ...staffRouters,
  ...bothRouters,
];

const EmptyElement = () => {
  const location = useLocation();
  // 处理 权限 处理 路由 在 这里可以处理
  useEffect(() => {
    const matches = matchRoutes(childrenRoutes, {
      pathname: location.pathname,
    });
    if (matches.length) {
      const meta = matches[matches.length - 1].route.meta || {};
      document.title = meta.title || "";
    }
    console.log("history", window.location.href);
  }, [location.pathname]);
  return <Outlet />;
};

export default [
  {
    path: "/",
    element: <EmptyElement />,
    children: childrenRoutes,
  },
  {
    path: "",
    element: <Navigate to="/home" replace={true} />,
  },
];
