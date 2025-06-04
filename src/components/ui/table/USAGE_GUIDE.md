# Enhanced Table Usage Guide

## Problem Solved
The checkbox and action columns were not showing because the required props were not being passed to the Table component. The enhanced features are **optional** and only appear when you explicitly enable them.

## Quick Fix for Your Current Issue

### Option 1: Actions Only (No Checkboxes)
For tables that only need Edit, Delete, and View buttons:
```tsx
<Table
  columns={tableColumns}
  data={addresses}
  sectionTitle=""
  rowActions={{  // ← Add this for actions column
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView
  }}
  rowIdAccessor="id"
/>
```

### Option 2: With Row Selection (Checkboxes + Actions)
For tables that need both checkboxes and actions:

```tsx
<Table
  columns={tableColumns}
  data={addresses}
  sectionTitle=""
  enableRowSelection={true}  // ← Add this for checkbox column
  selectedRows={selectedRows}
  onRowSelectionChange={handleRowSelectionChange}
  rowActions={{  // ← Add this for actions column
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView
  }}
  rowIdAccessor="id"
/>
```

### Required Handlers

```tsx
// Add state for selected rows
const [selectedRows, setSelectedRows] = useState([]);

// Add handlers
const handleRowSelectionChange = (newSelectedRows) => {
  setSelectedRows(newSelectedRows);
  console.log("Selected:", newSelectedRows);
};

const handleEdit = (row) => {
  console.log("Edit:", row);
  // Your edit logic here
};

const handleDelete = (row) => {
  console.log("Delete:", row);
  // Your delete logic here
};

const handleView = (row) => {
  console.log("View:", row);
  // View modal opens automatically
};
```

## Complete Working Example

```tsx
import React, { useState } from 'react';
import Table, { Column } from '../components/ui/table/Table';

const MyPage = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  
  const columns: Column<any>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Status", accessor: "status" }
  ];

  const data = [
    { id: "1", name: "John", email: "john@example.com", status: "active" },
    { id: "2", name: "Jane", email: "jane@example.com", status: "pending" }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      sectionTitle="My Enhanced Table"
      enableRowSelection={true}
      selectedRows={selectedRows}
      onRowSelectionChange={setSelectedRows}
      rowActions={{
        onEdit: (row) => alert(`Edit ${row.name}`),
        onDelete: (row) => alert(`Delete ${row.name}`),
        onView: (row) => console.log("View details:", row)
      }}
      rowIdAccessor="id"
    />
  );
};
```

## What You'll See

### With enableRowSelection={true}:
- ✅ Checkbox column appears as the **first column**
- ✅ Header checkbox for "Select All"
- ✅ Individual row checkboxes

### With rowActions prop:
- ✅ Actions column appears as the **last column**
- ✅ View, Edit, Delete buttons (based on what you provide)
- ✅ Automatic view modal for row details

### Without these props:
- ❌ No checkbox column
- ❌ No actions column
- ✅ Table works exactly as before (backward compatible)

## Key Points

1. **Both features are optional** - you can use one, both, or neither
2. **Backward compatible** - existing tables continue to work unchanged
3. **Flexible** - you can provide any combination of edit/delete/view actions
4. **Automatic view modal** - shows all row data in a formatted popup
5. **Row selection state** - can be controlled externally or managed internally

## Troubleshooting

**Q: Columns not showing?**
A: Make sure you're passing `enableRowSelection={true}` and/or `rowActions` props

**Q: Checkboxes not working?**
A: Ensure you have `onRowSelectionChange` handler and `rowIdAccessor` set

**Q: Actions not working?**
A: Check that your action handlers are properly defined in the `rowActions` object

**Q: View modal not opening?**
A: The view modal opens automatically when you provide `onView` in `rowActions`
