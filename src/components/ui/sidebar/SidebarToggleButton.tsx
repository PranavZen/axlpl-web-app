import React, { useContext } from "react";
import { SidebarContext } from "../../../contexts/SidebarContext";
import { FaBars as FaBarsRaw } from "react-icons/fa";
const FaBars = FaBarsRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const SidebarToggleButton: React.FC = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  return (
    <button className="btn" onClick={toggleSidebar}>
      <FaBars />
    </button>
  );
};

export default SidebarToggleButton;
