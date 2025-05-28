import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Table, { Column } from "../components/ui/table/Table";
import Sidebar from "../components/ui/sidebar/Sidebar";
import MainBody from "../components/ui/mainbody/MainBody";
import { fetchAllShipments } from "../redux/slices/activeShipmentSlice";

const statusTitleMap: Record<string, string> = {
  pending: "Pending Shipments",
  active: "Active Shipments",
  hold: "Hold Shipments",
  archived: "Archived Shipments",
};

const ShipmentsPage: React.FC = () => {
  const { shipment_status } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { shipments, loading, error } = useSelector(
    (state: RootState) => state.activeShipment
  );

  useEffect(() => {
    dispatch(fetchAllShipments());
  }, [dispatch]);

  const filteredShipments = useMemo(() => {
    if (!shipment_status) return shipments;
    return shipments.filter(
      (shipment) =>
        shipment.shipment_status?.toLowerCase() ===
        shipment_status.toLowerCase()
    );
  }, [shipments, shipment_status]);

  const tableColumns: Column<any>[] = [
    { header: "Date", accessor: "created_date" },
    { header: "Shipment ID", accessor: "shipment_id" },
    { header: "Sender", accessor: "sender_company_name" },
    { header: "Receiver", accessor: "receiver_company_name" },
    { header: "Origin", accessor: "origin" },
    { header: "Destination", accessor: "destination" },
    { header: "Sender Area", accessor: "sender_areaname" },
    { header: "Receiver Area", accessor: "receiver_areaname" },
    { header: "Sender GST", accessor: "sender_gst_no" },
    { header: "Receiver GST", accessor: "receiver_gst_no" },
    { header: "Status", accessor: "shipment_status" },
  ];

  return (
    <section id="dashboardSection">
      <div className="container-fluid p-0">
        <section className="bodyWrap">
          <Sidebar />
          <MainBody>
            <div className="container-fluid">
              <div className="tableWraper">
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "80vh" }}
                  >
                    <div className="loader" />
                  </div>
                ) : error ? (
                  <p>Error: {error}</p>
                ) : (
                  <Table
                    columns={tableColumns}
                    data={filteredShipments}
                    sectionTitle={
                      statusTitleMap[shipment_status || ""] ||
                      "Active Shipments"
                    }
                  />
                )}
              </div>
            </div>
          </MainBody>
        </section>
      </div>
    </section>
  );
};

export default ShipmentsPage;
