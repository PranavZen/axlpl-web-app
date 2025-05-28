import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className={isActive ? 'active' : ''}>
      <Link
        to={to}
        className="sidebar-item d-flex align-items-center text-decoration-none"
        aria-current={isActive ? 'page' : undefined}
      >
        <div className="iconBox">{icon}</div>
        <span className="menu-text hideMenu">{isOpen && label}</span>
      </Link>
    </li>
  );
};

export default SidebarLink;
