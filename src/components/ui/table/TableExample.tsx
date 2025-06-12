import React, { useState } from "react";
import Table, { Column } from "./Table";

// Example data interface
interface ExampleData {
  id: string;
  name: string;
  email: string;
  date: string;
  status: string;
  company: string;
}

// Sample data
const sampleData: ExampleData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    date: "2024-01-15",
    status: "approved",
    company: "Tech Corp"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    date: "2024-01-16",
    status: "pending",
    company: "Design Studio"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    date: "2024-01-17",
    status: "rejected",
    company: "Marketing Inc"
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    date: "2024-01-18",
    status: "approved",
    company: "Data Solutions"
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    date: "2024-01-19",
    status: "pending",
    company: "Cloud Services"
  }
];

const TableExample: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<ExampleData[]>([]);

  // Define table columns
  const columns: Column<ExampleData>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Company", accessor: "company" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" }
  ];

  // Row action handlers
  const handleEdit = (row: ExampleData) => {
    alert(`Edit clicked for: ${row.name}`);
  };

  const handleDelete = (row: ExampleData) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      alert(`Delete clicked for: ${row.name}`);
    }
  };

  const handleView = (row: ExampleData) => {
    // The view modal will automatically open with row details
  };

  const handleRowSelectionChange = (newSelectedRows: ExampleData[]) => {
    setSelectedRows(newSelectedRows);
  };

  return (
    <div className="container-fluid p-4">
      <h2>Enhanced Table Example</h2>
      
      {/* Display selected rows info */}
      {selectedRows.length > 0 && (
        <div className="alert alert-info mb-3">
          <strong>Selected Rows:</strong> {selectedRows.length} row(s) selected
          <ul className="mb-0 mt-2">
            {selectedRows.map(row => (
              <li key={row.id}>{row.name} ({row.email})</li>
            ))}
          </ul>
        </div>
      )}

      {/* Enhanced Table with all features */}
      <Table
        columns={columns}
        data={sampleData}
        sectionTitle="Users Management"
        enableRowSelection={true}
        selectedRows={selectedRows}
        onRowSelectionChange={handleRowSelectionChange}
        rowActions={{
          onEdit: handleEdit,
          onDelete: handleDelete,
          onView: handleView
        }}
        rowIdAccessor="id"
      />

      <hr className="my-5" />

      {/* Basic Table without new features (backward compatibility) */}
      <Table
        columns={columns}
        data={sampleData}
        sectionTitle="Basic Table (No Selection/Actions)"
      />
    </div>
  );
};

export default TableExample;
