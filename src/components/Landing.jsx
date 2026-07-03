import "./styles/Landing.css";
import { config } from "../config";
const Landing = ({ children }) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";
  return <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {" "}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
          </div>
          <div className="landing-info">
            <h3>An</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">SOFTWARE ENGINEER</div>
            </h2>
            <h2>
              <div className="landing-h2-info">FULL-STACK DEV</div>
            </h2>
          </div>
          {
    /* Mobile photo - shows only on mobile when 3D character is hidden */
  }
          <div className="mobile-photo">
            <div className="mobile-photo-placeholder" aria-label="Yashas M">YM</div>
          </div>
        </div>
        {children}
      </div>
    </>;
};
var Landing_default = Landing;
export {
  Landing_default as default
};
