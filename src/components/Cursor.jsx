import { useEffect, useRef, useCallback } from "react";
import "./styles/Cursor.css";

const Cursor = () => {
  const cursorRef = useRef(null);
  const animFrameRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const hoverLockRef = useRef(false);
  const listenersRef = useRef([]);
  const observerRef = useRef(null);
  const isVisibleRef = useRef(false);

  // Bind cursor-aware event listeners to all [data-cursor] elements
  const bindCursorTargets = useCallback(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Clean up previous listeners
    listenersRef.current.forEach(({ el, type, fn }) => {
      el.removeEventListener(type, fn);
    });
    listenersRef.current = [];

    document.querySelectorAll("[data-cursor]").forEach((element) => {
      const onEnter = () => {
        if (element.dataset.cursor === "icons") {
          const rect = element.getBoundingClientRect();
          cursor.classList.add("cursor-icons");
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          // Snap cursor to the element position for the icons state
          cursorPos.current.x = rect.left + 10;
          cursorPos.current.y = rect.top + 10;
          hoverLockRef.current = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const onLeave = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hoverLockRef.current = false;
      };

      element.addEventListener("mouseenter", onEnter);
      element.addEventListener("mouseleave", onLeave);

      listenersRef.current.push(
        { el: element, type: "mouseenter", fn: onEnter },
        { el: element, type: "mouseleave", fn: onLeave }
      );
    });
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // --- Mouse tracking ---
    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Show cursor on first move
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        cursor.style.opacity = "1";
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      cursor.style.opacity = "0";
    };

    const onMouseEnter = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      cursorPos.current.x = e.clientX;
      cursorPos.current.y = e.clientY;
      isVisibleRef.current = true;
      cursor.style.opacity = "1";
    };

    // --- Animation loop (no React state, pure DOM) ---
    const LERP_SPEED = 0.18; // Snappier than the old 1/4 = 0.25 divisor approach

    const render = () => {
      if (!hoverLockRef.current) {
        const dx = mousePos.current.x - cursorPos.current.x;
        const dy = mousePos.current.y - cursorPos.current.y;

        cursorPos.current.x += dx * LERP_SPEED;
        cursorPos.current.y += dy * LERP_SPEED;
      }

      cursor.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
      animFrameRef.current = requestAnimationFrame(render);
    };

    // --- MutationObserver: re-bind when DOM changes (lazy sections, route transitions) ---
    observerRef.current = new MutationObserver(() => {
      bindCursorTargets();
    });
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial binding
    bindCursorTargets();

    // Start listeners and loop
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);
    animFrameRef.current = requestAnimationFrame(render);

    // --- Cleanup ---
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      listenersRef.current.forEach(({ el, type, fn }) => {
        el.removeEventListener(type, fn);
      });
      listenersRef.current = [];
    };
  }, [bindCursorTargets]);

  return <div className="cursor-main" ref={cursorRef} />;
};

export default Cursor;
