import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextArea, Image, Checkbox, Space, Popup } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";
import "./index.scss";
import { dictListApi, dictItemListApi } from "@/api/Dictionary";
function InquiryResult({
  value = [],
  onDeleteItem,
  editable = true,
  onChange,
  onOptions,
}) {
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState(value);
  const [options, setOptions] = useState([]);
  const icon_close =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_feature_close.png";
  useEffect(() => {
    getDictItemList();
  }, []);
  const getDictItemList = async () => {
    const res = await dictListApi({ dictValue: "MZZZZDDM" });
    if (res.code === 200) {
      if (res.data.records.length > 0) {
        const dictId = res.data.records[0].dictId;
        if (dictId) {
          const response = await dictItemListApi({ dictPid: dictId });
          if (response.code === 200) {
            setOptions(response.data?.records);
            onOptions(response.data?.records);
          } else {
            Toast.show(response.message);
          }
        }
      } else {
        Toast.show("字典数据为空");
      }
    } else {
      Toast.show(res.message);
    }
  };
  const onSelectData = () => {
    onChange && onChange(values);
    setVisible(false);
  };
  const deleteItem = (index) => {
    const newList = [...values];
    newList.splice(index, 1);
    setValues(newList);
    onChange && onChange(newList);
  };
  return (
    <>
      <div className="margin-top-12 inquiry-result-container">
        <div className="flex align-center justify-between">
          <div className="flex align-center">
            <span className="font-size-16 color-e75353 font-bold">*</span>
            <span>诊断结果</span>
          </div>
          {editable && (
            <div
              className="flex align-center"
              onClick={() => {
                setValues(value);
                setVisible(true);
              }}
            >
              <div className="small-text">请选择</div>
              <RightOutline fontSize={14} />
            </div>
          )}
        </div>
        {value?.length > 0 && (
          <div className="margin-top-30 flex flex-wrap">
            {value.map((item, index) => (
              <div
                className="border-radius-50 border-d7d7d7 padding-6 font-size-14 flex margin-right-6 margin-bottom-6"
                key={index}
              >
                {options.find((info) => info.itemValue === item)?.itemLabel ||
                  ""}
                {editable && (
                  <Image
                    src={icon_close}
                    className="margin-left-4 width-16 height-16"
                    onClick={() => deleteItem(index)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <>
          <div className="padding-16 text-align-center position-relative">
            <span className="font-bold">请选择诊断结果</span>
            <div
              className="position-absolute top-14 right-18 color-007fff"
              onClick={onSelectData}
            >
              确定
            </div>
            <div
              className="position-absolute top-14 left-18"
              onClick={() => setVisible(false)}
            >
              取消
            </div>
          </div>
          <div className="inquiry-result-list-contain">
            <Checkbox.Group
              value={values}
              onChange={(val) => {
                setValues(val);
              }}
            >
              <Space direction="vertical">
                {options.map((item) => (
                  <Checkbox value={item.itemValue} key={item.itemValue}>
                    <span className="font-size-16">{item.itemLabel}</span>
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
            <div className="height-50" />
          </div>
        </>
      </Popup>
    </>
  );
}
InquiryResult.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default InquiryResult;
