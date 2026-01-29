import { ProfileImage } from "../../../SharedArea/ProfileImage/ProfileImage";
import "./About.css";

// About page presents general information about the project,
// technologies used, and developer details.
export function About() {
  return (
    // Main container for About page
    <div className="AboutPage">

      {/* Card-style wrapper for content */}
      <div className="AboutCard">

        {/* Developer profile image */}
        <ProfileImage />

        {/* Project title */}
        <h1>About This Project</h1>

        {/* Project description */}
        <p>
          This project is a Single Page Application (SPA) built with React and TypeScript.
          The system presents real-time cryptocurrency data, allows users to select coins,
          view detailed information, generate reports, and receive AI-based recommendations.
        </p>

        {/* Technologies section */}
        <h2>Technologies</h2>
        <ul>
          <li>React + TypeScript</li>
          <li>REST APIs (CoinGecko, CryptoCompare)</li>
          <li>LocalStorage</li>
          <li>OpenAI API</li>
          <li>Vite</li>
        </ul>

        {/* Developer information */}
        <h2>Developer</h2>
        <p>
          Name: arie steinberg
          <br />
          Full Stack Student &amp; Web Developer
          <br />
          Email: rest72611@gmail.com
        </p>

      </div>
    </div>
  );
}


