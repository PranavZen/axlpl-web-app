import React from "react";
import "../inner-buttons/InnerButtons.scss";

type ButtonActions = {
  onCopy?: () => void;
  onCSV?: () => void;
  onExcel?: () => void;
  onPDF?: () => void;
  onPrint?: () => void;
  selectedCount?: number;
  totalCount?: number;
  disabled?: boolean;
};

const InnerButtons: React.FC<ButtonActions> = ({
  onCopy,
  onCSV,
  onExcel,
  onPDF,
  onPrint,
  selectedCount = 0,
  totalCount = 0,
  disabled = false,
}) => {
  const getTooltipText = (action: string) => {
    if (selectedCount > 0) {
      return `${action} ${selectedCount} selected record${selectedCount > 1 ? 's' : ''}`;
    }
    return `${action} all ${totalCount} record${totalCount > 1 ? 's' : ''}`;
  };

  const isDisabled = disabled || totalCount === 0;

  return (
    <div className="d-flex gap-2 innerBtnsWrap mb-4">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={onCopy}
        disabled={isDisabled}
        title={getTooltipText('Copy')}
      >
        <span className="me-1 mIcon">📋</span>
        Copy {selectedCount > 0 ? `(${selectedCount})` : ''}
      </button>
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={onCSV}
        disabled={isDisabled}
        title={getTooltipText('Export to CSV')}
      >
        <span className="me-1 mIcon">📄</span>
        CSV {selectedCount > 0 ? `(${selectedCount})` : ''}
      </button>
      <button
        className="btn btn-outline-success btn-sm"
        onClick={onExcel}
        disabled={isDisabled}
        title={getTooltipText('Export to Excel')}
      >
        <span className="me-1 mIcon">📊</span>
        Excel {selectedCount > 0 ? `(${selectedCount})` : ''}
      </button>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={onPDF}
        disabled={isDisabled}
        title={getTooltipText('Export to PDF')}
      >
        <span className="me-1 mIcon">📑</span>
        PDF {selectedCount > 0 ? `(${selectedCount})` : ''}
      </button>
      <button
        className="btn btn-outline-dark btn-sm"
        onClick={onPrint}
        disabled={isDisabled}
        title={getTooltipText('Print')}
      >
        <span className="me-1 mIcon">🖨️</span>
        Print {selectedCount > 0 ? `(${selectedCount})` : ''}
      </button>
    </div>
  );
};

export default InnerButtons;
