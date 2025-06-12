import React, { useState, useEffect } from "react";
import "../table/Table.scss";
import SearchBox from "../search/Search";
import Pagination from "../pagination/Pagination";
import InnerButtons from "../common/inner-buttons/InnerButtons";
import Checkbox from "../checkbox/Checkbox";
import Modal from "../modals/Modal";
import Button from "../button/Button";
import {
  copyToClipboard,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  printData,
  getExportStats,
  ExportColumn
} from "../../../utils/exportUtils";
import { showSuccess, showError } from "../../../utils/toastUtils";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (value: any) => React.ReactNode;
}

interface RowActions<T> {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sectionTitle?: string;
  enableRowSelection?: boolean;
  selectedRows?: T[];
  onRowSelectionChange?: (selectedRows: T[]) => void;
  rowActions?: RowActions<T>;
  rowIdAccessor?: keyof T; // Used to identify unique rows
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  sectionTitle,
  enableRowSelection = false,
  selectedRows = [],
  onRowSelectionChange,
  rowActions,
  rowIdAccessor = 'id' as keyof T,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [internalSelectedRows, setInternalSelectedRows] = useState<T[]>(selectedRows);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewModalData, setViewModalData] = useState<T | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const results = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );

    setFilteredData(results);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // Export functionality
  const getDataToExport = () => {
    return currentSelectedRows.length > 0 ? currentSelectedRows : filteredData;
  };

  const getExportColumns = (): ExportColumn<T>[] => {
    return columns.map(col => ({
      header: col.header,
      accessor: col.accessor as string,
      width: 15
    }));
  };

  const getExportFilename = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const prefix = sectionTitle ? sectionTitle.toLowerCase().replace(/\s+/g, '_') : 'export';
    return `${prefix}_${timestamp}`;
  };

  const handleCopy = async () => {
    try {
      const dataToExport = getDataToExport();
      const exportColumns = getExportColumns();
      const stats = getExportStats(filteredData, currentSelectedRows);

      await copyToClipboard({
        data: dataToExport,
        columns: exportColumns,
        title: sectionTitle
      });

      showSuccess(`✅ Copied ${stats} to clipboard`);
    } catch (error) {
      showError('❌ Failed to copy data to clipboard');
    }
  };

  const handleCSV = () => {
    try {
      const dataToExport = getDataToExport();
      const exportColumns = getExportColumns();
      const filename = getExportFilename();
      const stats = getExportStats(filteredData, currentSelectedRows);

      exportToCSV({
        data: dataToExport,
        columns: exportColumns,
        filename,
        title: sectionTitle
      });

      showSuccess(`✅ Downloaded CSV file with ${stats}`);
    } catch (error) {
      showError('❌ Failed to export CSV file');
    }
  };

  const handleExcel = () => {
    try {
      const dataToExport = getDataToExport();
      const exportColumns = getExportColumns();
      const filename = getExportFilename();
      const stats = getExportStats(filteredData, currentSelectedRows);

      exportToExcel({
        data: dataToExport,
        columns: exportColumns,
        filename,
        title: sectionTitle
      });

      showSuccess(`✅ Downloaded Excel file with ${stats}`);
    } catch (error) {
      showError('❌ Failed to export Excel file');
    }
  };

  const handlePDF = () => {
    try {
      const dataToExport = getDataToExport();
      const exportColumns = getExportColumns();
      const filename = getExportFilename();
      const stats = getExportStats(filteredData, currentSelectedRows);

      exportToPDF({
        data: dataToExport,
        columns: exportColumns,
        filename,
        title: sectionTitle
      });

      showSuccess(`✅ Downloaded PDF file with ${stats}`);
    } catch (error) {
      showError('❌ Failed to export PDF file');
    }
  };

  const handlePrint = () => {
    try {
      const dataToExport = getDataToExport();
      const exportColumns = getExportColumns();
      const stats = getExportStats(filteredData, currentSelectedRows);

      printData({
        data: dataToExport,
        columns: exportColumns,
        title: sectionTitle
      });

      showSuccess(`✅ Print dialog opened for ${stats}`);
    } catch (error) {
      showError('❌ Failed to print data');
    }
  };

  // Row selection handlers
  const currentSelectedRows = onRowSelectionChange ? selectedRows : internalSelectedRows;

  const handleRowSelect = (row: T, checked: boolean) => {
    let newSelectedRows: T[];
    if (checked) {
      newSelectedRows = [...currentSelectedRows, row];
    } else {
      newSelectedRows = currentSelectedRows.filter(
        (selectedRow) => selectedRow[rowIdAccessor] !== row[rowIdAccessor]
      );
    }

    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedRows);
    } else {
      setInternalSelectedRows(newSelectedRows);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows = checked ? [...paginatedData] : [];
    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedRows);
    } else {
      setInternalSelectedRows(newSelectedRows);
    }
  };

  const isRowSelected = (row: T) => {
    return currentSelectedRows.some(
      (selectedRow) => selectedRow[rowIdAccessor] === row[rowIdAccessor]
    );
  };

  const isAllSelected = paginatedData.length > 0 &&
    paginatedData.every((row) => isRowSelected(row));

  // Action handlers
  const handleView = (row: T) => {
    setViewModalData(row);
    setViewModalOpen(true);
  };

  const handleEdit = (row: T) => {
    if (rowActions?.onEdit) {
      rowActions.onEdit(row);
    }
  };

  const handleDelete = (row: T) => {
    if (rowActions?.onDelete) {
      rowActions.onDelete(row);
    }
  };
  return (
    <>
      <div className="topSecWrap">
        <h1>{sectionTitle}</h1>
        <SearchBox
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>
      <InnerButtons
        onCopy={handleCopy}
        onCSV={handleCSV}
        onExcel={handleExcel}
        onPDF={handlePDF}
        onPrint={handlePrint}
        selectedCount={currentSelectedRows.length}
        totalCount={filteredData.length}
      />
      <div className="table">
        <div className="table-responsive">
          <table className="table align-middle table-striped">
            <thead className="thead-dark">
              <tr>
                {enableRowSelection && (
                  <th>
                    <Checkbox
                      id="select-all"
                      label=""
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      variant="inline"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th key={idx}>{col.header}</th>
                ))}
                {rowActions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, rowIdx) => (
                  <tr key={rowIdx}>
                    {enableRowSelection && (
                      <td>
                        <Checkbox
                          id={`row-${rowIdx}`}
                          label=""
                          checked={isRowSelected(item)}
                          onChange={(e) => handleRowSelect(item, e.target.checked)}
                          variant="inline"
                        />
                      </td>
                    )}
                    {columns.map((col, colIdx) => {
                      const value = item[col.accessor];
                      const isLast = colIdx === columns.length - 1;
                      let cellClass = "";

                      if (isLast && !col.cell && !rowActions) {
                        const strValue = String(value);
                        if (strValue.toLowerCase() === "approved") {
                          cellClass = "status-approved";
                        } else if (strValue.toLowerCase() === "pending") {
                          cellClass = "status-pending";
                        } else if (strValue.toLowerCase() === "rejected") {
                          cellClass = "status-rejected";
                        }
                      }

                      return (
                        <td key={colIdx} className={cellClass}>
                          {col.cell ? col.cell(value) : String(value)}
                        </td>
                      );
                    })}
                    {rowActions && (
                      <td>
                        <div className="d-flex gap-2 innerBtnsWrap">
                          {rowActions.onView && (
                            <Button
                              text="View"
                              type="button"
                              className="btn btn-sm btn-info"
                              onClick={() => handleView(item)}
                            />
                          )}
                          {rowActions.onEdit && (
                            <Button
                              text="Edit"
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => handleEdit(item)}
                            />
                          )}
                          {rowActions.onDelete && (
                            <Button
                              text="Delete"
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item)}
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (enableRowSelection ? 1 : 0) +
                      (rowActions ? 1 : 0)
                    }
                    className="text-center"
                  >
                    Data Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalData && (
        <Modal
          isOpen={viewModalOpen}
          title="Details"
          onClose={() => setViewModalOpen(false)}
          size="lg"
        >
          <div className="row-details">
            {Object.entries(viewModalData).map(([key, value]) => (
              <div key={key} className="detail-row mb-3">
                <div className="row">
                  <div className="col-4">
                    <strong className="detail-label">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
                    </strong>
                  </div>
                  <div className="col-8">
                    <span className="detail-value">{String(value)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

export default Table;
