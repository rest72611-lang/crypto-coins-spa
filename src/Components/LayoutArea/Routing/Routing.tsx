import { Routes, Route } from "react-router-dom";
import { Layout } from "../Layout/Layout";

// Pages
import { CoinsPage } from "../../PageArea/Home/CoinsPage/CoinsPage";
import Reports from "../../PageArea/Reports/Reports/Reports";
import { Recommendations } from "../../PageArea/Recommendations/Recommendations/Recommendations";
import { About } from "../../PageArea/About/About/About";
import { PageNotFound } from "../../PageArea/PageNotFound/PageNotFound";

// Routing component defines all application routes
export function Routing() {
  return (
    // Routes container
    <Routes>

      {/* Root route using Layout as a wrapper */}
      <Route path="/" element={<Layout />}>

        {/* Default route (/) */}
        <Route index element={<CoinsPage />} />

        {/* Support /home as alias to home page */}
        <Route path="home" element={<CoinsPage />} />

        {/* Reports page */}
        <Route path="reports" element={<Reports />} />

        {/* Recommendations page */}
        <Route path="recommendations" element={<Recommendations />} />

        {/* About page */}
        <Route path="about" element={<About />} />

        {/* Fallback route for unknown paths */}
        <Route path="*" element={<PageNotFound />} />

      </Route>

    </Routes>
  );
}




