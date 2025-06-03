import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChevronDown as FaChevronDownIconRaw,
  FaChevronRight as FaChevronRightIconRaw,
} from "react-icons/fa";
const FaChevronDown = FaChevronDownIconRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const FaChevronRight = FaChevronRightIconRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;

interface DropdownItem {
  label: string;
  to: string;
}

interface SidebarDropdownProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  items: DropdownItem[];
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  title,
  icon,
  isOpen,
  isActive,
  onToggle,
  items,
}) => {
  const location = useLocation();
  const isMenuActive = items.some(item => location.pathname === item.to);
  return (
    <li className={`dropdown-menu-item ${isMenuActive ? 'active' : ''}`}>
      <div
        className={`sidebar-item d-flex align-items-center justify-content-between mainMenu ${isActive ? 'active' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
        aria-label={`${title} menu`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div className="iconBox" title={title}>
            {icon}
          </div>
          <span className="menu-text hideMenu">{isOpen && title}</span>
        </div>
        {isOpen && (
          <div className="chevron-icon">
            {isActive ? <FaChevronDown /> : <FaChevronRight />}
          </div>
        )}
      </div>

      {/* Submenu for collapsed sidebar (shown on hover) */}
      {!isOpen && (
        <ul className="list-unstyled subMenu hover-visible" role="menu" aria-label={`${title} submenu`}>
          {items.map(({ label, to }) => (
            <li key={label} className={location.pathname === to ? 'active' : ''} role="none">
              <Link
                to={to}
                className="text-decoration-none"
                role="menuitem"
                aria-current={location.pathname === to ? 'page' : undefined}
                title={label}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Submenu for expanded sidebar (shown when active) */}
      {isActive && isOpen && (
        <ul className="list-unstyled subMenu" role="menu" aria-label={`${title} submenu`}>
          {items.map(({ label, to }) => (
            <li key={label} className={location.pathname === to ? 'active' : ''} role="none">
              <Link
                to={to}
                className="text-decoration-none"
                role="menuitem"
                aria-current={location.pathname === to ? 'page' : undefined}
                title={label}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarDropdown;
