import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Image } from "antd-mobile";
import PropTypes from "prop-types";
import "./index.scss";
import { getPrescriptByKeyWord } from "@/api/Prescript";
function EPrescribing(props) {
  const currentLocation = useLocation();
  const [imageUrl, setImageUrl] = useState("");
  const cloudroomOrderId = currentLocation.state;
  useEffect(() => {
    getPrescript();
  }, []);
  const getPrescript = async () => {
    const res = await getPrescriptByKeyWord({ cloudroomOrderId });
    setImageUrl(res.data.fileUrl);
  };
  return (
    <div className="e-prescribing">
      <Image src={imageUrl} />
    </div>
  );
}
EPrescribing.propTypes = {
  // dataSource: PropTypes.object.isRequired,
};
export default EPrescribing;
