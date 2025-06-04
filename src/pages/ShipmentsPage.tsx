import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Table, { Column } from "../components/ui/table/Table";
import Sidebar from "../components/ui/sidebar/Sidebar";
import MainBody from "../components/ui/mainbody/MainBody";
import { fetchAllShipments } from "../redux/slices/activeShipmentSlice";
import { setShipment } from "../redux/slices/editShipmentSlice";

const statusTitleMap: Record<string, string> = {
  pending: "Pending Shipments",
  approved: "Active Shipments", // Maps to "Active Shipments" as per sidebar
  hold: "Hold Shipments",
  archived: "Archived Shipments",
};

const ShipmentsPage: React.FC = () => {
  const { shipment_status } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { shipments, loading, error } = useSelector(
    (state: RootState) => state.activeShipment
  );
  const [selectedShipments, setSelectedShipments] = useState<any[]>([]);

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

  // Handle row selection change
  const handleShipmentSelectionChange = (newSelectedShipments: any[]) => {
    setSelectedShipments(newSelectedShipments);
    console.log("Selected shipments:", newSelectedShipments);
  };

  // Handle view shipment (will open modal automatically)
  const handleViewShipment = (shipment: any) => {
    console.log("View shipment:", shipment);
    // The view modal will automatically open with shipment details
  };

  // Handle edit shipment
  const handleEditShipment = (shipment: any) => {
    console.log("Edit shipment:", shipment);

    // Check if shipment is active/approved (only allow editing active shipments)
    if (shipment.shipment_status?.toLowerCase() !== 'approved') {
      alert('Only active shipments can be edited');
      return;
    }

    // Set the shipment data in Redux store to avoid API call
    dispatch(setShipment(shipment));

    // Navigate to edit page
    navigate(`/edit-shipment/${shipment.shipment_id}`);
  };

  // Handle delete shipment
  const handleDeleteShipment = (shipment: any) => {
    console.log("Delete shipment:", shipment);
    if (window.confirm(`Are you sure you want to delete shipment ${shipment.shipment_id}?`)) {
      alert(`Shipment ${shipment.shipment_id} deleted successfully!`);
      // Here you would typically call an API to delete the shipment
    }
  };

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
                {/* Show selected shipments info */}
                {selectedShipments.length > 0 && (
                  <div className="alert alert-info mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{selectedShipments.length} shipment(s) selected</strong>
                        <ul className="mb-0 mt-2">
                          {selectedShipments.slice(0, 3).map(shipment => (
                            <li key={shipment.shipment_id}>
                              {shipment.shipment_id} - {shipment.sender_company_name} → {shipment.receiver_company_name}
                            </li>
                          ))}
                          {selectedShipments.length > 3 && (
                            <li>... and {selectedShipments.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => alert(`Exporting ${selectedShipments.length} shipments...`)}
                        >
                          Export Selected
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => {
                            if (window.confirm(`Update status for ${selectedShipments.length} selected shipments?`)) {
                              alert(`Status updated for ${selectedShipments.length} shipments!`);
                              setSelectedShipments([]);
                            }
                          }}
                        >
                          Update Status
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            if (window.confirm(`Delete ${selectedShipments.length} selected shipments?`)) {
                              alert(`${selectedShipments.length} shipments deleted!`);
                              setSelectedShipments([]);
                            }
                          }}
                        >
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                    enableRowSelection={true}
                    selectedRows={selectedShipments}
                    onRowSelectionChange={handleShipmentSelectionChange}
                    rowActions={{
                      onEdit: handleEditShipment,
                      onDelete: handleDeleteShipment,
                      onView: handleViewShipment
                    }}
                    rowIdAccessor="shipment_id"
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
