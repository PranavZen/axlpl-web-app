# 📊 Table Export Functionality

## Overview

The Table component now includes comprehensive export functionality that allows users to:
- **Select individual rows** or **select all records**
- **Copy** data to clipboard
- **Download** data in multiple formats (CSV, Excel, PDF)
- **Print** data with professional formatting

## 🎯 Features

### ✅ Row Selection
- **Individual Selection**: Click checkboxes to select specific rows
- **Select All**: Use header checkbox to select all visible rows
- **Visual Feedback**: Selected rows are highlighted
- **Selection Counter**: Shows count of selected vs total records

### ✅ Export Formats
- **📋 Copy**: Copies data to clipboard in tab-separated format
- **📄 CSV**: Downloads comma-separated values file
- **📊 Excel**: Downloads Excel file with formatting
- **📑 PDF**: Downloads PDF with professional table layout
- **🖨️ Print**: Opens print dialog with formatted table

### ✅ Smart Export Logic
- **Selected Data**: If rows are selected, exports only selected data
- **All Data**: If no rows selected, exports all filtered data
- **Dynamic Filenames**: Auto-generates filenames with timestamps
- **Progress Feedback**: Toast notifications for success/error states

## 🚀 Usage

### Basic Implementation
```tsx
import Table from '../components/ui/table/Table';

const MyComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <Table
      columns={columns}
      data={data}
      sectionTitle="My Data"
      enableRowSelection={true}
      selectedRows={selectedRows}
      onRowSelectionChange={setSelectedRows}
      rowIdAccessor="id"
    />
  );
};
```

### Export Button Features
```tsx
// The InnerButtons component automatically shows:
// - Copy (3)     - when 3 rows selected
// - CSV          - when no rows selected (exports all)
// - Excel (5)    - when 5 rows selected
// - PDF          - when no rows selected
// - Print (2)    - when 2 rows selected
```

## 🎨 Visual Indicators

### Button States
- **Enabled**: When data is available
- **Disabled**: When no data or loading
- **Count Display**: Shows selected count in parentheses
- **Tooltips**: Hover to see what will be exported

### Selection Feedback
```
📋 3 shipment(s) selected
Use the export buttons below to download or print the selected records.

▼ View selected shipments (3)
  • SHIP001 - Company A → Company B (Active)
  • SHIP002 - Company C → Company D (Pending)
  • SHIP003 - Company E → Company F (Delivered)
```

## 📁 File Formats

### CSV Export
```csv
"Date","Shipment ID","Sender","Receiver","Status"
"2024-01-15","SHIP001","Company A","Company B","Active"
"2024-01-16","SHIP002","Company C","Company D","Pending"
```

### Excel Export
- **Formatted Headers**: Bold with background color
- **Auto-sized Columns**: Optimal width for content
- **Styled Rows**: Alternating row colors
- **Professional Layout**: Ready for business use

### PDF Export
- **Company Header**: Title and date
- **Formatted Table**: Professional table layout
- **Page Breaks**: Automatic page handling
- **Print-ready**: Optimized for printing

### Print Format
- **Clean Layout**: Removes unnecessary elements
- **Responsive**: Adapts to paper size
- **Professional**: Business-ready formatting

## 🔧 Technical Implementation

### Export Utils
```typescript
// Core export functions
import {
  copyToClipboard,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  printData,
  getExportStats
} from '../../../utils/exportUtils';
```

### Dependencies
```json
{
  "xlsx": "^0.18.5",           // Excel export
  "jspdf": "^3.0.1",           // PDF generation
  "jspdf-autotable": "^5.0.2"  // PDF table formatting
}
```

### Error Handling
- **Try-catch blocks**: Graceful error handling
- **Toast notifications**: User-friendly feedback
- **Console logging**: Debug information
- **Fallback options**: Alternative export methods

## 📊 Export Statistics

The system tracks and displays:
- **Total Records**: All available data
- **Filtered Records**: After search/filter
- **Selected Records**: User-selected rows
- **Export Status**: Success/failure feedback

### Example Feedback
```
✅ Copied 5 of 150 records to clipboard
✅ Downloaded Excel file with 3 selected records
✅ Downloaded PDF file with all 150 records
✅ Print dialog opened for 2 selected records
❌ Failed to export CSV file
```

## 🎯 Best Practices

### Performance
- **Lazy Loading**: Only process visible data
- **Chunked Processing**: Handle large datasets
- **Memory Management**: Clean up resources
- **Progress Indicators**: Show export progress

### User Experience
- **Clear Feedback**: Always show what's happening
- **Consistent Naming**: Predictable file names
- **Accessible**: Keyboard navigation support
- **Responsive**: Works on all devices

### Data Integrity
- **Validation**: Check data before export
- **Encoding**: Proper character encoding
- **Formatting**: Consistent data formatting
- **Error Recovery**: Handle export failures

## 🔍 Troubleshooting

### Common Issues
1. **No data exports**: Check if data array is populated
2. **Missing columns**: Verify column configuration
3. **Export fails**: Check browser permissions
4. **Large files**: Consider pagination or chunking

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **File Downloads**: Requires user interaction
- **Clipboard API**: HTTPS required for clipboard access
- **Print API**: Standard browser print dialog

## 🚀 Future Enhancements

### Planned Features
- **Custom Templates**: User-defined export templates
- **Scheduled Exports**: Automated export scheduling
- **Cloud Storage**: Direct upload to cloud services
- **Email Integration**: Send exports via email
- **Advanced Filtering**: Export with custom filters
- **Batch Processing**: Handle multiple export jobs

### API Integration
- **Server-side Export**: Large dataset handling
- **Real-time Updates**: Live data synchronization
- **Audit Logging**: Track export activities
- **Permission Control**: Role-based export access
