/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-20 19:33:40
 * @LastEditors: gaowenzhao lu7025199@163.com
 * @LastEditTime: 2023-03-23 15:39:18
 * @FilePath: \h5-cloud-hospital\src\pages\UserInquiryHistory\InquiryList\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { InfiniteScroll, List, Toast, PullToRefresh } from "antd-mobile";
import PropTypes, { number } from "prop-types";
import "./index.scss";
import { useState, useRef } from "react";
import { inquiryListApi } from "@/api/UserInquiryHistory";
import useSyncState from "@/hook/useSyncState";
import InquiryItem from "@/components/InquiryItem";
import InfiniteScrollContent from "@/components/InfiniteScrollContent";
function InquiryList({ statusList }) {
  const [dataSource, setDataSource] = useState([]);
  const [hasMore, setHasMore] = useSyncState(true);
  let initParams = {
    currentNum: 0,
    size: 10,
  };
  statusList && (initParams = { ...initParams, statusList });
  const paramsRef = useRef(initParams);
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
      setHasMore(false);
      Toast.show(error);
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
    await getDataSource();
  }
  const deleteItem = (data) => {};
  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="user-inquiry-list">
        <List
          style={{
            "--border-top": "none",
            "--border-inner": "none",
            "--border-bottom": "none",
          }}
        >
          {dataSource.map((item, index) => (
            <List.Item key={index}>
              <InquiryItem
                dataSource={item}
                dataIndex={index}
                onDeleteItem={deleteItem}
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
export default InquiryList;
