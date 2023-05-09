import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar, Avatar, Collapse, SideBar, List } from "antd-mobile";
import "./index.scss";
import { orgTree } from "@/api/ChooseOffices";
import { RightOutline, DownOutline } from "antd-mobile-icons";

// 左侧 列表
function ChooseOffices() {
  const navigate = useNavigate();
  const [orgTreeList, setOrgTreeList] = useState([]);
  const [urlSearch, setUrlSearch] = useSearchParams();
  const initOfficesId = urlSearch.get("officesId") || "";

  const [activeKey, setActiveKey] = useState(initOfficesId);
  // 获取 科室数据
  const getOrgTree = () => {
    return new Promise((resolve) => {
      orgTree().then((res) => {
        if (res.data && res.data.length) {
          setOrgTreeList(res.data || []);
          const find = res.data.find((v) => initOfficesId == v.officesId);
          if (find) {
            resolve(find.officesId + "");
          } else {
            resolve(res.data[0].officesId + "");
          }
        }
      });
    });
  };
  useEffect(() => {
    getOrgTree().then((officesId) => {
      setActiveKey(officesId);
    });
  }, []);
  const handleLeftList = (officesId) => {
    setActiveKey(officesId)
    let paramsObj = {};
    const paramsKeys = Array.from(urlSearch.keys()).filter(
      (v) => !["officesId"].includes(v)
    );
    paramsKeys.forEach((key) => {
      paramsObj[key] = urlSearch.get(key);
    });
    setUrlSearch(
      {
        ...paramsObj,
        officesId,
      },
      { replace: true }
    );
  };
  return (
    <div className="ChooseOffices flex justify-start align-start height-100vh">
      {/* <NavBar onBack={back} className="bg-color-ffffff font-bold font-size-16">
        选择科室
      </NavBar> */}
      <div className="height-100vh overflowY-scroll">
        {/* <LeftList
          orgTreeList={orgTreeList}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        /> */}

        <SideBar
          activeKey={activeKey}
          onChange={(key) => {
            handleLeftList(key);
          }}
          className="bg-color-f6f8fa width-118"
        >
          {/* 科室 分类 开始 */}
          {orgTreeList.map((item) => (
            <SideBar.Item
              key={`${item.officesId}`}
              title={item.name}
              className="font-size-17"
            />
          ))}
          {/* 科室 分类 结束 */}
        </SideBar>
      </div>
      <div className="flex-sub margin-left-12 bg-color-ffffff height-100vh overflowY-scroll">
        {/* 科室列表 开始 */}
        <ChildrenList orgTreeList={orgTreeList} activeKey={activeKey} />
        {/* 科室列表 结束 */}
      </div>
    </div>
  );
}

// 右侧 科室列表
const LeftList = (props) => {
  const { orgTreeList = [], activeKey = "", setActiveKey } = props;
  return (
    <SideBar
      activeKey={activeKey}
      onChange={(key) => {
        setActiveKey(key);
      }}
      className="bg-color-f6f8fa width-118"
    >
      {/* 科室 分类 开始 */}
      {orgTreeList.map((item) => (
        <SideBar.Item
          key={`${item.officesId}`}
          title={item.name}
          className="font-size-17"
        />
      ))}
      {/* 科室 分类 结束 */}
    </SideBar>
  );
};
// 右侧 科室列表
const ChildrenList = (props) => {
  const navigate = useNavigate();
  const [urlSearch, setUrlSearch] = useSearchParams();
  const { orgTreeList = [], activeKey = "" } = props;
  const [listData, setListData] = useState([]);
  // 初始化数据
  const initData = () => {
    const activeItem = orgTreeList.find((ov) => ov.officesId == activeKey);
    const data = activeItem ? activeItem.children : [];
    setListData(data);
  };
  // 点击跳转
  const toChooseDoctor = (ov) => {
    let path = `/chooseDocterByTab?officesId=${ov.officesId}`;
    const nextPage = urlSearch.get("nextPage") || "";
    if (nextPage) {
      let paramsList = [];
      const paramsKeys = Array.from(urlSearch.keys()).filter(
        (v) => !["nextPage", "officesId"].includes(v)
      );
      paramsKeys.forEach((key) => {
        paramsList.push(`${key}=${urlSearch.get(key)}`);
      });
      path = `/${nextPage}?officesId=${ov.officesId}&${paramsList.join("&")}`;
    }
    navigate(path);
  };
  // 监听变化
  useEffect(() => {
    initData();
  }, [orgTreeList, activeKey]);
  return (
    <List>
      {/* 右侧科室列表 开始 */}
      {listData.map((ov) => {
        return (
          <div key={ov.officesId}>
            {ov.children && ov.children.length ? (
              <Collapse
                arrow={(active) =>
                  active ? <DownOutline /> : <RightOutline />
                }
              >
                <Collapse.Panel key={ov.officesId} title={ov.name}>
                  {ov.children.map((v) => {
                    return (
                      <>
                        <List.Item
                          onClick={() => toChooseDoctor(v)}
                          key={v.officesId}
                          className="font-size-17 color-171a1d"
                        >
                          {v.name}
                        </List.Item>
                      </>
                    );
                  })}
                </Collapse.Panel>
              </Collapse>
            ) : (
              <List.Item onClick={() => toChooseDoctor(ov)} key={ov.officesId}>
                {ov.name}
              </List.Item>
            )}
          </div>
        );
      })}
      {/* 右侧科室列表 结束 */}
    </List>
  );
};

export default ChooseOffices;
