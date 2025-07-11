import { ReactNode, useContext } from "react";
import { SidebarContext } from "../../../contexts/SidebarContext";
import "../mainbody/MainBody.scss";
import Footer from "../footer/Footer";

interface MainBodyProps {
  children: ReactNode;
}

const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  const { isSidebarCollapsed } = useContext(SidebarContext);

  return (
    <main
      id="mainBodySection"
      className={`${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      {children}
      <Footer />
    </main>
  );
};

export default MainBody;
