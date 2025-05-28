import DashboardBody from "../components/pagecomponents/dashboardpage/DashboardBody";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";

const Dashboard = () => {
  return (
    <section id="dashboardSection">
      <div className="container-fluid p-0">
        <section className="bodyWrap">
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
