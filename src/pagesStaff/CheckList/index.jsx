/*
 * @Author: gaowenzhao lu7025199@163.com
 * @Date: 2023-03-23 10:17:04
 * @LastEditors: gaowenzhao lu7025199@163.com
 * @LastEditTime: 2023-03-23 15:08:16
 * @FilePath: \h5-cloud-hospital\src\pages\CheckOffice\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  InfiniteScroll,
  List,
  Toast,
  PullToRefresh,
  Image,
  ImageViewer,
} from "antd-mobile";
import PropTypes from "prop-types";
import { RightOutline } from "antd-mobile-icons";
import "./index.scss";
import { checkListApi } from "@/api/CheckList";
import { getUrlParams } from "@/utils/common";
import InfiniteScrollContent from "@/components/InfiniteScrollContent";
function CheckList(props) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentImages, setCurrentImages] = useState([]);
  const icon_checkout_list =
    "https://mjlc.oss-cn-beijing.aliyuncs.com/a/image/icon_checkout_list.png";
  const currentLocation = useLocation();
  const params = getUrlParams(currentLocation.search);
  const patientId = params?.patientId || "";
  console.log("patientId", patientId);
  let initParams = {
    currentNum: 0,
    size: 10,
    patientId,
  };
  const paramsRef = useRef(initParams);
  async function loadMore() {
    const args = {
      ...paramsRef.current,
      currentNum: paramsRef.current.currentNum + 1,
    };
    paramsRef.current = args;
    await getDataSource();
  }
  async function onRefresh() {
    paramsRef.current.currentNum = 1;
    await getDataSource();
  }
  async function getDataSource() {
    try {
      const response = await checkListApi(paramsRef.current);
      const append = response.data.records;
      //todo test
      // append.push(
      //   {
      //     doctorName: "测试",
      //     fileList: [
      //       {
      //         fileUrl:
      //           "https://img1.baidu.com/it/u=413643897,2296924942&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1680886800&t=2e8101cfd2fceeddefc4507dd9dd2167",
      //       },
      //       {
      //         fileUrl:
      //           "https://img0.baidu.com/it/u=1684532727,1424929765&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1680886800&t=b2013e63d98b577e1ce28e9f2b40b07e",
      //       },
      //     ],
      //   },
      //   {
      //     doctorName: "测试111",
      //     fileList: [
      //       {
      //         fileUrl:
      //           "https://img2.baidu.com/it/u=2028084904,3939052004&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1680886800&t=6a501dff3c9ea713b20ea728609d4966",
      //       },
      //     ],
      //   }
      // );

      if (append?.length > 0) {
        if (paramsRef.current.currentNum === 1) {
          setDataSource(append);
        } else {
          setDataSource((val) => [...val, ...append]);
        }
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
      Toast.show(error);
    }
  }
  const previewImage = (fileList) => {
    if (fileList?.length > 0) {
      setVisible(true);
      setCurrentImages(fileList.map((item) => item.fileUrl));
    } else {
      Toast.show("没有报告文件");
    }
  };
  return (
    <>
      <div className="check-list">
        <PullToRefresh onRefresh={onRefresh}>
          <div className="border-radius-10">
            <List
              style={{
                "--border-top": "none",
                "--border-inner": "none",
                "--border-bottom": "none",
              }}
            >
              {dataSource.map((item, index) => (
                <List.Item key={index}>
                  <div
                    key={index}
                    className="padding-top-4 padding-bottom-4  flex align-center position-relative"
                    onClick={() => previewImage(item?.fileList)}
                  >
                    <Image
                      src={icon_checkout_list}
                      className="width-44 height-44"
                    />
                    <div className="margin-left-8">
                      <div>{item?.reportTime}</div>
                      <div className="margin-top-4 color-b6b6b6 line-height-18">
                        医师：{item?.doctorName}
                      </div>
                    </div>
                    <RightOutline
                      className="color-b6b6b6 position-absolute position-right-16"
                      fontSize={14}
                    />
                  </div>
                </List.Item>
              ))}
            </List>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
              <InfiniteScrollContent
                hasMore={hasMore}
                data={dataSource}
                emptyTips="暂无相关检验信息"
              />
            </InfiniteScroll>
          </div>
        </PullToRefresh>
      </div>

      <ImageViewer.Multi
        images={currentImages}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
CheckList.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default CheckList;
