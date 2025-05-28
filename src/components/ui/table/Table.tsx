import React, { useState, useEffect } from "react";
import "../table/Table.scss";
import SearchBox from "../search/Search";
import Pagination from "../pagination/Pagination";
import InnerButtons from "../common/inner-buttons/InnerButtons";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (value: any) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sectionTitle?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  sectionTitle,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
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
  const handleCopy = () => {
    alert("Copy clicked!");
    // You can add logic here to copy table/text content
  };

  const handleCSV = () => {
    alert("CSV clicked!");
    // Convert data to CSV and trigger download
  };

  const handleExcel = () => {
    alert("Excel clicked!");
    // Export to Excel using xlsx library
  };

  const handlePDF = () => {
    alert("PDF clicked!");
    // Use jsPDF to generate PDF
  };

  const handlePrint = () => {
    alert("Print clicked!");
    window.print(); // or custom print logic
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
      />
      <div className="table">
        <div className="table-responsive">
          <table className="table align-middle table-striped">
            <thead className="thead-dark">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx}>{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, rowIdx) => (
                  <tr key={rowIdx}>
                    {columns.map((col, colIdx) => {
                      const value = item[col.accessor];
                      const isLast = colIdx === columns.length - 1;
                      let cellClass = "";

                      if (isLast && !col.cell) {
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
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
    </>
  );
}

export default Table;
