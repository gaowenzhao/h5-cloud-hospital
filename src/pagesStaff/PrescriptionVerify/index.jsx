import { useEffect, useState, useRef } from "react";
import {
  useNavigate,
  useSearchParams,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";
import { InfiniteScroll, Avatar, Button, SearchBar, Tabs } from "antd-mobile";
import "./index.scss";
import InfiniteScrollContent from "@/components/InfiniteScrollContent";
import prescriptionVerify01 from "@/assets/images/prescriptionVerify-01.png";
import user01 from "@/assets/images/user-01.png";
import { prescriptList } from "@/api/PrescriptionVerify";
import { inquireSummaryEnd } from "@/utils/appGlobal";
// 当前组件 有3种 状态  根据 tab： wait 待审核 done 已审核
function PrescriptionVerify() {
  const navigate = useNavigate();
  const [urlSearch, setUrlSearch] = useSearchParams();

  const tabKeyDefault = urlSearch.get("tab") || "wait";

  const [activeTabKey, setActiveTabKey] = useState(tabKeyDefault);

  // 数据列表
  const [data, setData] = useState([]);
  // 数据列表 是还有更多
  const [hasMore, setHasMore] = useState(false);
  // 当前页码
  const [currentNum, setCurrentNum] = useState(1);
  const loadMore = () => {
    return new Promise((resolve) => {
      const logStatusStr = {
        wait: "待审核",
        done: "已审核",
        all: "",
      };
      const params = {
        logStatus: logStatusStr[activeTabKey] || "",
        currentNum: currentNum,
        size: 10,
      };
      prescriptList(params).then((res) => {
        const resDataRecords = res.data.records || [];
        const total = res.data.total || 0;
        const current = res.data.current || 0;
        const size = res.data.size || 0;
        setData((val) => [...val, ...resDataRecords]);
        const flag = total > current * size;
        setHasMore(flag);
        if (flag) {
          setCurrentNum(current - 0 + 1);
        }
        resolve();
      });
    });
  };

  const activeKeyTabChange = (key) => {
    setCurrentNum(1);
    dialogrNumRef.current = 0;
    setActiveTabKey(key);
    setUrlSearch(
      {
        tab: key,
      },
      { replace: true }
    );
  };
  useEffect(() => {
    setData([]);
    setHasMore(true);
  }, [activeTabKey]);

  const linkToDetail = (v) => {
    blockerRef.current = "";
    const path = `/prescriptionReview?cloudroomOrderId=${v.cloudroomOrderId}&cloudroomPrescriptId=${v.cloudroomPrescriptId}&isUser=0`;
    navigate(path);
  };

  // 监听路由变化
  const blockerRef = useRef("1");
  const blocker = useBlocker(!!blockerRef.current);
  // 支付提示 弹框的 次数 当次数 为 0 的时候 才 提示 大于0 说明已经 展示 提示 了
  const dialogrNumRef = useRef(0);

  useEffect(() => {
    handleBlocker();
  }, [blocker]);

  const handleBlocker = () => {
    if (blocker && blocker.state === "blocked" && !blockerRef.current) {
      blocker && blocker.proceed && blocker.proceed();
    } else {
      if (dialogrNumRef.current > 0) {
        inquireSummaryEnd();
      } else {
        dialogrNumRef.current = 1;
      }
    }
    console.log("🚀 blockerRef: 进来了这里");
  };
  return (
    <div className="PrescriptionVerify">
      {/* 顶部 开始 */}
      <div className="position-sticky position-top-0 position-left-0 bg-color-ffffff width-100vw z-index-10">
        <div className="margin-lr-16 height-46">
          <Tabs
            activeKey={activeTabKey}
            onChange={activeKeyTabChange}
            activeLineMode="fixed"
            className="padding-top-10"
          >
            <Tabs.Tab
              title={
                <div
                  className={`font-size-14 ${
                    activeTabKey == "wait" ? "font-bold" : ""
                  }`}
                >
                  待审核
                </div>
              }
              key="wait"
            ></Tabs.Tab>
            <Tabs.Tab
              title={
                <div
                  className={`font-size-14 ${
                    activeTabKey == "done" ? "font-bold" : ""
                  }`}
                >
                  已审核
                </div>
              }
              key="done"
            ></Tabs.Tab>
            <Tabs.Tab
              title={
                <div
                  className={`font-size-14 ${
                    activeTabKey == "all" ? "font-bold" : ""
                  }`}
                >
                  全部
                </div>
              }
              key="all"
            ></Tabs.Tab>
          </Tabs>
        </div>
      </div>
      {/* 顶部 结束 */}
      <div className="padding-lr-16 padding-tb-12">
        {/* 列表开始 */}
        {data.map((item, index) => (
          <div
            className="margin-bottom-12 bg-color-ffffff padding-lr-8 border-radius-12 overflow-hidden"
            key={item.cloudroomPrescriptId || index}
            onClick={() => {
              linkToDetail(item);
            }}
          >
            <div className="min-height-46 flex justify-between align-center">
              <div className="flex-sub flex justify-start align-center">
                <Avatar
                  src={prescriptionVerify01}
                  className="width-20 height-20"
                />
                <div className="font-bold margin-left-8">
                  {item.title || ""}
                </div>
              </div>
              {item.logStatus == "待审核" ? (
                <Button className="padding-lr-8 padding-tb-0 font-size-14 line-height-26 bg-color-7e868e29">
                  待审核
                </Button>
              ) : null}
              {item.logStatus == "已审核" ? (
                <Button className="padding-lr-8 padding-tb-0 font-size-14 line-height-26 bg-color-7e868e29 color-c1c1c4">
                  已审核
                </Button>
              ) : null}
              {item.logStatus == "已驳回" ? (
                <Button className="padding-lr-8 padding-tb-0 font-size-14 line-height-26 bg-color-7e868e29 color-f53f3f">
                  已驳回
                </Button>
              ) : null}
              {item.logStatus == "已撤回" ? (
                <Button className="padding-lr-8 padding-tb-0 font-size-14 line-height-26 bg-color-7e868e29 color-f53f3f">
                  已撤回
                </Button>
              ) : null}
              {/* {item.logStatus == "待签名" ? (
                <Button className="padding-lr-8 padding-tb-0 font-size-14 line-height-26 bg-color-7e868e29 color-f53f3f">
                  待签名
                </Button>
              ) : null} */}
            </div>
            <div className="padding-top-8 padding-bottom-16 flex justify-start align-start">
              <Avatar
                src={item.patientLogo || ""}
                className="width-76 height-76"
              />
              <div className="flex-sub margin-left-8 line-height-20 color-333333">
                <div>
                  {item.patientName || ""}{" "}
                  <span className="inline-block padding-lr-22">
                    {item.patientSex || ""}
                  </span>{" "}
                  {item.patientAge || "-"}岁
                </div>
                <div className="padding-tb-12">
                  诊断医生：{item.doctorName || ""}
                </div>
                <div className="ellipsis overflow-hidden">
                  诊断结果：
                  {(item.resultList &&
                    item.resultList.length &&
                    item.resultList[0].cloudroomPrescriptResultDesc) ||
                    ""}
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* 列表结束 */}

        {/* loading 触发器 开始 */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
          <InfiniteScrollContent
            hasMore={hasMore}
            data={data}
            emptyTips="暂无相关处方"
          />
        </InfiniteScroll>
        {/* loading 触发器 结束 */}
      </div>
    </div>
  );
}

export default PrescriptionVerify;
