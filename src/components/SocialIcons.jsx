import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { config } from "../config";
const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social");
    if (!social) return;

    const cleanupFns = [];

    // --- Proximity detection: brighten as cursor approaches ---
    let targetProximity = 0;
    let currentProximity = 0;
    let proximityAnimId;

    const handleGlobalMouseMove = (e) => {
      const rect = social.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxRadius = 380; // Distance in px where brightening begins
      if (distance < maxRadius) {
        targetProximity = Math.pow(1 - distance / maxRadius, 1.2);
      } else {
        targetProximity = 0;
      }
    };

    const updateProximity = () => {
      currentProximity += (targetProximity - currentProximity) * 0.12;
      social.style.setProperty("--proximity", currentProximity.toFixed(3));
      proximityAnimId = requestAnimationFrame(updateProximity);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    proximityAnimId = requestAnimationFrame(updateProximity);

    cleanupFns.push(() => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      cancelAnimationFrame(proximityAnimId);
    });

    // --- Magnetic icon tracking ---
    social.querySelectorAll("span").forEach((item) => {
      const elem = item;
      const link = elem.querySelector("a");
      if (!link) return;

      let mouseX = 25;
      let mouseY = 25;
      let currentX = 25;
      let currentY = 25;
      let animId;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);
        animId = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      const onMouseLeave = () => {
        const rect = elem.getBoundingClientRect();
        mouseX = rect.width / 2;
        mouseY = rect.height / 2;
      };

      elem.addEventListener("mousemove", onMouseMove);
      elem.addEventListener("mouseleave", onMouseLeave);
      animId = requestAnimationFrame(updatePosition);

      cleanupFns.push(() => {
        elem.removeEventListener("mousemove", onMouseMove);
        elem.removeEventListener("mouseleave", onMouseLeave);
        cancelAnimationFrame(animId);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);
  return <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href={config.contact.github} target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href={config.contact.linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href={config.contact.twitter} target="_blank" rel="noopener noreferrer">
            <FaXTwitter />
          </a>
        </span>
        <span>
          <a href={config.contact.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a className="resume-button" href="#">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>;
};
var SocialIcons_default = SocialIcons;
export {
  SocialIcons_default as default
};
