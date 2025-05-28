import { ReactNode, useContext } from "react";
import Header from "../header/Header";
import "../mainbody/MainBody.scss";
import { SidebarContext } from "../../../contexts/SidebarContext";

interface MainBodyProps {
  children: ReactNode;
}

const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  const { isSidebarCollapsed } = useContext(SidebarContext);

  return (
    <section className={`d-flex flex-column flex-grow-1 ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Header />
      <main id="mainBodySection">{children}</main>
    </section>
  );
};

export default MainBody;
