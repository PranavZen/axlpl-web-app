// Export utilities for table data
// Note: Advanced export features require additional libraries
// Run: npm install xlsx jspdf jspdf-autotable

export interface ExportColumn<T> {
  header: string;
  accessor: keyof T | string;
  width?: number;
}

export interface ExportOptions<T> {
  data: T[];
  columns: ExportColumn<T>[];
  filename?: string;
  title?: string;
}

// Helper function to get nested property value
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Helper function to format data for export
const formatDataForExport = <T>(data: T[], columns: ExportColumn<T>[]): any[][] => {
  const headers = columns.map(col => col.header);
  const rows = data.map(row => 
    columns.map(col => {
      const value = typeof col.accessor === 'string' 
        ? getNestedValue(row, col.accessor)
        : (row as any)[col.accessor];
      return value ?? '';
    })
  );
  return [headers, ...rows];
};

// Copy to clipboard
export const copyToClipboard = async <T>(options: ExportOptions<T>): Promise<void> => {
  try {
    const formattedData = formatDataForExport(options.data, options.columns);
    const textData = formattedData.map(row => row.join('\t')).join('\n');
    
    await navigator.clipboard.writeText(textData);
  } catch (error) {
    throw new Error('Failed to copy data to clipboard');
  }
};

// Export to CSV
export const exportToCSV = <T>(options: ExportOptions<T>): void => {
  try {
    const formattedData = formatDataForExport(options.data, options.columns);
    const csvContent = formattedData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${options.filename || 'export'}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    throw new Error('Failed to export CSV file');
  }
};

// Export to Excel (Basic implementation - falls back to CSV)
export const exportToExcel = <T>(options: ExportOptions<T>): void => {
  try {
    // For now, we'll export as CSV with .xls extension
    // This will open in Excel and can be saved as proper Excel format
    const formattedData = formatDataForExport(options.data, options.columns);
    const csvContent = formattedData.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    // Create Excel-compatible CSV
    const excelContent = '\uFEFF' + csvContent; // Add BOM for Excel compatibility
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${options.filename || 'export'}.xls`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    throw new Error('Failed to export Excel file');
  }
};

// Export to PDF (Basic implementation - opens print dialog)
export const exportToPDF = <T>(options: ExportOptions<T>): void => {
  try {
    // For now, we'll create a printable HTML version
    // Users can then "Print to PDF" from their browser
    const formattedData = formatDataForExport(options.data, options.columns);

    // Create HTML content for PDF
    let htmlContent = `
      <html>
        <head>
          <title>${options.title || 'Export Data'}</title>
          <style>
            @media print {
              body { margin: 0; font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
              th { background-color: #f2f2f2; font-weight: bold; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              h1 { margin-bottom: 20px; color: #333; }
            }
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            h1 { color: #333; margin-bottom: 20px; }
          </style>
        </head>
        <body>
    `;

    if (options.title) {
      htmlContent += `<h1>${options.title}</h1>`;
    }

    htmlContent += '<table>';

    // Add table content
    formattedData.forEach((row, index) => {
      const tag = index === 0 ? 'th' : 'td';
      htmlContent += `<tr>${row.map(cell => `<${tag}>${cell}</${tag}>`).join('')}</tr>`;
    });

    htmlContent += `
          </table>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    // Open in new window for PDF printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
    }

  } catch (error) {
    throw new Error('Failed to export PDF file');
  }
};

// Print data
export const printData = <T>(options: ExportOptions<T>): void => {
  try {
    const formattedData = formatDataForExport(options.data, options.columns);
    
    // Create HTML table
    let htmlContent = `
      <html>
        <head>
          <title>${options.title || 'Print Data'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print {
              body { margin: 0; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
    `;
    
    if (options.title) {
      htmlContent += `<h1>${options.title}</h1>`;
    }
    
    htmlContent += '<table>';
    
    // Add table content
    formattedData.forEach((row, index) => {
      const tag = index === 0 ? 'th' : 'td';
      htmlContent += `<tr>${row.map(cell => `<${tag}>${cell}</${tag}>`).join('')}</tr>`;
    });
    
    htmlContent += `
          </table>
        </body>
      </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }

  } catch (error) {
    throw new Error('Failed to print data');
  }
};

// Get export statistics
export const getExportStats = <T>(data: T[], selectedData: T[]): string => {
  const total = data.length;
  const selected = selectedData.length;
  
  if (selected === 0) {
    return `All ${total} records`;
  } else if (selected === total) {
    return `All ${total} records (all selected)`;
  } else {
    return `${selected} of ${total} records`;
  }
};
