import "./styles/About.css";
import { config } from "../config";
const About = () => {
  return <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          {config.about.description}
        </p>
      </div>
    </div>;
};
var About_default = About;
export {
  About_default as default
};
