import React, { useState } from "react";
import Table, { Column } from "./Table";

// Example showing how to migrate from old table approach to new enhanced table
// This demonstrates the Addresses page use case

interface Address {
  id: string;
  company_name: string;
  name: string;
  city_name: string;
  address1: string;
  address2: string;
  pincode: string;
  state_name: string;
  area_name: string;
  gst_no: string;
  mobile_no: string;
  email: string;
}

// Sample address data
const sampleAddresses: Address[] = [
  {
    id: "1",
    company_name: "Tech Solutions Ltd",
    name: "John Doe",
    city_name: "Mumbai",
    address1: "123 Business Park",
    address2: "Sector 5",
    pincode: "400001",
    state_name: "Maharashtra",
    area_name: "Andheri East",
    gst_no: "27ABCDE1234F1Z5",
    mobile_no: "9876543210",
    email: "john@techsolutions.com"
  },
  {
    id: "2",
    company_name: "Design Studio Inc",
    name: "Jane Smith",
    city_name: "Delhi",
    address1: "456 Creative Hub",
    address2: "Block A",
    pincode: "110001",
    state_name: "Delhi",
    area_name: "Connaught Place",
    gst_no: "07FGHIJ5678K2L9",
    mobile_no: "9876543211",
    email: "jane@designstudio.com"
  },
  {
    id: "3",
    company_name: "Marketing Pro",
    name: "Bob Johnson",
    city_name: "Bangalore",
    address1: "789 Innovation Center",
    address2: "Wing B",
    pincode: "560001",
    state_name: "Karnataka",
    area_name: "MG Road",
    gst_no: "29MNOPQ9012R3S4",
    mobile_no: "9876543212",
    email: "bob@marketingpro.com"
  }
];

const AddressesTableExample: React.FC = () => {
  const [selectedAddresses, setSelectedAddresses] = useState<Address[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Define table columns (without the old Actions column)
  const tableColumns: Column<Address>[] = [
    { header: "Company Name", accessor: "company_name" },
    { header: "Name", accessor: "name" },
    { header: "City", accessor: "city_name" },
    { header: "Address 1", accessor: "address1" },
    { header: "Address 2", accessor: "address2" }
  ];

  // Row action handlers
  const handleEditAddress = (address: Address) => {
    console.log("Edit address:", address);
    alert(`Edit address for: ${address.company_name}`);
    // Here you would typically open an edit modal or navigate to edit page
  };

  const handleDeleteAddress = (address: Address) => {
    console.log("Delete address:", address);
    if (window.confirm(`Are you sure you want to delete the address for ${address.company_name}?`)) {
      setDeletingId(address.id);
      
      // Simulate API call
      setTimeout(() => {
        alert(`Address for ${address.company_name} deleted successfully!`);
        setDeletingId(null);
        // Here you would typically remove the address from your state/refetch data
      }, 2000);
    }
  };

  const handleViewAddress = (address: Address) => {
    console.log("View address details:", address);
    // The view modal will automatically open with all address details
  };

  const handleAddressSelectionChange = (newSelectedAddresses: Address[]) => {
    setSelectedAddresses(newSelectedAddresses);
    console.log("Selected addresses:", newSelectedAddresses);
  };

  // Bulk actions for selected addresses
  const handleBulkDelete = () => {
    if (selectedAddresses.length === 0) {
      alert("Please select addresses to delete");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedAddresses.length} selected address(es)?`)) {
      console.log("Bulk delete addresses:", selectedAddresses);
      alert(`${selectedAddresses.length} addresses deleted successfully!`);
      setSelectedAddresses([]);
    }
  };

  const handleBulkExport = () => {
    if (selectedAddresses.length === 0) {
      alert("Please select addresses to export");
      return;
    }
    
    console.log("Bulk export addresses:", selectedAddresses);
    alert(`Exporting ${selectedAddresses.length} selected addresses...`);
  };

  return (
    <div className="container-fluid p-4">
      <h2>Enhanced Addresses Table Example</h2>
      
      {/* Bulk Actions */}
      {selectedAddresses.length > 0 && (
        <div className="alert alert-info mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{selectedAddresses.length} address(es) selected</strong>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={handleBulkExport}
              >
                Export Selected
              </button>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Table with row selection and actions */}
      <Table
        columns={tableColumns}
        data={sampleAddresses}
        sectionTitle="Saved Addresses"
        enableRowSelection={true}
        selectedRows={selectedAddresses}
        onRowSelectionChange={handleAddressSelectionChange}
        rowActions={{
          onEdit: handleEditAddress,
          onDelete: handleDeleteAddress,
          onView: handleViewAddress
        }}
        rowIdAccessor="id"
      />

      <div className="mt-4">
        <h4>Benefits of the Enhanced Table:</h4>
        <ul>
          <li><strong>Row Selection:</strong> Select individual rows or all rows with checkboxes</li>
          <li><strong>Bulk Actions:</strong> Perform actions on multiple selected rows</li>
          <li><strong>Standardized Actions:</strong> Consistent Edit, Delete, and View buttons</li>
          <li><strong>View Modal:</strong> Automatic modal to display all row details</li>
          <li><strong>Better UX:</strong> Cleaner interface with proper spacing and styling</li>
          <li><strong>Backward Compatible:</strong> Existing tables continue to work without changes</li>
        </ul>
      </div>
    </div>
  );
};

export default AddressesTableExample;
