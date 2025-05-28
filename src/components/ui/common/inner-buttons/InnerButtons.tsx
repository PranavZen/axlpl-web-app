import React from "react";
import "../inner-buttons/InnerButtons.scss";
type ButtonActions = {
  onCopy?: () => void;
  onCSV?: () => void;
  onExcel?: () => void;
  onPDF?: () => void;
  onPrint?: () => void;
};

const InnerButtons: React.FC<ButtonActions> = ({
  onCopy,
  onCSV,
  onExcel,
  onPDF,
  onPrint,
}) => {
  return (
    <div className="d-flex gap-2 innerBtnsWrap mb-4">
      <button className="btn btn-outline-primary btn-sm" onClick={onCopy}>
        Copy
      </button>
      <button className="btn btn-outline-secondary btn-sm" onClick={onCSV}>
        CSV
      </button>
      <button className="btn btn-outline-success btn-sm" onClick={onExcel}>
        Excel
      </button>
      <button className="btn btn-outline-danger btn-sm" onClick={onPDF}>
        PDF
      </button>
      <button className="btn btn-outline-dark btn-sm" onClick={onPrint}>
        Print
      </button>
    </div>
  );
};

export default InnerButtons;
