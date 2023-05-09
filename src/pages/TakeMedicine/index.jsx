import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, Button, SearchBar, ImageViewer } from "antd-mobile";
import { ExclamationCircleOutline } from "antd-mobile-icons";
import DrugList from "@/pagesBoth/PrescriptionReview/components/DrugList";
import doctorAvatar from "@/assets/images/doctor-avatar.png";
import { changeDateFormat, downloadFileByUrl } from "@/utils/common";
function TakeMedicine() {
  const navigate = useNavigate();
  const location = useLocation();
  const [detailData, setDetailData] = useState(location.state || {});
  const [imageViewerVal, setImageViewerVal] = useState("");
  // const detailData = location.state || {}
  // {
  //   cloudroomPrescriptId: 1,
  //   cloudroomOrderId: 22,
  //   doctorId: 0,
  //   doctorSignId: 0,
  //   verifySignId: 0,
  //   verifyId: 0,
  //   verifyTime: null,
  //   verifyReason: null,
  //   remark: "驳回的注意事22333322项",
  //   createTime: "2023-03-24 16:46:09",
  //   updateTime: "2023-03-25 14:38:32",
  //   tbStatus: "正常",
  //   medicineList: [
  //     {
  //       cloudroomPrescriptMedicineId: 43,
  //       cloudroomPrescriptId: 1,
  //       cloudroomMedicineId: 8,
  //       medicineName: "坎地沙坦酯片",
  //       totalNum: 1,
  //       totalUnit: "片",
  //       frequency: "每日一次",
  //       timeNum: 1,
  //       timeUnit: "片",
  //       remark: "1111",
  //       createTime: "2023-03-25 14:38:32",
  //       updateTime: "2023-03-25 14:30:22",
  //       tbStatus: "正常",
  //       takeType: "口服",
  //       medicinePrice: 23,
  //       medicineSpec: "",
  //     },
  //     {
  //       cloudroomPrescriptMedicineId: 44,
  //       cloudroomPrescriptId: 1,
  //       cloudroomMedicineId: 7,
  //       medicineName: "盐酸多杂吸齐片",
  //       totalNum: 1,
  //       totalUnit: "",
  //       frequency: "每日一次",
  //       timeNum: 10,
  //       timeUnit: "",
  //       remark: "测试口服",
  //       createTime: "2023-03-25 14:38:32",
  //       updateTime: "2023-03-25 14:36:57",
  //       tbStatus: "正常",
  //       takeType: "口服",
  //       medicinePrice: 77,
  //       medicineSpec: "",
  //     },
  //     {
  //       cloudroomPrescriptMedicineId: 45,
  //       cloudroomPrescriptId: 1,
  //       cloudroomMedicineId: 4,
  //       medicineName: "富马酸比素洛尔片",
  //       totalNum: 1,
  //       totalUnit: "",
  //       frequency: "每日一次",
  //       timeNum: 1,
  //       timeUnit: "",
  //       remark: "菜的抠脚和是的是的看",
  //       createTime: "2023-03-25 14:38:32",
  //       updateTime: "2023-03-25 14:38:32",
  //       tbStatus: "正常",
  //       takeType: "口服",
  //       medicinePrice: 555,
  //       medicineSpec: "",
  //     },
  //   ],
  //   resultList: [
  //     {
  //       ccloudroomPrescriptResultId: 43,
  //       cloudroomPrescriptId: 1,
  //       cloudroomPrescriptResultCode: "R40.201",
  //       cloudroomPrescriptResultDesc: "意识丧失",
  //       createTime: "2023-03-25 14:38:32",
  //       updateTime: "2023-03-25 14:38:32",
  //       tbStatus: "正常",
  //     },
  //     {
  //       ccloudroomPrescriptResultId: 44,
  //       cloudroomPrescriptId: 1,
  //       cloudroomPrescriptResultCode: "R43.801",
  //       cloudroomPrescriptResultDesc: "嗅觉和味觉障碍",
  //       createTime: "2023-03-25 14:38:32",
  //       updateTime: "2023-03-25 14:38:32",
  //       tbStatus: "正常",
  //     },
  //   ],
  //   patientName: null,
  //   patientSex: null,
  //   patientLogo: null,
  //   patientAge: null,
  //   doctorName: null,
  //   medicinePrice: 655,
  //   medicineSpec: null,
  //   logStatus: "待审核",
  //   title: "云诊断-视频复诊",
  // };

  const renderFooter = () => {
    const downloadBtn = () => {
      downloadFileByUrl(imageViewerVal, `电子处方${changeDateFormat()}`);
    };
    return (
      <div className="text-align-center padding-bottom-20">
        <Button
          color="primary"
          className="padding-lr-56 padding-tb-8 font-size-16 line-height-20 border-radius-8"
          onClick={downloadBtn}
        >
          下 载
        </Button>
      </div>
    );
  };

  return (
    <div className="TakeMedicine padding-16">
      <div className="padding-lr-12 padding-tb-10 bg-color-e0edfe flex align-center border-radius-4 margin-bottom-12">
        <ExclamationCircleOutline className="width-20 height-20 color-007fff" />
        <div className="flex-sub padding-left-8 color-007fff font-size-14">
          目前暂未开通快递配送服务，敬请期待
        </div>
      </div>
      <div className="padding-lr-16 padding-top-16 padding-bottom-12 margin-bottom-12 bg-color-ffffff border-radius-12">
        <div className="border-botttom padding-bottom-12 font-size-16 font-bold border-bottom-f2f2f2">
          到院取药
        </div>
        <div className="margin-tb-12 font-bold font-size-16">
          {detailData.patientName || ""}
        </div>
        <div className="margin-tb-12 flex color-171a1d99 font-size-14">
          <div className="width-90">联系方式</div>
          <div className="flex-sub">
            {detailData.patientMobile || ""}
          </div>
        </div>
        <div className="margin-tb-12 flex color-171a1d99 font-size-14">
          <div className="width-90">取药地址</div>
          <div className="flex-sub">广东省工伤康复中心门诊一楼取药处</div>
        </div>
      </div>
      <div className="padding-bottom-16 margin-bottom-12 bg-color-ffffff border-radius-12">
        <DrugList value={detailData.medicineList} editable={false} />
        <div className="text-align-center">
          <Button
            color="primary"
            className="padding-lr-56 padding-tb-8 font-size-14 line-height-20 border-radius-8"
            onClick={() => {
              setImageViewerVal(detailData.fileUrl || "");
            }}
          >
            查看电子处方
          </Button>
        </div>
      </div>

      {/* 图片查看器 开始 */}
      <ImageViewer
        image={imageViewerVal}
        visible={!!imageViewerVal}
        onClose={() => {
          setImageViewerVal("");
        }}
        renderFooter={renderFooter}
      />
      {/* 图片查看器 结束 */}

      <div className="padding-lr-16 padding-tb-16 margin-bottom-12 bg-color-ffffff border-radius-12 flex justify-between">
        <div className="font-size-16 font-bold">药品总额</div>
        <div className="font-size-16 font-bold color-ff5219">
          ¥{detailData.medicinePrice}
        </div>
      </div>
      <div className="padding-lr-16 padding-tb-16 margin-bottom-12 bg-color-ffffff border-radius-12 flex justify-between">
        <div className="font-size-16 font-bold">付款方式</div>
        <div className="font-size-16 font-bold">到院付款</div>
      </div>
    </div>
  );
}

export default TakeMedicine;
