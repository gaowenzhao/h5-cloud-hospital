import { useNavigate } from "react-router-dom";
import { NavBar } from "antd-mobile";
import PropTypes from "prop-types";
import "./index.scss";
function Header({ children, onBack }) {
  const navigate = useNavigate();
  const back = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  return (
    <div className="header-bar-contain">
      <NavBar onBack={back}>{children}</NavBar>
    </div>
  );
}
Header.propTypes = {
  onBack: PropTypes.func,
};
export default Header;
