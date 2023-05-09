import { Avatar, DotLoading } from "antd-mobile";
import EmptyPng from "@/assets/images/empty.png";

const InfiniteScrollContent = (props) => {
  const { hasMore, data = [], emptyTips = '' } = props;
  return (
    <>
      {hasMore ? (
        <>
          <span>加载中</span>
          <DotLoading />
        </>
      ) : !hasMore && !data.length ? (
        <div className="padding-10 margin-0-auto">
          <img src={EmptyPng} className="width-180 height-180" />
          <div className="text-align-center font-size-17">{emptyTips}</div>
        </div>
      ) : (
        <div className="text-align-center">-- 已经到底了 --</div>
      )}
    </>
  );
};
export default InfiniteScrollContent;
