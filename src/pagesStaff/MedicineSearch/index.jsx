import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InfiniteScroll, Avatar, Button, SearchBar, Tabs } from "antd-mobile";
import InfiniteScrollContent from "@/components/InfiniteScrollContent";
import { cloudroomMedicineList } from "@/api/MedicineSearch";
import { RightOutline } from "antd-mobile-icons";
import { useSelector, useDispatch } from "react-redux";
import { setMedicineItemTemp } from "@/store/medicineSlice";
function MedicineSearch(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 搜索输入框
  const [searchInput, setSearchInput] = useState("");
  // 缓存里面的
  const medicineItemTemp = useSelector((state) => {
    return state.medicine.medicineItemTemp;
  });

  // 数据列表
  const [data, setData] = useState([]);
  // 数据列表 是还有更多
  const [hasMore, setHasMore] = useState(false);
  // 当前页码
  const [currentNum, setCurrentNum] = useState(1);
  // 加载更多 函数
  const loadMore = () => {
    return new Promise((resolve) => {
      const params = {
        // 药品名称
        medicineName: searchInput || "",
        currentNum: currentNum,
        size: 10,
      };
      cloudroomMedicineList(params).then((res) => {
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

  // 初始化
  // 更新触发
  useEffect(() => {
    setData([]);
    setCurrentNum(1);
    setHasMore(true);
  }, [searchInput]);

  const chooseItem = (v) => {
    if (medicineItemTemp.cloudroomMedicineId != v.cloudroomMedicineId) {
      dispatch(setMedicineItemTemp(v));
    }
    navigate(-1);
  };

  return (
    <div className="MedicineSearch">
      {/* 顶部 开始 */}
      <div className="position-sticky position-top-0 position-left-0 bg-color-ffffff width-100vw z-index-10">
        {/* 搜索开始 */}
        <SearchInput setSearchInput={setSearchInput} />
        {/* 搜索结束 */}
      </div>
      {/* 顶部 结束 */}
      <div className="padding-16">
        <div className="border-radius-10 font-size-16 overflow-hidden">
          {/* 列表开始 */}
          {data.map((item, index) => (
            <div
              className="bg-color-ffffff padding-16 flex justify-between align-center border-bottom-111f2c1f"
              key={item.cloudroomMedicineId || index}
              onClick={() => {
                chooseItem(item);
              }}
            >
              <div className="flex-sub ellipsis height-22">
                {item.medicineName}
              </div>
              <div className="flex-shrink">
                <RightOutline />
              </div>
            </div>
          ))}
        </div>
        {/* 列表结束 */}

        {/* loading 触发器 开始 */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
          <InfiniteScrollContent
            hasMore={hasMore}
            data={data}
            emptyTips="暂无相关药品"
          />
        </InfiniteScroll>
        {/* loading 触发器 结束 */}
      </div>
    </div>
  );
}

// 顶部搜索框
const SearchInput = (props) => {
  const { setSearchInput } = props;
  return (
    <div className="width-100vw z-index-10 flex align-center justify-center height-52">
      <div className="flex-sub margin-lr-16">
        <SearchBar
          placeholder="请输入药品名称"
          className="margin-0-auto flex-sub"
          onSearch={(val) => {
            setSearchInput(val);
          }}
        />
      </div>
    </div>
  );
};

export default MedicineSearch;
