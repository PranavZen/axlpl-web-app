import { useContext } from "react";
import "../footer/Footer.scss";
import { SidebarContext } from "../../../contexts/SidebarContext";

const Footer = () => {
  const { isSidebarCollapsed } = useContext(SidebarContext);
  return (
    <footer
      id="footerSection"
      className={`${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <span>© 2025 Ambe Xpress Logistics Pvt. Ltd.</span>
    </footer>
  );
};

export default Footer;
