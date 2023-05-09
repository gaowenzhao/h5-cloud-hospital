import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InfiniteScroll, Avatar, Button, SearchBar, Tabs } from "antd-mobile";
import InfiniteScrollContent from "@/components/InfiniteScrollContent";
import prescriptionVerify01 from "@/assets/images/prescriptionVerify-01.png";
import user01 from "@/assets/images/user-01.png";
import { myPrescriptList } from "@/api/PrescriptionVerify";
function MyPrescription() {
  const navigate = useNavigate();
  // 数据列表
  const [data, setData] = useState([]);
  // 数据列表 是还有更多
  const [hasMore, setHasMore] = useState(false);
  // 当前页码
  const [currentNum, setCurrentNum] = useState(1);
  const loadMore = () => {
    return new Promise((resolve) => {
      const params = {
        currentNum: currentNum,
        size: 10,
      };
      myPrescriptList(params).then((res) => {
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

  useEffect(() => {
    setData([]);
    setHasMore(true);
  }, []);

  const linkToDetail = (v) => {
    const path = `/prescriptionReview?cloudroomOrderId=${v.cloudroomOrderId}&cloudroomPrescriptId=${v.cloudroomPrescriptId}&isUser=1`;
    navigate(path);
  };
  return (
    <div className="MyPrescription">
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
              {/* {item.logStatus == "待审核" ? (
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

export default MyPrescription;
