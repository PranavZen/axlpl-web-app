import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressForm, {
  AddressFormData,
  initialAddressFormData,
} from "../components/pagecomponents/addressespage/forms/AddressForm";
import { validateAddressForm } from "../utils/validationUtils";
import ConfirmationModal from "../components/ui/modals/ConfirmationModal";
import FormModal from "../components/ui/modals/FormModal";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import Table, { Column } from "../components/ui/table/Table";
import { LogisticsLoader } from "../components/ui/spinner";
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from "../redux/slices/addressSlice";
import { AppDispatch, RootState } from "../redux/store";
import { showError, showSuccess } from "../utils/toastUtils";
import Button from "../components/ui/button/Button";
import "../styles/global/AddShipment.scss";

const Addresses: React.FC = () => {
  const [searchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>(
    initialAddressFormData
  );
  // console.log("formData", formData)
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
    const formDataToSet = {
      name: editingAddress.name || "",
      company_name: editingAddress.company_name || "",
      country_id: editingAddress.country_id || "",
      state_id: {
        value: String(editingAddress.state_id),
        label: editingAddress.state_name,
      },
      city_id: {
        value: String(editingAddress.city_id),
        label: editingAddress.city_name,
      },
      area_id: {
        value: String(editingAddress.area_id),
        label: editingAddress.area_name,
      },
      zip_code: editingAddress.zip_code || "",
      address1: editingAddress.address1 || "",
      address2: editingAddress.address2 || "",
      mobile_no: editingAddress.mobile_no || "",
      email: editingAddress.email || "",
      sender_gst_no: editingAddress.sender_gst_no || "",
    };

    setFormData(formDataToSet);

    // These ensure the input display is correct when editing
    // setStateLabel(editingAddress.state_name || "");
    // setCityLabel(editingAddress.city_name || "");
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
        [name]: "",
      }));
    }
  };

  // Handle select change for SingleSelect component
  const handleSelectChange = (name: string) => (option: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: option || { value: "", label: "" },
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
    console.log("formData", formData);
    const errors = validateAddressForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      showError("Please fix the validation errors before submitting.");
      return;
    }

    const payload = {
      ...formData,
      state_id: formData.state_id?.value || "",
      city_id: formData.city_id?.value || "",
      area_id: formData.area_id?.value || "",
      country_id: formData.country_id || "1",
    };
    console.log("payload", payload);
    setFormSubmitting(true);
    try {
      if (isEditMode && editingAddress) {
        await dispatch(updateAddress({ id: editingAddress.id, ...payload }));
        showSuccess("Address updated successfully!");
      } else {
        await dispatch(addAddress(payload));
        showSuccess("Address added successfully!");
      }
      handleCloseForm();
    } catch {
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
      showError("Failed to delete address. Please try again.");
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    }
  };

  // Handle view address (will open modal automatically)
  const handleViewAddress = (address: any) => {
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
                <div className="d-flex justify-content-end align-items-end form-navigation bg-white pt-4 p-0 w-100 border-0">
                  <div className="navigation-buttons">
                    {/* <h1 className="me-3">Saved Address</h1> */}
                    {/* <button
                      className="btn btn-success"
                      onClick={handleAddNewAddress}
                    >
                      <i className="fas fa-plus me-2"></i> Add New Address
                    </button> */}
                    <Button
                      text="Add New Address"
                      type="button"
                      className="btn btn-primary btn-next"
                      onClick={handleAddNewAddress}
                    />
                  </div>
                </div>
                {loading ? (
                  <LogisticsLoader />
                ) : error ? (
                  <p>Error: {error}</p>
                ) : (
                  <Table
                    columns={tableColumns}
                    data={addresses}
                    sectionTitle="Saved Address"
                    rowActions={{
                      onEdit: handleEditAddressRow,
                      onDelete: handleDeleteAddressRow,
                      onView: handleViewAddress,
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
