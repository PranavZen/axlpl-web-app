import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressForm, { AddressFormData, initialAddressFormData } from "../components/pagecomponents/addressespage/forms/AddressForm";
import { validateAddressForm } from "../utils/validationUtils";
import ConfirmationModal from "../components/ui/modals/ConfirmationModal";
import FormModal from "../components/ui/modals/FormModal";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import Table, { Column } from "../components/ui/table/Table";
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from "../redux/slices/addressSlice";
import { AppDispatch, RootState } from "../redux/store";
import { showError, showSuccess } from "../utils/toastUtils";

const Addresses: React.FC = () => {
  const [searchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>(initialAddressFormData);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, loading, error } = useSelector(
    (state: RootState) => state.address
  );
  useEffect(() => {
    dispatch(fetchAddresses(searchQuery));
  }, [dispatch, searchQuery]);

  // Reset form data when component mounts
  useEffect(() => {
    setFormData(initialAddressFormData);
  }, []);

  // Update form data when editing an address
  useEffect(() => {
    if (editingAddress) {
      console.log("🔍 EditingAddress data:", editingAddress);
      console.log("📍 Available fields:");
      console.log("  - state_id:", editingAddress.state_id, "| state_name:", editingAddress.state_name);
      console.log("  - city_id:", editingAddress.city_id, "| city_name:", editingAddress.city_name);
      console.log("  - area_id:", editingAddress.area_id, "| area_name:", editingAddress.area_name);

      const formDataToSet = {
        name: editingAddress.name || "",
        company_name: editingAddress.company_name || "",
        country_id: editingAddress.country_id || "",
        state_id: editingAddress.state_name || editingAddress.state_id || "", // Use state_name instead of state_id
        city_id: editingAddress.city_name || editingAddress.city_id || "", // Use city_name instead of city_id
        area_id: editingAddress.area_name || editingAddress.area_id || "", // Use area_name instead of area_id
        zip_code: editingAddress.zip_code || "",
        address1: editingAddress.address1 || "",
        address2: editingAddress.address2 || "",
        mobile_no: editingAddress.mobile_no || "",
        email: editingAddress.email || "",
        sender_gst_no: editingAddress.sender_gst_no || "",
      };

      console.log("✅ Form data being set:", formDataToSet);
      setFormData(formDataToSet);
    }
  }, [editingAddress]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle select change for SingleSelect component
  const handleSelectChange = (name: string) => (option: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: option ? option.value : "",
    }));
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsEditMode(false);
    setFormData(initialAddressFormData);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setIsEditMode(false);
    setFormData(initialAddressFormData);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const errors = validateAddressForm(formData);
    setFormErrors(errors);

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      showError("Please fix the validation errors before submitting.");
      return;
    }

    setFormSubmitting(true);
    try {
      if (isEditMode && editingAddress) {
        // Handle update address
        await dispatch(updateAddress({ id: editingAddress.id, ...formData }));
        showSuccess("Address updated successfully!");
      } else {
        // Handle add new address
        await dispatch(addAddress(formData));
        showSuccess("Address added successfully!");
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error saving address:", error);
      showError("Failed to save address. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle edit address
  const handleEditAddress = (addressId: string) => {
    // Find the address with the given ID
    const addressToEdit = addresses.find((addr) => addr.id === addressId);
    if (addressToEdit) {
      setEditingAddress(addressToEdit);
      setIsEditMode(true);
      setShowAddForm(true);
    } else {
      alert(`Address with ID ${addressId} not found`);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (addressId: string) => {
    setAddressToDelete(addressId);
    setShowDeleteConfirm(true);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
  };

  // Handle confirm delete address
  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    setDeletingId(addressToDelete);
    try {
      await dispatch(deleteAddress(addressToDelete));
      showSuccess("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      showError("Failed to delete address. Please try again.");
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    }
  };

  // Handle view address (will open modal automatically)
  const handleViewAddress = (address: any) => {
    console.log("View address:", address);
    // The view modal will automatically open with address details
  };

  // Row action handlers for the new table
  const handleEditAddressRow = (address: any) => {
    handleEditAddress(address.id);
  };

  const handleDeleteAddressRow = (address: any) => {
    showDeleteConfirmation(address.id);
  };

  const tableColumns: Column<any>[] = [
    { header: "Company Name", accessor: "company_name" },
    { header: "Name", accessor: "name" },
    { header: "City", accessor: "city_name" },
    { header: "Address 1", accessor: "address1" },
    { header: "Address 2", accessor: "address2" },
  ];

  return (
    <section id="dashboardSection">
      <div className="container-fluid p-0">
        <section className="bodyWrap">
          <Sidebar />
          <MainBody>
            <div className="container-fluid">
              <div className="tableWraper">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <h1 className="me-3">Saved Addresses</h1>
                    <button
                      className="btn btn-success"
                      onClick={handleAddNewAddress}
                    >
                      <i className="fas fa-plus me-2"></i> Add New Address
                    </button>
                  </div>
                </div>
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
                    data={addresses}
                    sectionTitle=""
                    rowActions={{
                      onEdit: handleEditAddressRow,
                      onDelete: handleDeleteAddressRow,
                      onView: handleViewAddress
                    }}
                    rowIdAccessor="id"
                  />
                )}
              </div>
            </div>
          </MainBody>
        </section>
      </div>

      {/* Use the reusable FormModal component with AddressForm content */}
      <FormModal
        isOpen={showAddForm}
        title={isEditMode ? "Edit Address" : "Add New Address"}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        submitText={isEditMode ? "Update Address" : "Save Address"}
        isSubmitting={formSubmitting}
        size="lg"
      >
        <AddressForm
          formData={formData}
          isEditMode={isEditMode}
          formSubmitting={formSubmitting}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onCancel={handleCloseForm}
          errors={formErrors}
        />
      </FormModal>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={!!deletingId}
        confirmButtonVariant="danger"
      />

      <ToastContainer />
    </section>
  );
};

export default Addresses;
