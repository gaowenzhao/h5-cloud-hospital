import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, TextArea, Button, Picker } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setMedicineItemTemp,
  setMedicineItemSure,
} from "@/store/medicineSlice";
import "./index.scss";
import { getByMedicineId } from "@/api/Medicine";
import PickerSelf from "@/components/PickerSelf";
import { inputNum } from "@/utils/common";
function Medicine() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 缓存里面的
  const medicineItemTemp = useSelector((state) => {
    return state.medicine.medicineItemTemp;
  });

  const [medicine, setMedicine] = useState({
    cloudroomMedicineId: medicineItemTemp.cloudroomMedicineId || "", //	药品ID		false	    integer
    cloudroomPrescriptId: medicineItemTemp.cloudroomPrescriptId || "", //	处方ID		false	    integer
    cloudroomPrescriptMedicineId:
      medicineItemTemp.cloudroomPrescriptMedicineId || "", //	主键ID		false	    integer
    createTime: medicineItemTemp.createTime || "", //	创建时间		false	    string
    frequency: medicineItemTemp.frequency || "", //	用药频率		false	    string
    medicineName: medicineItemTemp.medicineName || "", //	药品名称		false	    string
    remark: medicineItemTemp.remark || "", //	备注		false	    string
    takeType: medicineItemTemp.takeType || "", //	服药方法:口服|外敷|注射		false	    string
    tbStatus: medicineItemTemp.tbStatus || "", //	记录状态:正常:正常;删除:删除;		false	    string
    timeNum: medicineItemTemp.timeNum || "", //	单次用量		false	    integer
    timeUnit: medicineItemTemp.timeUnit || "", //	单次单位		false	    string
    totalNum: medicineItemTemp.totalNum || "", //	总数量		false	    integer
    totalUnit: medicineItemTemp.totalUnit || "", //	总的单位		false	    string
    medicinePrice: medicineItemTemp.medicinePrice || "", //	药品价格		false	    string
    medicineSpec: medicineItemTemp.medicineSpec || "", //	药品规格	false	    string
  });

  const [unitList, setUnitList] = useState([]);
  useEffect(() => {
    // 清空 单位 选项列表
    setUnitList([]);
    if (medicine.cloudroomMedicineId) {
      getByMedicineId({
        cloudroomMedicineId: medicine.cloudroomMedicineId || "",
        currentNum: 1,
        size: 30,
      }).then((res) => {
        const arr = [];
        if (res.data && res.data.length) {
          res.data.forEach((v) => {
            arr.push({ label: v.specName || "", value: v.specName || "" });
          });
        }
        setUnitList(arr);
      });
    }
  }, [medicine.cloudroomMedicineId]);

  const PickerSelfRef = useRef();

  // 选择 单位
  const handleTotalUnit = () => {
    PickerSelfRef.current
      .initData({ columns: [unitList], value: [medicine.totalUnit] })
      .then((res) => {
        if (res) {
          setMedicine({
            ...medicine,
            totalUnit: (res && res[0]) || "",
          });
        }
      });
  };
  // 选择 单位
  const handleTimeUnit = () => {
    PickerSelfRef.current
      .initData({ columns: [unitList], value: [medicine.timeUnit] })
      .then((res) => {
        if (res) {
          setMedicine({
            ...medicine,
            timeUnit: (res && res[0]) || "",
          });
        }
      });
  };
  // 选择 用药频率
  const handleFrequency = () => {
    const columns = [
      { label: "每日一次", value: "每日一次" },
      { label: "每日两次", value: "每日两次" },
      { label: "每日三次", value: "每日三次" },
      { label: "每日四次", value: "每日四次" },
      { label: "每日五次", value: "每日五次" },
    ];
    PickerSelfRef.current
      .initData({ columns: [columns], value: [medicine.frequency] })
      .then((res) => {
        if (res) {
          setMedicine({
            ...medicine,
            frequency: (res && res[0]) || "",
          });
        }
      });
  };

  // 确定 按钮
  const handleSubmit = () => {
    // 确认好的就存起来
    dispatch(setMedicineItemSure(JSON.parse(JSON.stringify(medicine))));
    // 确认好后 把 临时的清空
    dispatch(setMedicineItemTemp({}));
    navigate(-1);
  };
  // 取消 就 吧临时的 清空
  const handleCancel = () => {
    dispatch(setMedicineItemTemp({}));
    navigate(-1);
  };
  return (
    <div className="Medicine padding-16">
      <div className="padding-lr-16 border-radius-12 bg-color-ffffff margin-bottom-16">
        <div className="flex align-center font-size-16 min-height-52">
          <div className="flex align-center">
            <div className="width-12 height-12 text-align-center color-ff5219">
              *
            </div>
            <div className="flex-sub font-bold">药品名称</div>
          </div>
          <div
            className="flex-sub text-align-right"
            onClick={() => {
              navigate("/medicineSearch");
            }}
          >
            <span
              className={`font-size-15 ${
                medicine.medicineName ? "" : "color-b6b6b6"
              }`}
            >
              {medicine.medicineName || "请输入"}
            </span>
          </div>
        </div>
      </div>

      <div className="padding-lr-16 border-radius-12 bg-color-ffffff margin-bottom-16">
        <div className="flex align-center font-size-16 min-height-52">
          <div className="flex align-center">
            <div className="width-12 height-12 text-align-center color-ff5219">
              *
            </div>
            <div className="flex-sub font-bold">用法用量</div>
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="flex align-center font-size-14 min-height-52">
          <div className="width-130 font-bold">总数量</div>
          <div className="flex-sub text-align-right padding-right-16">
            <Input
              className="input"
              placeholder="请输入"
              value={medicine.totalNum || ""}
              type="number"
              maxLength={20}
              onChange={(v) => {
                setMedicine({
                  ...medicine,
                  totalNum: inputNum(v),
                });
              }}
            />
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="flex align-center font-size-14 min-height-52">
          <div className="width-130 padding-left-14">单位</div>
          <div
            className="flex-sub text-align-right"
            onClick={() => {
              handleTotalUnit();
            }}
          >
            <span className={`${medicine.totalUnit ? "" : "color-b6b6b6"}`}>
              {medicine.totalUnit || "请选择"}
            </span>
            <RightOutline className="color-b6b6b6 font-size-14" />
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="flex align-center font-size-14 min-height-52">
          <div className="width-130 font-bold">用药频率</div>
          <div
            className="flex-sub text-align-right"
            onClick={() => {
              handleFrequency();
            }}
          >
            <span className={`${medicine.frequency ? "" : "color-b6b6b6"}`}>
              {medicine.frequency || "请选择"}
            </span>
            <RightOutline className="color-b6b6b6 font-size-14" />
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="flex align-center font-size-14 min-height-52">
          <div className="width-130 font-bold">单次用量</div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="flex align-center font-size-14 min-height-52">
          <div className="width-130 padding-left-14">用量</div>
          <div className="flex-sub text-align-right padding-right-16">
            <Input
              className="input"
              placeholder="请输入"
              value={medicine.timeNum || ""}
              type="number"
              maxLength={20}
              onChange={(v) => {
                setMedicine({
                  ...medicine,
                  timeNum: inputNum(v),
                });
              }}
            />
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="flex align-center font-size-14 min-height-52">
          <div className="width-130 padding-left-14">单位</div>
          <div
            className="flex-sub text-align-right"
            onClick={() => {
              handleTimeUnit();
            }}
          >
            <span className={`${medicine.timeUnit ? "" : "color-b6b6b6"}`}>
              {medicine.timeUnit || "请选择"}
            </span>
            <RightOutline className="color-b6b6b6 font-size-14" />
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="flex align-center font-size-14 min-height-52">
          <div className="width-130 font-bold">用药方法</div>
          <div className="flex-sub text-align-right padding-right-16">
            <Input
              className="input"
              placeholder="例如：口服"
              value={medicine.takeType || ""}
              onChange={(v) => {
                setMedicine({
                  ...medicine,
                  takeType: v,
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="padding-lr-16 border-radius-12 bg-color-ffffff margin-bottom-16">
        <div className="flex align-center min-height-52">
          <div className="flex-sub font-bold">说明</div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-12 bg-color-ffffff">
          <TextArea
            placeholder="请输入用药说明"
            value={medicine.remark || ""}
            autoSize={{ minRows: 3 }}
            className="text-area"
            onChange={(v) => {
              if (
                v.length < medicine.remark.length ||
                medicine.remark.length < 50
              ) {
                setMedicine({
                  ...medicine,
                  remark: v,
                });
              }
            }}
          />
          <div className="text-align-right opacity-4">
            {medicine.remark.length}/50
          </div>
        </div>
      </div>

      {/* 选择器 开始 */}
      <PickerSelf ref={PickerSelfRef} />
      {/* 选择器 结束 */}

      <div className="padding-46"></div>
      {/* 底部 按钮 开始 */}
      <div className="height-66 padding-tb-12 padding-lr-16 position-fixed position-left-0 position-bottom-0 bg-color-ffffff position-right-0">
        <div className="flex justify-between align-center">
          <Button
            color="default"
            className="height-44 border-radius-22 font-size-16 width-100 margin-right-8"
            onClick={() => {
              handleCancel();
            }}
          >
            取消
          </Button>

          <Button
            color="primary"
            className="height-44 border-radius-22 font-size-16 flex-sub bg-color-33afff"
            disabled={!medicine.medicineName}
            onClick={() => {
              medicine.medicineName && handleSubmit();
            }}
          >
            确定
          </Button>
        </div>
      </div>
      {/* 底部 按钮 结束 */}
    </div>
  );
}
export default Medicine;
