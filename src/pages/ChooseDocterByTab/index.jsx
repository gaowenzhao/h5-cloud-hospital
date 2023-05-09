import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InfiniteScroll, Avatar, Button, SearchBar, Tabs } from "antd-mobile";
import DoctorInfo from "@/components/DoctorInfo";
import Camera from "@/assets/images/camera.png";
import "./index.scss";
import InfiniteScrollContent from "@/components/InfiniteScrollContent";
import { doctorList } from "@/api/ChooseDocterByTab";
import dayjs from "dayjs";
import { scrollSmoothTo } from "@/utils/common";
// 当前组件 有3种 状态  根据 tab： doctor 按医生 day 按日期  空或者无tab 不展示 tab栏
// officesId 科室 名称 非必须

function ChooseDocterByTab(props) {
  const [urlSearch, setUrlSearch] = useSearchParams();

  const tabKeyDefault = urlSearch.get("tab") || "";
  const officesId = urlSearch.get("officesId") || "";

  const [activeTabKey, setActiveTabKey] = useState(tabKeyDefault);

  // 搜索输入框
  const [searchInput, setSearchInput] = useState("");

  // 日期列表
  const [dayList, setDayList] = useState([]);
  // 选中 高亮的日期
  const [activeDay, setActiveDay] = useState({});

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
        // 排班日期：YYYY-MM-DD
        date: activeTabKey == "day" ? activeDay.day : "",
        officesId: officesId || "",
        // 医生姓名
        doctorName: searchInput || "",
        currentNum: currentNum,
        size: 10,
      };
      doctorList(params).then((res) => {
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

  // 顶部 tab 切换
  const activeKeyTabChange = (key) => {
    setActiveTabKey(key);
    setUrlSearch(
      {
        tab: key,
        officesId,
      },
      { replace: true }
    );
  };
  // 初始化
  useEffect(() => {
    initDayList().then((res) => {
      setActiveDay(res[0]);
    });
  }, []);
  // 更新触发
  useEffect(() => {
    setData([]);
    setCurrentNum(1);
    setHasMore(true);
  }, [activeTabKey, activeDay, searchInput]);

  // 点击日期
  const handlerActiveDay = (v) => {
    setActiveDay(v);
    setSearchInput("");
  };

  const weekDay = {
    1: "星期一",
    2: "星期二",
    3: "星期三",
    4: "星期四",
    5: "星期五",
    6: "星期六",
    0: "星期日",
  };

  // 初始化 日期 选择
  const initDayList = () => {
    return new Promise((resolve) => {
      const arr = [];
      for (let i in "123456789012345".split("")) {
        const day = dayjs().add(i, "day").format("YYYY-MM-DD");
        arr.push({
          week: weekDay[`${new Date(day.replace(/\-/g, "/")).getDay()}`],
          day: day,
        });
      }
      setDayList(arr);
      resolve(arr);
    });
  };

  return (
    <div className="ChooseDocterByTab">
      {/* 顶部 开始 */}
      <div className="position-sticky position-top-0 position-left-0 bg-color-ffffff width-100vw z-index-10">
        {activeTabKey ? (
          <div className="margin-lr-16 height-44">
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
                      activeTabKey == "doctor" ? "font-bold" : ""
                    }`}
                  >
                    按医生
                  </div>
                }
                key="doctor"
              ></Tabs.Tab>
              <Tabs.Tab
                title={
                  <div
                    className={`font-size-14 ${
                      activeTabKey == "day" ? "font-bold" : ""
                    }`}
                  >
                    按日期
                  </div>
                }
                key="day"
              ></Tabs.Tab>
            </Tabs>
          </div>
        ) : null}

        {/* 搜索开始 */}
        {activeTabKey == "doctor" || !activeTabKey ? (
          <SearchInput setSearchInput={setSearchInput} />
        ) : null}
        {/* 搜索结束 */}

        {/* 日期开始 */}
        {activeTabKey == "day" ? (
          <SearchDayList
            dayList={dayList}
            handlerActiveDay={handlerActiveDay}
            activeDay={activeDay}
          />
        ) : null}
        {/* 日期结束 */}
      </div>
      {/* 顶部 结束 */}
      <div className="padding-12">
        {/* 列表开始 */}
        {data.map((item, index) => (
          <div
            className="margin-bottom-12 bg-color-ffffff padding-tb-16 border-radius-6"
            key={item.doctorAccount || index}
          >
            <DoctorInfo doctor={item} ChildrnSlot={ChildrnSlot} />
          </div>
        ))}
        {/* 列表结束 */}

        {/* loading 触发器 开始 */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
          <InfiniteScrollContent
            hasMore={hasMore}
            data={data}
            emptyTips="当日暂无医生排班"
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
          placeholder="请输入医生"
          className="margin-0-auto flex-sub"
          onSearch={(val) => {
            setSearchInput && setSearchInput(val);
          }}
        />
      </div>
    </div>
  );
};
// 医生的 状态 和 价格  预约按钮
const ChildrnSlot = (props) => {
  const { doctor = {} } = props;
  const navigate = useNavigate();
  const toChooseTime = () => {
    const path = `/chooseTime`;
    navigate(path, {
      state: doctor,
      // replace:true
    });
  };
  return (
    <>
      {/* 卡片底部 按钮 开始 */}
      <div className="height-1 bg-color-7e868e29 margin-lr-4 margin-top-8 margin-bottom-12"></div>
      <div className="padding-lr-12 flex justify-between align-center min-height-36">
        <div className="flex-sub  flex justify-start align-center">
          <img src={Camera} className="width-24 height-24" />
          <div className="padding-left-12 color-ff5219 font-size-17 font-bold">
            ￥{doctor.price || "-"}
          </div>
        </div>
        <Button
          color="primary"
          className="height-36 font-size-14 width-116"
          disabled={doctor.status != "是"}
          onClick={() => {
            toChooseTime();
          }}
        >
          立即预约
        </Button>
      </div>
      {/* 卡片底部 按钮 结束 */}
    </>
  );
};

// 日期 列表
const SearchDayList = (props) => {
  const { dayList = [], handlerActiveDay, activeDay = {} } = props;

  // 监听 日期 变化 对应滚动设置
  useEffect(() => {
    scrollSmoothTo({ tag: "scroll-smooth", tagChild: "border-007fff" });
  }, [activeDay.day]);
  return (
    <div className="SearchDayList overflow-hidden overflowX-auto nowrap flex flex-nowrap width-100vw bg-color-f2f2f6 padding-top-10 padding-bottom-4 scroll-smooth">
      {dayList.map((v) => {
        let borderColor = "border-ffffff";
        if (v.day == activeDay.day) {
          borderColor = "border-007fff color-007fff";
        }
        return (
          <div
            className={`border-radius-8 margin-lr-4 text-align-center padding-top-4 padding-bottom-8 flex-shrink width-68 bg-color-ffffff transition-all-5 ${borderColor}`}
            key={v.day}
            onClick={() => {
              handlerActiveDay && handlerActiveDay(v);
            }}
          >
            <div
              className={`width-0 height-4 bg-color-007fff margin-0-auto border-radius-4 ${
                v.day == activeDay.day ? "width-4" : ""
              }`}
            ></div>
            <div className={`font-size-15 line-height-22  margin-top-4`}>
              {v.week}
            </div>
            <div className={`font-size-12 line-height-18 margin-top-6`}>
              {v.day.length > 5 ? v.day.slice(5) : v.day}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ChooseDocterByTab;
