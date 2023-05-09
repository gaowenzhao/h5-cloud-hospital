import { useState } from "react";
import PropTypes from "prop-types";
import "./index.scss";
function Tabs({ tabsInfo = [], onChange, style = {} }) {
  const [tabKey, setTabkey] = useState(tabsInfo?.[0]?.key); //问诊中
  const onTabChange = (item) => {
    setTabkey(item.key);
    onChange(item);
  };
  return (
    <>
      <div className="custom-tabbar-contain">
        {tabsInfo.map((item) => (
          <div
            className={`tabbar-item ${
              tabKey === item.key ? "tabbar-item-active-text" : ""
            }`}
            style={
              tabKey === item.key
                ? {
                    color: `${
                      style["active-title-color"]
                        ? style["active-title-color"]
                        : "#171a1d"
                    }`,
                  }
                : {}
            }
            key={item.key}
            onClick={() => onTabChange(item)}
          >
            <span>{item.title}</span>
            {tabKey === item.key && (
              <div
                className="tabbar-item-active-border"
                style={{
                  background: `${
                    style["active-line-color"]
                      ? style["active-line-color"]
                      : "#171a1d"
                  }`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
Tabs.propTypes = {
  tabsInfo: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default Tabs;
