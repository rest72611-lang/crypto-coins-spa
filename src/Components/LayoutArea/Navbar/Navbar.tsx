import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

// Props definition for Navbar component
// onSearchChange is a callback used to notify parent about search input changes
interface NavbarProps {
  onSearchChange: (value: string) => void;
}

// Navbar provides main navigation and optional search input
export function Navbar({ onSearchChange }: NavbarProps) {

  // useLocation is used to determine current route
  const location = useLocation();

  // Check if current page is Home
  // Search input will be displayed only on Home route
  const isHome =
    location.pathname === "/" ||
    location.pathname === "/home";

  return (
    // Main navigation container
    <nav className="Navbar">
      <div className="NavbarContainer">

        {/* Navigation links */}
        <div className="NavLinks">

          {/* Home route */}
          <NavLink to="/home" end className="NavLink">
            Home
          </NavLink>

          {/* Reports route */}
          <NavLink to="/reports" className="NavLink">
            Reports
          </NavLink>

          {/* Recommendations route */}
          <NavLink to="/recommendations" className="NavLink">
            Recommendations
          </NavLink>

          {/* About route */}
          <NavLink to="/about" className="NavLink">
            About
          </NavLink>

        </div>

        {/* 
          Search input is rendered only on Home page.
          Prevents unnecessary UI on other pages.
        */}
        {isHome && (
          <input
            type="search"
            className="SearchInput"
            placeholder="Search coin..."
            // Pass typed value upward to parent component
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}

      </div>
    </nav>
  );
}





