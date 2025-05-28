import { ReactNode, useContext } from "react";
import { SidebarContext } from "../../../contexts/SidebarContext";
import "../mainbody/MainBody.scss";

interface MainBodyProps {
  children: ReactNode;
}

const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  const { isSidebarCollapsed } = useContext(SidebarContext);

  return (
    <section className={`${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* <Header /> */}
      <main id="mainBodySection">{children}</main>
    </section>
  );
};

export default MainBody;
