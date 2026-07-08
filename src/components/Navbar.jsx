import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";
import { config } from "../config";
gsap.registerPlugin(ScrollTrigger);
let lenis = null;
const Navbar = () => {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false
    });
    lenis.stop();
    function raf(time) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem2 = e.currentTarget;
          let section = elem2.getAttribute("data-href");
          if (section && lenis) {
            const target = document.querySelector(section);
            if (target) {
              lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5
              });
            }
          }
        }
      });
    });
    // Restore scroll position on mount if we're coming back
    const savedScroll = sessionStorage.getItem('homeScrollPos');
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
        if (lenis) {
          lenis.scrollTo(parseInt(savedScroll, 10), { immediate: true });
        }
      }, 50);
    }

    window.addEventListener("resize", () => {
      lenis?.resize();
    });
    return () => {
      sessionStorage.setItem('homeScrollPos', window.scrollY.toString());
      lenis?.destroy();
    };
  }, []);
  return <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          YM
        </a>
        <a
    href={`mailto:${config.contact.email}`}
    className="navbar-connect"
    data-cursor="disable"
  >
          {config.contact.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1" />
      <div className="landing-circle2" />
      <div className="nav-fade" />
    </>;
};
var Navbar_default = Navbar;
export {
  Navbar_default as default,
  lenis
};
