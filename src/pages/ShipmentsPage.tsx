import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { LogisticsLoader } from "../components/ui/spinner";
import Table, { Column } from "../components/ui/table/Table";
import { fetchAllShipments } from "../redux/slices/activeShipmentSlice";
import { AppDispatch, RootState } from "../redux/store";

const statusTitleMap: Record<string, string> = {
  pending: "Pending Shipments",
  approved: "Active Shipments", // Maps to "Active Shipments" as per sidebar
  hold: "Hold Shipments",
  archived: "Archived Shipments",
};

const ShipmentsPage: React.FC = () => {
  const { shipment_status } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { shipments, loading, error } = useSelector(
    (state: RootState) => state.activeShipment
  );
  console.log("shipments Data", shipments);
  console.log("shipment_status Data", shipment_status);
  const [selectedShipments, setSelectedShipments] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchAllShipments(shipment_status));
  }, [dispatch, shipment_status]);

  const filteredShipments = useMemo(() => {
    if (!shipment_status) return shipments;
    const status = shipment_status.toLowerCase();
    if (status === 'approved' || status === 'active') {
      // Show all active statuses
      const activeStatuses = [
        'approved',
        'waiting for pickup',
        'picked up',
        'shipped',
        'out for delivery'
      ];
      return shipments.filter(
        (shipment) => activeStatuses.includes((shipment.shipment_status || '').toLowerCase())
      );
    } else if (status === 'pending') {
      return shipments.filter(
        (shipment) => (shipment.shipment_status || '').toLowerCase() === 'pending'
      );
    } else if (status === 'hold') {
      return shipments.filter(
        (shipment) => (shipment.shipment_status || '').toLowerCase() === 'hold'
      );
    } else if (status === 'archived') {
      const archivedStatuses = ['delivered', 'cancelled', 'returned'];
      return shipments.filter(
        (shipment) => archivedStatuses.includes((shipment.shipment_status || '').toLowerCase())
      );
    }
    // Default fallback
    return shipments;
  }, [shipments, shipment_status]);

  // Handle row selection change
  const handleShipmentSelectionChange = (newSelectedShipments: any[]) => {
    setSelectedShipments(newSelectedShipments);
  };

  // Handle view shipment (will open modal automatically)
  const handleViewShipment = (shipment: any) => {
    // The view modal will automatically open with shipment details
  };



  // Handle delete shipment
  const handleDeleteShipment = (shipment: any) => {
    if (window.confirm(`Are you sure you want to delete shipment ${shipment.shipment_id}?`)) {
      alert(`Shipment ${shipment.shipment_id} deleted successfully!`);
      // Here you would typically call an API to delete the shipment
    }
  };

  // Handle edit shipment
  const handleEditShipment = (shipment: any) => {

    // Check if shipment is active/approved (only allow editing active shipments)
    if (shipment.shipment_status?.toLowerCase() !== 'approved') {
      alert('Only active/approved shipments can be edited');
      return;
    }

    // For now, show available shipment data that can be edited
    const editableFields = [
      `Shipment ID: ${shipment.shipment_id}`,
      `Sender Company: ${shipment.sender_company_name || 'N/A'}`,
      `Receiver Company: ${shipment.receiver_company_name || 'N/A'}`,
      `Origin: ${shipment.origin || 'N/A'}`,
      `Destination: ${shipment.destination || 'N/A'}`,
      `Sender Area: ${shipment.sender_areaname || 'N/A'}`,
      `Receiver Area: ${shipment.receiver_areaname || 'N/A'}`,
      `Sender GST: ${shipment.sender_gst_no || 'N/A'}`,
      `Receiver GST: ${shipment.receiver_gst_no || 'N/A'}`,
      `Status: ${shipment.shipment_status || 'N/A'}`,
      `Created: ${shipment.created_date || 'N/A'}`
    ].join('\n');

    alert(`Edit Shipment - Available Data:\n\n${editableFields}\n\nNote: Full edit functionality can be implemented as needed.`);

    // TODO: Implement actual edit functionality
    // This could be:
    // 1. A modal with editable fields
    // 2. Navigation to a dedicated edit page
    // 3. Inline editing in the table
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
                {/* {selectedShipments.length > 0 && (
                  <div className="alert alert-info mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>📋 {selectedShipments.length} shipment(s) selected</strong>
                        <p className="mb-2 mt-2 text-muted">
                          Use the export buttons below to download or print the selected records in your preferred format.
                        </p>
                        <details className="mt-2">
                          <summary className="text-primary" style={{ cursor: 'pointer' }}>
                            View selected shipments ({selectedShipments.length})
                          </summary>
                          <ul className="mb-0 mt-2 small">
                            {selectedShipments.slice(0, 5).map(shipment => (
                              <li key={shipment.shipment_id}>
                                <strong>{shipment.shipment_id}</strong> - {shipment.sender_company_name} → {shipment.receiver_company_name}
                                <span className="text-muted"> ({shipment.shipment_status})</span>
                              </li>
                            ))}
                            {selectedShipments.length > 5 && (
                              <li className="text-muted">... and {selectedShipments.length - 5} more shipments</li>
                            )}
                          </ul>
                        </details>
                      </div>
                      <div className="d-flex gap-2">
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
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setSelectedShipments([])}
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>
                  </div>
                )} */}

                {loading ? (
                  <LogisticsLoader />
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
