import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Header } from "../Header/Header";

// Layout component acts as a global shell for shared UI elements
// such as navigation, header, and routed pages.
export function Layout() {

  // Local state for search term.
  // Kept here because multiple child pages may rely on it.
  const [search, setSearch] = useState<string>("");

  return (
    // Root container for the entire layout
    <div>

      {/* Navbar receives setter to update search value */}
      <Navbar onSearchChange={setSearch} />

      {/* Header is displayed on all pages */}
      <Header />

      {/* 
        Outlet renders the active route's component.
        The search value is passed via Outlet context
        to avoid prop drilling.
      */}
      <Outlet context={{ search }} />

    </div>
  );
}

