import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, TextArea, Image, Input, Toast } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";
import PropTypes from "prop-types";
import "./index.scss";
import CustomTextArea from "./CustomTextArea";
import SelectPicker from "./SelectPicker";
import InquiryResult from "@/components/InquiryResult";
import { diagnoseAdd } from "@/api/CloudroomDiagnose";
import { inquireSummaryEnd } from "@/utils/appGlobal";
function WorkerInquireSummary(props) {
  //app传入订单id
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]); //诊断结果的字典列表
  let cloudroomOrderId = location.search?.split("=")?.[1];
  if (!cloudroomOrderId || cloudroomOrderId === "null") {
    cloudroomOrderId = "";
  }
  const cloudroomDiagnoseAllergyFlag = Form.useWatch(
    "cloudroomDiagnoseAllergyFlag",
    form
  );
  const localStorageSummaryName = `workerInquireSummary-${cloudroomOrderId}`;
  useEffect(() => {
    const dataSource = localStorage.getItem(localStorageSummaryName);
    if (dataSource) {
      form.setFieldsValue(JSON.parse(dataSource));
    }
  }, []);
  const onOptions = (options) => {
    setOptions(
      options?.map((item) => {
        return {
          cloudroomDiagnoseResultCode: item.itemValue,
          cloudroomDiagnoseResultDesc: item.itemLabel,
        };
      })
    );
  };
  const onResultSelect = (values, data) => {
    form.setFieldValue("resultList", values);
  };
  const onSave = () => {
    if (!cloudroomOrderId) {
      Toast.show("订单为空,请传入订单Id");
      return;
    }
    const fieldsValue = form.getFieldsValue();
    localStorage.setItem(localStorageSummaryName, JSON.stringify(fieldsValue));
    Toast.show("保存成功");
  };
  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const fieldsValue = form.getFieldsValue();
      console.log("fieldsValue", fieldsValue);
      const params = { ...fieldsValue, cloudroomOrderId };
      params.resultList = params.resultList?.map((item) => {
        return options.find(
          (option) => option.cloudroomDiagnoseResultCode === item
        );
      });
      if (!cloudroomOrderId) {
        Toast.show("订单为空,请传入订单Id");
        return;
      }
      diagnoseAdd(params)
        .then((res) => {
          if (res.code === 200) {
            Toast.show("提交成功");
            localStorage.removeItem(localStorageSummaryName);
            inquireSummaryEnd();
          } else {
            Toast.show(res.message);
          }
        })
        .catch((err) => {
          Toast.show("提交失敗");
        });
    } catch (errorInfo) {
      Toast.show(errorInfo?.errorFields?.[0]?.errors?.[0]);
    }
  };
  return (
    <>
      <div className="worker-inquire-summary">
        <Form
          form={form}
          style={{
            "--border-inner": "none",
            "--border-bottom": "none",
            "--border-top": "none",
          }}
          initialValues={{}}
        >
          <Form.Item
            name="cloudroomDiagnoseContent"
            label="主述"
            required
            noStyle
            rules={[{ required: true, message: "请输入就诊人的主要症状" }]}
          >
            <CustomTextArea
              placeholder="请输入就诊人的主要症状"
              title="主述"
              maxLength={50}
            />
          </Form.Item>
          <Form.Item
            name="cloudroomDiagnoseAllergyFlag"
            label="过敏史（有/无）"
            required
            noStyle
            rules={[{ required: true, message: "请选择是否有过敏史" }]}
          >
            <SelectPicker title="过敏史" />
          </Form.Item>

          {cloudroomDiagnoseAllergyFlag === "有" && (
            <Form.Item
              name="cloudroomDiagnoseAllergy"
              label="过敏史内容"
              noStyle
              rules={[{ required: true, message: "请输入过敏史" }]}
            >
              <TextArea
                placeholder={"请输入过敏史"}
                className="border-radius-10 padding-16 bg-color-ffffff font-size-14"
                style={{
                  marginTop: "-3vw",
                  boxSizing: "border-box",
                }}
                maxLength={200}
                rows={3}
                showCount
              />
            </Form.Item>
          )}

          <Form.Item
            name="resultList"
            label="诊断结果"
            noStyle
            rules={[{ required: true, message: "请选择诊断结果" }]}
          >
            <InquiryResult onOptions={onOptions} />
          </Form.Item>

          <Form.Item
            name="cloudroomDiagnoseSuggest"
            label="诊断建议"
            required
            noStyle
            rules={[{ required: true, message: "请输入对就诊人的建议" }]}
          >
            <CustomTextArea
              title="诊断建议"
              placeholder="请输入对就诊人的建议"
              maxLength={200}
            />
          </Form.Item>
          <div className="height-100" />
        </Form>
      </div>
      <div className="flex position-fixed position-bottom-0 bg-color-ffffff padding-bottom-30 padding-left-20 padding-top-10 width-100vw">
        <Button
          color="default"
          className="width-98 border-radius-50 font-size-14"
          onClick={onSave}
        >
          保存
        </Button>
        <Button
          type="submit"
          color="primary"
          className="bg-color-33afff border-33afff margin-left-8 border-radius-50 font-size-14 width-238"
          onClick={onFinish}
        >
          提交
        </Button>
      </div>
    </>
  );
}
WorkerInquireSummary.propTypes = {};
export default WorkerInquireSummary;
