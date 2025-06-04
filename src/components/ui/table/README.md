# Enhanced Table Component

The Table component has been enhanced with new features including row selection with checkboxes and standardized action buttons. The component maintains full backward compatibility with existing implementations.

## New Features

### 1. Row Selection with Checkboxes
- **Checkbox Column**: Added before the first data column
- **Select All**: Header checkbox to select/deselect all rows on current page
- **Individual Selection**: Each row has its own checkbox
- **Selection State Management**: Tracks selected rows internally or via props

### 2. Standardized Action Buttons
- **Actions Column**: Added after the last data column
- **View Button**: Opens a modal with all row details
- **Edit Button**: Triggers custom edit handler
- **Delete Button**: Triggers custom delete handler
- **Consistent Styling**: Uses existing button styles for consistency

### 3. View Details Modal
- **Automatic Modal**: Displays all row data in a formatted view
- **Responsive Layout**: Uses Bootstrap grid for proper formatting
- **Field Formatting**: Converts field names to readable labels

## Props

### New Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableRowSelection` | `boolean` | `false` | Enables checkbox column for row selection |
| `selectedRows` | `T[]` | `[]` | Controlled selected rows (optional) |
| `onRowSelectionChange` | `(rows: T[]) => void` | - | Callback when selection changes |
| `rowActions` | `RowActions<T>` | - | Action handlers for edit, delete, view |
| `rowIdAccessor` | `keyof T` | `'id'` | Field used to identify unique rows |

### RowActions Interface

```typescript
interface RowActions<T> {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
}
```

## Usage Examples

### Basic Table (Backward Compatible)
```tsx
<Table
  columns={columns}
  data={data}
  sectionTitle="My Table"
/>
```

### Table with Row Selection
```tsx
const [selectedRows, setSelectedRows] = useState([]);

<Table
  columns={columns}
  data={data}
  sectionTitle="Selectable Table"
  enableRowSelection={true}
  selectedRows={selectedRows}
  onRowSelectionChange={setSelectedRows}
  rowIdAccessor="id"
/>
```

### Table with Actions
```tsx
<Table
  columns={columns}
  data={data}
  sectionTitle="Table with Actions"
  rowActions={{
    onEdit: (row) => handleEdit(row),
    onDelete: (row) => handleDelete(row),
    onView: (row) => handleView(row)
  }}
  rowIdAccessor="id"
/>
```

### Full Featured Table
```tsx
<Table
  columns={columns}
  data={data}
  sectionTitle="Enhanced Table"
  enableRowSelection={true}
  selectedRows={selectedRows}
  onRowSelectionChange={setSelectedRows}
  rowActions={{
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView
  }}
  rowIdAccessor="id"
/>
```

## Migration Guide

### From Old Actions Column
**Before:**
```tsx
const columns = [
  { header: "Name", accessor: "name" },
  {
    header: "Actions",
    accessor: "id",
    cell: (value) => (
      <div className="d-flex gap-2">
        <button onClick={() => handleEdit(value)}>Edit</button>
        <button onClick={() => handleDelete(value)}>Delete</button>
      </div>
    )
  }
];
```

**After:**
```tsx
const columns = [
  { header: "Name", accessor: "name" }
  // Remove the Actions column
];

// Add rowActions prop to Table
<Table
  columns={columns}
  data={data}
  rowActions={{
    onEdit: (row) => handleEdit(row.id),
    onDelete: (row) => handleDelete(row.id),
    onView: (row) => handleView(row)
  }}
/>
```

## Styling

The component includes enhanced CSS for:
- Checkbox column width and alignment
- Action buttons spacing and styling
- Modal content formatting
- Responsive design considerations

## Dependencies

- `Checkbox` component for row selection
- `Modal` component for view details
- `Button` component for actions
- Bootstrap classes for styling

## Examples

See the example files:
- `TableExample.tsx` - Basic usage examples
- `AddressesTableExample.tsx` - Real-world migration example
