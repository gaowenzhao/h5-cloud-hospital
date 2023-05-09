import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextArea,
  Button,
  ImageUploader,
  ImageViewer,
  Toast,
  Dialog,
} from "antd-mobile";
import {
  RightOutline,
  AddOutline,
  ExclamationCircleOutline,
} from "antd-mobile-icons";
import { choosePatientByApp } from "@/utils/appGlobal";
import { cloudroomOrderAdd, mediaInfoUpload } from "@/api/OrderEdit";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "@/store/userSlice";
import { getPatientInfo, cloudroomOrderList } from "@/api/Home";
import dayjs from "dayjs";

function OrderEdit() {
  const dispatch = useDispatch();
  const location = useLocation();
  // 医生信息
  const [doctorAndTime, setDoctorAndTime] = useState(location.state || {});

  const navigate = useNavigate();

  const [textAreaValue, setTextAreaValue] = useState("");
  const [imageViewerVal, setImageViewerVal] = useState("");

  const userId = useSelector((state) => {
    return state.user.userId;
  });
  const userInfo = useSelector((state) => {
    return state.user.userInfo;
  });
  // 接口请求中
  const loading = useSelector((state) => {
    return state.counter.loading;
  });

  const [fileList, setFileList] = useState([
    // {
    //   url: demoSrc,
    // },
  ]);
  const handleSubmit = () => {
    if (loading > 0) {
      console.log("🚀 loading", loading);
      return;
    }
    const params = {
      cloudroomArrangeId: doctorAndTime.cloudroomArrangeId, // 排班表id
      costNum: doctorAndTime.price.includes(".")
        ? doctorAndTime.price * 100
        : doctorAndTime.price, // 支付费用
      costType: "", // 支付类型  1
      diagnoseType: "视频问诊", // 问诊类型
      diseaseDesc: textAreaValue || "", // 疾病描述
      doctorAccount: doctorAndTime.doctorId, // 医生工号
      doctorId: doctorAndTime.doctorId, // 预约医生id
      doctorName: doctorAndTime.doctorName || "", // 预约医生
      hospital: doctorAndTime.hospitalName || "", // 就诊医院
      keshiId: doctorAndTime.officeslId || "", // 科室id
      keshiName: doctorAndTime.officesName || "", // 预约科室
      mobile: userInfo.mobile || "", // 手机号
      orderNo: "", // 订单号
      patientId: userInfo.patientId || "", // 就诊人id
      patientName: userInfo.userName || "", // 就诊人
      prepareDate: doctorAndTime.curDay || "", // 预约日期 YYYY-MM-DD
      prepareStartTime: `${doctorAndTime.activetTime || ""}`.split("-")[0], // 预约开始时间
      prepareTimeSlot: doctorAndTime.activetTime || "", // 预约时间段
      annexList: fileList.map((v) => {
        return { fileUrl: v.url };
      }), // 报告附件
      userId: userId, // 发起人id
    };
    cloudroomOrderAdd(params).then((res) => {
      navigate("/orderPay", {
        state: {
          cloudroomOrderId: res.data.cloudroomOrderId,
        },
        // replace: true,
      });
    });
  };
  const mockUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    let res = await mediaInfoUpload(formData);
    return res.data || {};
  };
  const imageUploaderChange = (val) => {
    setFileList([...val]);
  };
  const beforeUpload = (file) => {
    if (fileList.length >= 5) {
      Toast.show({
        icon: <ExclamationCircleOutline className="color-ffc16f" />,
        content: "图片最多 5 张",
      });
      return null;
    }
    return file;
  };

  // 切换就诊人
  const handleChangePatient = () => {
    choosePatientByApp().then((res) => {
      if (res && res.patient_id) {
        getPatientInfoDetail(res.patient_id);
      }
    });
  };
  // 切换就诊人的时候 patient_id 获取 就诊人 详情
  const getPatientInfoDetail = (patientId = "") => {
    getPatientInfo({ patientId }).then((res) => {
      dispatch(setUserInfo(res.data || {}));
    });
  };
  return (
    <div className="OrderEdit padding-12">
      <div className="padding-lr-16 border-radius-8 bg-color-ffffff margin-bottom-12">
        <div
          className="padding-tb-16 flex align-center font-size-17"
          onClick={handleChangePatient}
        >
          <div className="width-130">就诊人</div>
          <div className="flex-sub">
            {`${userInfo.userName || ""}`.slice(0, 1)}*
            {`${userInfo.userName || ""}`.slice(2)}
          </div>
          <RightOutline className="color-bdc1c4d9 font-size-24" />
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-tb-16 flex align-center font-size-17">
          <div className="width-130">手机号</div>
          <div className="flex-sub">
            {`${userInfo.mobile || ""}`.slice(0, 4)}****
            {`${userInfo.mobile || ""}`.slice(8)}
          </div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-tb-16 flex align-center font-size-17">
          <div className="width-130">就诊医院</div>
          <div className="flex-sub">{doctorAndTime.hospitalName || ""}</div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-tb-16 flex align-center font-size-17">
          <div className="width-130">预约科室</div>
          <div className="flex-sub">{doctorAndTime.officesName || ""}</div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-tb-16 flex align-center font-size-17">
          <div className="width-130">预约医生</div>
          <div className="flex-sub">{doctorAndTime.doctorName || ""}</div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-tb-16 flex align-center font-size-17">
          <div className="width-130">支付类型</div>
          <div className="flex-sub">自费</div>
        </div>
      </div>
      <div className="padding-lr-12 border-radius-8 bg-color-ffffff font-size-17 padding-bottom-12 margin-bottom-12">
        <div className="padding-tb-12 flex align-center">
          <div className="width-12 height-12 text-align-center color-ff5219">
            *
          </div>
          <div className="flex-sub font-bold">病情描述</div>
        </div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="padding-12 bg-color-f5f5f5 margin-top-12 border-radius-4">
          <TextArea
            placeholder="请输入您的性别、年龄、疾病发生的部位、主要症状、持续时间、已就诊的信息和主治医生的建议（不少于5个字）"
            value={textAreaValue}
            autoSize={{ minRows: 5 }}
            onChange={(val) => {
              if (
                val.length < textAreaValue.length ||
                textAreaValue.length < 200
              ) {
                setTextAreaValue(val);
              }
            }}
          />
          <div className="text-align-right opacity-4">
            {textAreaValue.length}/200
          </div>
        </div>
      </div>
      <div className="padding-lr-12 border-radius-8 bg-color-ffffff font-size-17 padding-bottom-12 margin-bottom-12">
        <div className="padding-tb-12 font-bold">报告附件</div>
        <div className="height-1 bg-color-111f2c1f"></div>
        <div className="flex margin-top-12">
          <ImageUploader
            showFailed={false}
            value={fileList}
            onChange={imageUploaderChange}
            upload={mockUpload}
            beforeUpload={beforeUpload}
          >
            <div className="flex">
              <div className="width-80 height-80 flex justify-center align-center bg-color-f5f5f5 border-radius-4">
                <div className="width-22 height-22 flex justify-center align-center bg-color-007fff border-radius-12">
                  <AddOutline className="color-ffffff font-size-16" />
                </div>
              </div>

              <div className="padding-left-16 opacity-4 font-size-17">
                <div className="margin-bottom-8">上传图片（最多5张）</div>
                <div className="line-height-24">
                  <div>如：症状部位、检查报告、</div>
                  <div>其他疾病资料</div>
                </div>
              </div>
            </div>
          </ImageUploader>
        </div>
      </div>
      {/* 图片查看器 开始 */}
      <ImageViewer
        image={imageViewerVal}
        visible={!!imageViewerVal}
        onClose={() => {
          setImageViewerVal("");
        }}
      />
      {/* 图片查看器 结束 */}

      <div className="padding-46"></div>
      {/* 底部 按钮 开始 */}
      <div className="height-66 padding-tb-12 padding-lr-16 position-fixed position-left-0 position-bottom-0 bg-color-ffffff position-right-0">
        <Button
          block
          color="primary"
          className="height-44 border-radius-8 font-size-17"
          disabled={textAreaValue.length < 5}
          onClick={() => {
            handleSubmit();
          }}
        >
          提交预约
        </Button>
      </div>
      {/* 底部 按钮 结束 */}
    </div>
  );
}

export default OrderEdit;
