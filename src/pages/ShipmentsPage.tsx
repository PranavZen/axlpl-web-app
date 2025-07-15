import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { LogisticsLoader } from "../components/ui/spinner";
import Table, { Column } from "../components/ui/table/Table";
import PrintLabelModal from "../components/ui/modals/PrintLabelModal";
import ConfirmationModal from "../components/ui/modals/ConfirmationModal";
import { fetchAllShipments, deleteShipment } from "../redux/slices/activeShipmentSlice";
import { AppDispatch, RootState } from "../redux/store";
import { showSuccess, showError } from "../utils/toastUtils";

const statusTitleMap: Record<string, string> = {
  pending: "Pending Shipments",
  approved: "Active Shipments", // Maps to "Active Shipments" as per sidebar
  hold: "Hold Shipments",
  archived: "Archived Shipments",
};

const ShipmentsPage: React.FC = () => {
  const { shipment_status } = useParams();
  // console.log("shipment_status", shipment_status);
  const dispatch = useDispatch<AppDispatch>();
  const { shipments, loading, error, deleteLoading } = useSelector(
    (state: RootState) => state.activeShipment
  );
  // console.log("shipments", shipments);
  const [selectedShipments, setSelectedShipments] = useState<any[]>([]);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedShipmentForPrint, setSelectedShipmentForPrint] =
    useState<any>(null);
  const [isPrintingLabel, setIsPrintingLabel] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllShipments(shipment_status));
  }, [dispatch, shipment_status]);

  const filteredShipments = useMemo(() => {
    if (!shipment_status) return shipments;
    const status = shipment_status.toLowerCase();
    if (status === "approved" || status === "active") {
      // Show all active statuses
      const activeStatuses = [
        "approved",
        "waiting for pickup",
        "picked up",
        "shipped",
        "out for delivery",
      ];
      return shipments.filter((shipment) =>
        activeStatuses.includes((shipment.shipment_status || "").toLowerCase())
      );
    } else if (status === "pending") {
      return shipments.filter(
        (shipment) =>
          (shipment.shipment_status || "").toLowerCase() === "pending"
      );
    } else if (status === "hold") {
      return shipments.filter(
        (shipment) => (shipment.shipment_status || "").toLowerCase() === "hold"
      );
    } else if (status === "archived") {
      const archivedStatuses = ["delivered", "cancelled", "returned"];
      return shipments.filter((shipment) =>
        archivedStatuses.includes(
          (shipment.shipment_status || "").toLowerCase()
        )
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

  // Handle delete shipment - Open confirmation modal
  const handleDeleteShipment = (shipment: any) => {
    setShipmentToDelete(shipment);
    setDeleteModalOpen(true);
  };

  // Handle confirmation modal actions
  const handleConfirmDelete = async () => {
    if (!shipmentToDelete) return;

    try {
      const result = await dispatch(deleteShipment(shipmentToDelete.shipment_id));
      
      if (deleteShipment.fulfilled.match(result)) {
        showSuccess(`✅ Shipment ${shipmentToDelete.shipment_id} deleted successfully!`);
        setDeleteModalOpen(false);
        setShipmentToDelete(null);
        // Refresh the shipments list
        dispatch(fetchAllShipments(shipment_status));
      } else {
        showError(`❌ Failed to delete shipment ${shipmentToDelete.shipment_id}`);
      }
    } catch (error) {
      showError(`❌ Failed to delete shipment ${shipmentToDelete.shipment_id}`);
      console.error("Delete error:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setShipmentToDelete(null);
  };

  // Handle edit shipment
  const handleEditShipment = (shipment: any) => {
    // Check if shipment is active/approved (only allow editing active shipments)
    if (shipment.shipment_status?.toLowerCase() !== "pending") {
      alert("Only shipments with status 'Pending' can be edited");
      return;
    }
    navigate(`/shipments/edit/${shipment.shipment_id}`);
  };

  // Handle print shipment label
  const handlePrintShipment = (shipment: any) => {
    setSelectedShipmentForPrint(shipment);
    setPrintModalOpen(true);
  };

  // Handle print label with number of labels
  const handlePrintLabel = async (numberOfLabels: number) => {
    if (!selectedShipmentForPrint) return;

    setIsPrintingLabel(true);
    try {
      // Construct the print URL using the shipment_label format
      const shipmentId = selectedShipmentForPrint.shipment_id;
      const printUrl = `https://new.axlpl.com/admin/shipment/shipment_manifest_pdf/${shipmentId}/${numberOfLabels}`;

      // Open the PDF in a new window/tab for printing
      window.open(printUrl, "_blank");

      showSuccess(
        `✅ Opened ${numberOfLabels} label(s) for shipment ${shipmentId}`
      );

      // Close the modal
      setPrintModalOpen(false);
      setSelectedShipmentForPrint(null);
    } catch (error) {
      showError("❌ Failed to open print labels");
      console.error("Print error:", error);
    } finally {
      setIsPrintingLabel(false);
    }
  };

  // Handle close print modal
  const handleClosePrintModal = () => {
    setPrintModalOpen(false);
    setSelectedShipmentForPrint(null);
    setIsPrintingLabel(false);
  };

  const tableColumns: Column<any>[] = [
    {
      header: "Date",
      accessor: "created_date",
      cell: (value: string) => {
        // Format date to YYYY-MM-DD or locale string without time
        if (!value) return "";
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toISOString().split("T")[0];
      },
    },
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
                      ...(shipment_status === "pending"
                        ? {
                            onEdit: handleEditShipment,
                            onDelete: handleDeleteShipment,
                            onView: handleViewShipment,
                            onPrint: handlePrintShipment,
                          }
                        : {
                            onView: handleViewShipment,
                            onPrint: handlePrintShipment,
                          }),
                    }}
                    rowIdAccessor="shipment_id"
                  />
                )}
              </div>
            </div>
          </MainBody>
        </section>
      </div>

      {/* Print Label Modal */}
      <PrintLabelModal
        isOpen={printModalOpen}
        onClose={handleClosePrintModal}
        onPrint={handlePrintLabel}
        shipmentId={selectedShipmentForPrint?.shipment_id || ""}
        isLoading={isPrintingLabel}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Shipment"
        message={`Are you sure you want to delete shipment ${shipmentToDelete?.shipment_id}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteLoading}
        confirmButtonVariant="danger"
        size="md"
        icon={
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" className="text-danger">
            <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" />
          </svg>
        }
      />
    </section>
  );
};

export default ShipmentsPage;
