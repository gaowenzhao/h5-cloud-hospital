/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-20 19:33:40
 * @LastEditors: gaowenzhao lu7025199@163.com
 * @LastEditTime: 2023-03-23 15:37:49
 * @FilePath: \h5-cloud-hospital\src\pages\WorkerInquiryRecord\OrderList\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { InfiniteScroll, List, Toast, PullToRefresh } from "antd-mobile";
import PropTypes, { number } from "prop-types";
import "./index.scss";
import { useState, useRef } from "react";
import WorkerInquiryItem from "@/components/WorkerInquiryItem";
import { inquiryListApi } from "@/api/UserInquiryHistory";
import { StatusEnum } from "..";
import { InquirStatus } from "@/constant";
import InfiniteScrollContent from "@/components/InfiniteScrollContent";
function OrderList({ orderStatus, extra }) {
  const [dataSource, setDataSource] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  let params = {
    currentNum: 0,
    size: 10,
  };
  params = { ...params, ...orderStatus };
  const paramsRef = useRef(params);
  async function getDataSource() {
    try {
      const response = await inquiryListApi(paramsRef.current);
      const append = response.data.records;
      if (append?.length > 0) {
        if (paramsRef.current.currentNum === 1) {
          setDataSource(append);
        } else {
          setDataSource((val) => [...val, ...append]);
        }
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      Toast.show(error);
      setHasMore(false);
    }
  }
  async function loadMore() {
    const args = {
      ...paramsRef.current,
      currentNum: paramsRef.current.currentNum + 1,
    };
    paramsRef.current = args;
    await getDataSource();
  }
  async function onRefresh() {
    paramsRef.current.currentNum = 1;
    setDataSource([]);
    await getDataSource();
  }

  const deleteItemEvent = async (index) => {
    const list = [...dataSource];
    list.splice(index, 1);
    setDataSource(list);
  };
  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="worker-inquiry-list">
        <List
          style={{
            "--border-top": "none",
            "--border-inner": "none",
            "--border-bottom": "none",
          }}
        >
          {dataSource.map((item, index) => (
            <List.Item key={index}>
              <WorkerInquiryItem
                value={item}
                index={index}
                extra={extra}
                onRefresh={onRefresh}
                deleteItemEvent={deleteItemEvent}
              />
            </List.Item>
          ))}
        </List>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
          <InfiniteScrollContent
            hasMore={hasMore}
            data={dataSource}
            emptyTips="暂无相关订单"
          />
        </InfiniteScroll>
      </div>
    </PullToRefresh>
  );
}
export default OrderList;
