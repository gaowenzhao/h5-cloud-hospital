import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useNavigate,
  useLocation,
  useBeforeUnload,
  useSearchParams,
} from "react-router-dom";
import { Button, Image, Popup, TextArea, Toast } from "antd-mobile";
import { CloseOutline, UploadOutline } from "antd-mobile-icons";
import PropTypes from "prop-types";
import "./index.scss";
import InquiryResult from "@/components/InquiryResult";
import DrugList from "./components/DrugList";
import { changeDateFormat, getUrlParams } from "@/utils/common";
import { userInquiryDetailApi } from "@/api/UserInquiryHistory";
import {
  doctorSignApi,
  getPrescriptById,
  prescriptAdd,
  prescriptRecall,
  prescriptUpdate,
  verifySignApi,
} from "@/api/Prescript";
import { useSelector, useDispatch } from "react-redux";
import { setMedicineItemInit } from "@/store/medicineSlice";
import {
  setInitial,
  clearStore,
  setFieldValue,
} from "@/store/prescriptionSlice";
import { inquireSummaryEnd } from "@/utils/appGlobal";
import { CheckStatus, InquirStatus, Role } from "@/constant";
import { setUserRole } from "@/store/userSlice";
//redux-devtools-extension
///prescriptionReview?cloudroomOrderId=(订单Id) 或者 cloudroomPrescriptId=（处方Id）&isUser=0
function PrescriptionReview() {
  const currentLocation = useLocation();
  const [urlSearch, setUrlSearch] = useSearchParams();
  //确定之后返回的数据
  const medicineItemSure = useSelector((state) => {
    return state.medicine.medicineItemSure;
  });
  const [options, setOptions] = useState([]); //诊断结果的字典列表
  const dataSource = useSelector((state) => state.prescription.dataSource);
  const {
    resultList: inquiryResult,
    medicineList = [],
    remark: attention,
    verifyReason,
    doctorSignId,
    doctorSignFileUrl,
    verifyId,
    verifySignFileUrl,
    logStatus,
    fromMedicePageBack, //是否从添加药品页面回来的
  } = dataSource;
  const [editReason, setEditReason] = useState("");
  const [visible, setVisible] = useState(false);
  const [orderInfo, setOrderInfo] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paramsRef = useRef(getUrlParams(currentLocation.search));
  const Pagekey = "PrescriptionKey";
  const role = useSelector((state) => {
    return state.user.role || Role.DOCTOR;
  });
  const toastHandler = useRef();
  useEffect(() => {
    setTitle();
    getOrderInfo();
    initData();
  }, []);

  const setTitle = () => {
    if (paramsRef?.current?.cloudroomPrescriptId) {
      if (role === Role.USER) {
        document.title = "处方详情";
      } else {
        document.title = "处方审核";
      }
    } else {
      document.title = "开处方";
    }
  };

  const useMedicineStore = () => {
    if (JSON.stringify(medicineItemSure) === "{}") {
      return;
    }
    const index = medicineList.findIndex(
      (item) =>
        item.cloudroomMedicineId === medicineItemSure?.cloudroomMedicineId
    );
    if (index >= 0) {
      //更新
      const list = [...medicineList];
      const medicine = JSON.parse(JSON.stringify(medicineItemSure));
      list[index] = medicine;
      dispatch(setFieldValue({ medicineList: list }));
    } else {
      const list = [...medicineList];
      const medicine = JSON.parse(JSON.stringify(medicineItemSure));
      list?.push(medicine);
      dispatch(setFieldValue({ medicineList: list }));
    }
  };
  const initData = () => {
    if (fromMedicePageBack) {
      useMedicineStore();
      dispatch(setFieldValue({ fromMedicePageBack: false }));
    } else {
      if (paramsRef?.current?.cloudroomPrescriptId) {
        //存在处方
        getPrescriptInfo(paramsRef?.current?.cloudroomPrescriptId);
      } else {
        const localData = localStorage.getItem(Pagekey);
        if (!!localData && localData !== "undefined") {
          const data = JSON.parse(localData);
          const dataSource = {
            ...data,
            cloudroomOrderId: paramsRef?.current?.cloudroomOrderId,
          };
          dispatch(setInitial(dataSource));
        }
      }
    }
  };
  const medicinePrice = useMemo(() => {
    const price = medicineList?.reduce((pre, value) => {
      const total = pre + value.medicinePrice;
      return total;
    }, 0);
    return price;
  }, [medicineList]);
  /**
   * 获取处方的信息
   */
  const getPrescriptInfo = async (cloudroomPrescriptId) => {
    try {
      const res = await getPrescriptById({ cloudroomPrescriptId });
      if (res.data) {
        const data = res.data;
        const list = data.resultList?.map(
          (item) => item.cloudroomPrescriptResultCode
        );
        dispatch(setInitial({ ...data, resultList: list }));
      } else {
        Toast.show(res.message);
      }
    } catch (error) {
      Toast.show(error);
    }
  };
  const getOrderInfo = async () => {
    const cloudroomOrderId = paramsRef?.current?.cloudroomOrderId;
    if (cloudroomOrderId) {
      try {
        const res = await userInquiryDetailApi({ cloudroomOrderId });
        if (res.code === 200) {
          setOrderInfo(res.data);
        } else {
          Toast.show(res.message);
        }
      } catch (error) {
        Toast.show(error);
      }
    } else {
      Toast.show("订单Id为空");
    }
  };
  const onOptions = (options) => {
    setOptions(
      options?.map((item) => {
        return {
          cloudroomPrescriptResultCode: item.itemValue,
          cloudroomPrescriptResultDesc: item.itemLabel,
        };
      })
    );
  };
  const onResultSelect = (values) => {
    dispatch(setFieldValue({ resultList: values }));
  };
  const onDrugDelete = (index) => {
    const newList = [...medicineList];
    newList.splice(index, 1);
    dispatch(setFieldValue({ medicineList: newList }));
  };

  const handleSubmit = () => {
    if (
      !paramsRef.current?.cloudroomOrderId ||
      paramsRef.current?.cloudroomOrderId === "null"
    ) {
      Toast.show("订单Id为空");
      return;
    }

    if (!(inquiryResult && inquiryResult.length > 0)) {
      Toast.show("请输入诊断结果");
      return;
    }
    if (!(medicineList && medicineList.length > 0)) {
      Toast.show("请添加药品");
      return;
    }
    let params = {
      cloudroomOrderId: paramsRef.current?.cloudroomOrderId,
      resultList: inquiryResult.map((item) => {
        return options.find(
          (info) => info.cloudroomPrescriptResultCode === item
        );
      }),
      medicineList,
      remark: attention,
      verifyReason,
    };
    if (paramsRef.current?.cloudroomPrescriptId) {
      //存在处方
      params = { ...dataSource, ...params };
    } else {
      params.doctorName = orderInfo.doctorName;
      params.doctorId = orderInfo.doctorId;
      params.patientAge = orderInfo.patientAge;
      params.patientName = orderInfo.patientName;
      params.patientLogo = orderInfo.patientLogo;
      params.patientSex = orderInfo.patientSex;
    }
    return params;
  };
  const onAddDrug = () => {
    dispatch(setFieldValue({ fromMedicePageBack: true }));
    dispatch(setMedicineItemInit({}));
    navigate("/medicine");
  };
  const onAttendChange = (value) => {
    dispatch(setFieldValue({ remark: value }));
  };
  const clearReduxStore = () => {
    dispatch(setMedicineItemInit({}));
    dispatch(clearStore());
  };
  /**
   * 驳回
   */
  const reject = () => {
    setVisible(true);
  };
  /**
   *
   * @returns 审核员驳回
   */
  const rejectApi = async () => {
    dispatch(setFieldValue({ verifyReason: editReason }));
    const params = handleSubmit();
    if (!params.verifyId) {
      Toast.show("请先去签名！");
      return;
    }
    params.verifyReason = editReason;
    const res = await prescriptUpdate({
      ...params,
      logStatus: CheckStatus.Reject,
    });
    if (res.code === 200) {
      Toast.show("提交成功");
      clearReduxStore();
      //返回上一页
      navigate(-1);
    }
  };
  /**
   * 审核通过
   */
  const approval = () => {
    const params = handleSubmit();
    if (!params.verifyId) {
      Toast.show("请先去签名！");
      return;
    }
    prescriptUpdate({
      ...params,
      logStatus: CheckStatus.Approval,
    }).then((res) => {
      if (res.code === 200) {
        Toast.show("提交成功");
        clearReduxStore();
        //返回上一页
        navigate(-1);
      }
    });
  };
  //医生提交审核
  const submitToReview = () => {
    const params = handleSubmit();
    if (!params.doctorSignId) {
      Toast.show("请先去签名！");
      return;
    }
    if (params) {
      prescriptAdd(params).then((res) => {
        if (res.code === 200) {
          clearReduxStore();
          localStorage.removeItem(Pagekey);
          Toast.show("提交成功");
          //开处方结束关闭webview页面
          inquireSummaryEnd();
        }
      });
    }
  };
  /**
   * 重新提交审核本来就有处方id
   */
  const reApply = () => {
    const params = handleSubmit();
    if (!params.doctorSignId) {
      Toast.show("请先去签名！");
      return;
    }
    params.logStatus = CheckStatus.ToBeReviewed;
    if (params) {
      prescriptUpdate(params).then((res) => {
        if (res.code === 200) {
          clearReduxStore();
          Toast.show("提交成功");
          //返回上一页
          navigate(-1);
        }
      });
    }
  };
  //撤回
  const recall = async () => {
    try {
      const res = await prescriptRecall({
        cloudroomPrescriptId: dataSource?.cloudroomPrescriptId,
      });
      Toast.show("撤回成功");
      getPrescriptInfo(paramsRef?.current?.cloudroomPrescriptId);
    } catch (error) {
      Toast.show("撤回失败");
    }
  };
  const onSave = () => {
    const localData = localStorage.setItem(Pagekey, JSON.stringify(dataSource));
    Toast.show("保存成功");
  };
  const renderBottomByStatus = () => {
    if (
      role === Role.CHECKER ||
      (role === Role.DOCTOR && dataSource?.canVerify === "是")
    ) {
      return (
        <div className="prescription-review-bottom-fixed">
          <Button
            color="default"
            shape="rounded"
            className="font-size-13 padding-left-40 padding-right-40"
            onClick={reject}
          >
            驳回
          </Button>
          <Button
            color="primary"
            shape="rounded"
            className="margin-left-8 padding-left-80 padding-right-80 font-size-13 bg-color-33afff border-33afff"
            onClick={approval}
          >
            审核通过
          </Button>
        </div>
      );
    } else if (role === Role.DOCTOR) {
      //存在处方 被驳回后医生处理
      if (paramsRef.current?.cloudroomPrescriptId) {
        if (logStatus === CheckStatus.ToBeReviewed) {
          //待审核
          return (
            <div className="prescription-review-bottom-fixed">
              <Button
                block
                color="primary"
                shape="rounded"
                className="font-size-13 font-size-13 bg-color-33afff border-33afff margin-left-16 margin-right-16"
                onClick={recall}
              >
                撤回审核
              </Button>
            </div>
          );
        } else {
          //已撤回/已驳回
          if (
            logStatus === CheckStatus.Recalled ||
            logStatus === CheckStatus.Reject
          ) {
            return (
              <div className="prescription-review-bottom-fixed">
                <Button
                  block
                  color="default"
                  shape="rounded"
                  className="font-size-13 font-size-13 margin-left-16 margin-right-16"
                  onClick={() =>
                    dispatch(setFieldValue({ logStatus: CheckStatus.CanEdit }))
                  }
                >
                  修改处方
                </Button>
                <Button
                  block
                  color="primary"
                  shape="rounded"
                  className="font-size-13 font-size-13 bg-color-33afff border-33afff margin-left-16 margin-right-16"
                  disabled
                >
                  重新提交审核
                </Button>
              </div>
            );
          } else {
            //可编辑、待签名
            return (
              <div className="prescription-review-bottom-fixed">
                <Button
                  block
                  color="primary"
                  shape="rounded"
                  className="font-size-13 font-size-13 bg-color-33afff border-33afff margin-left-16 margin-right-16"
                  onClick={reApply}
                >
                  {logStatus === CheckStatus.ToBeSign
                    ? "提交审核"
                    : "重新提交审核"}
                </Button>
              </div>
            );
          }
        }
      } else {
        //新建处方
        return (
          <div className="prescription-review-bottom-fixed">
            <Button
              color="default"
              shape="rounded"
              className="font-size-13 padding-left-50 padding-right-50"
              onClick={onSave}
            >
              保存
            </Button>
            <Button
              color="primary"
              shape="rounded"
              className="margin-left-8 padding-left-80 padding-right-80 font-size-13 bg-color-33afff border-33afff"
              onClick={submitToReview}
            >
              提交审核
            </Button>
          </div>
        );
      }
    } else {
      return null;
    }
  };
  const toGetMedicine = () => {
    navigate("/takeMedicine", { state: dataSource });
  };
  const canEdit = () => {
    if (!paramsRef.current?.cloudroomPrescriptId) {
      return true;
    }
    if (logStatus === CheckStatus.CanEdit) {
      return true;
    }
    return false;
  };
  //审核员签名
  const verifySignClick = async () => {
    toastHandler.current = Toast.show({
      icon: "loading",
      content: "加载中…",
    });
    const cloudroomPrescriptId = paramsRef?.current?.cloudroomPrescriptId;
    try {
      const response = await verifySignApi({ cloudroomPrescriptId });
      response.data && (window.location.href = response.data);
    } catch (error) {
      toastHandler.current?.close();
    }
  };
  //医生签名
  const doctorSignClick = async () => {
    //签名之前要先提交处方拿到处方Id传给契约签名那边
    let cloudroomPrescriptId = paramsRef?.current?.cloudroomPrescriptId;
    if (!cloudroomPrescriptId) {
      const params = handleSubmit();
      if (!params) {
        return;
      }
      toastHandler.current = Toast.show({
        icon: "loading",
        content: "加载中…",
      });
      try {
        const res = await prescriptAdd(params);
        cloudroomPrescriptId = res.data;
      } catch (error) {
        toastHandler.current?.close();
      }
    }
    try {
      const response = await doctorSignApi({ cloudroomPrescriptId });
      setUrlSearch(
        {
          cloudroomOrderId: paramsRef?.current?.cloudroomOrderId,
          cloudroomPrescriptId,
        },
        { replace: true }
      );
      response.data && (window.location.href = response.data);
    } catch (error) {
      toastHandler.current?.close();
    }
  };
  const getCheckerSign = () => {
    if (!!verifyId || dataSource?.canVerify === "是") {
      //存在审核员的签名照片或者是审核员
      return (
        <div className="bg-color-ffffff margin-top-12 border-radius-12 padding-16">
          <div className="border-bottom-f2f2f2 padding-bottom-16 flex justify-between align-center">
            <div className="font-bold">
              <span className="font-size-16 color-e75353">*</span>
              <span>审核员签名</span>
            </div>
            {/* {!!verifyId &&
              dataSource?.canVerify === "是" &&
              logStatus === CheckStatus.ToBeReviewed && (
                <div className="color-33afff font-size-12">重新签名</div>
              )} */}
          </div>
          {!!verifyId ? (
            <Image
              fit="scale-down"
              className="margin-top-12 height-52"
              src={verifySignFileUrl || ""}
            />
          ) : (
            <div className="flex justify-center">
              <Button
                color="primary"
                shape="rounded"
                className="bg-color-33afff border-33afff font-size-12 margin-top-20"
                onClick={verifySignClick}
              >
                点击签名
              </Button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  return (
    <>
      <div className="prescription-review">
        {role === Role.USER && (
          <div className="bg-color-ffffff border-radius-12 padding-16 margin-bottom-12">
            <div className="font-bold font-size-16">您本次诊断有处方药品</div>
            <div
              className="margin-top-12 line-height-20"
              style={{ color: "rgba(23,26,29,0.4)" }}
            >
              目前暂未开通处方药品快递配送服务，感谢您的理解和支持！
            </div>
            <div className="flex justify-center">
              <Button
                className="width-200 height-36 margin-top-32 bg-color-007fff color-ffffff border-radius-8"
                onClick={toGetMedicine}
              >
                到院取药
              </Button>
            </div>
          </div>
        )}

        <div className="baseInfo">
          <div className="base-title flex align-center">
            <span>基本信息</span>
          </div>
          <div className="baseInfo-item-large">
            <div className="width-70">{orderInfo?.patientName}</div>
            {!!orderInfo?.patientSex && (
              <div className="margin-left-40">{orderInfo?.patientSex}</div>
            )}
            <div className="margin-left-40">{orderInfo?.patientAge}岁</div>
          </div>
          <div className="baseInfo-item">
            <div className="width-70">科室</div>
            <div className="margin-left-40">{orderInfo?.keshiName}</div>
          </div>
          <div className="baseInfo-item">
            <div className="width-70">生成时间</div>
            <div className="margin-left-40">
              {orderInfo?.createTime || changeDateFormat(new Date())}
            </div>
          </div>
        </div>

        <InquiryResult
          value={inquiryResult}
          onChange={onResultSelect}
          // onDeleteItem={onResultDelete}
          onOptions={onOptions}
          editable={canEdit()}
        />
        <DrugList
          value={medicineList}
          onDeleteDrug={onDrugDelete}
          onAddDrug={onAddDrug}
          editable={canEdit()}
        />
        {/* 注意事项 */}
        <div className="bg-color-ffffff margin-top-12 padding-16 border-radius-12">
          <div className="border-bottom-f2f2f2 padding-bottom-16 font-bold">
            注意
          </div>
          <TextArea
            value={attention}
            placeholder={"请输入注意事项"}
            className="font-size-14 margin-top-16"
            maxLength={200}
            rows={3}
            showCount
            onChange={onAttendChange}
            disabled={!canEdit()}
          />
        </div>
        {/* 医生签名 */}
        <div className="bg-color-ffffff margin-top-12 border-radius-12 padding-16">
          <div className="border-bottom-f2f2f2 padding-bottom-16 flex justify-between align-center">
            <div className="font-bold">
              <span className="font-size-16 color-e75353">*</span>
              <span>医生签名</span>
            </div>
            {/* {!!doctorSignId && canEdit() && (
              <div className="color-33afff font-size-12">重新签名</div>
            )} */}
          </div>
          {!!doctorSignId ? ( //存在签名就直接显示签名的图片
            <Image
              fit="scale-down"
              className="margin-top-12 height-52"
              src={doctorSignFileUrl || ""}
            />
          ) : (
            <div className="flex justify-center">
              <Button
                color="primary"
                shape="rounded"
                className="bg-color-33afff border-33afff font-size-12 margin-top-20"
                onClick={doctorSignClick}
              >
                点击签名
              </Button>
            </div>
          )}
        </div>
        {/* 金额 */}
        <div className="bg-color-ffffff margin-top-12 border-radius-12 padding-16 flex justify-between font-bold">
          <div>金额</div>
          <div className="color-f53f3f">¥{medicinePrice}</div>
        </div>

        {/* 只有存在这个处方Id才会有以下的表单项*/}
        {!!paramsRef.current?.cloudroomPrescriptId && (
          <>
            {getCheckerSign()}
            {/* 审核时间 签名完成后才会显示审核时间*/}
            {/* 时间存在，并且 已驳回 或者 已通过 才会展示 */}
            {dataSource?.verifyTime &&
            [CheckStatus.Reject, CheckStatus.Approval].includes(logStatus) ? (
              <div className="bg-color-ffffff margin-top-12 border-radius-12 padding-16 flex justify-between font-bold">
                <div>审核时间</div>
                <div className="font-bold">{dataSource?.verifyTime || ""}</div>
              </div>
            ) : null}
            {/**驳回原因 */}
            {role === Role.DOCTOR && logStatus === CheckStatus.Reject && (
              <>
                <div className="bg-color-ffffff margin-top-12 padding-16 border-radius-12">
                  <div className="border-bottom-f2f2f2 padding-bottom-16 font-bold">
                    驳回原因
                  </div>
                  {/* 只是展示 */}
                  <TextArea
                    value={verifyReason}
                    className="font-size-14 margin-top-16"
                    maxLength={200}
                    rows={3}
                    disabled
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      {logStatus !== CheckStatus.Approval && renderBottomByStatus()}
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          paddingBottom: "40px",
        }}
      >
        <div className="padding-left-16 padding-right-16 border-box">
          <div className="padding-top-14 position-relative flex justify-center">
            <div
              className="position-absolute position-right-0 position-top-10"
              onClick={() => setVisible(false)}
            >
              <CloseOutline fontSize={18} />
            </div>
            <span>驳回原因</span>
          </div>
          <div className="bg-color-f6f8fa margin-top-34 padding-16 border-radius-10">
            <div className="font-size-13">
              <span className="color-f53f3f">*</span>
              <span>原因</span>
            </div>
            <TextArea
              value={editReason}
              placeholder={"请输入"}
              className="font-size-14 margin-top-16"
              maxLength={200}
              rows={3}
              onChange={(value) => setEditReason(value)}
            />
          </div>

          <Button
            block
            color="primary"
            shape="rounded"
            className="margin-top-24 font-size-13 bg-color-33afff border-33afff"
            onClick={() => {
              rejectApi();
            }}
          >
            确定
          </Button>
        </div>
      </Popup>
    </>
  );
}
PrescriptionReview.propTypes = {};
export default PrescriptionReview;
