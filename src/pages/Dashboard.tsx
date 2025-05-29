import { useContext } from "react";
import DashboardBody from "../components/pagecomponents/dashboardpage/DashboardBody";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";

const Dashboard = () => {
  const { isSidebarCollapsed } = useContext(SidebarContext);

  return (
    <section id="dashboardSection">
      <div className="container-fluid p-0">
        <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar />
          <MainBody>
            <DashboardBody />
          </MainBody>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
