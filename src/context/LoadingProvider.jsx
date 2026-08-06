import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../components/Loading";

export const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(() => {
    // Skip loading on mobile
    if (window.innerWidth <= 768) return false;
    // Skip if already loaded in this session
    if (sessionStorage.getItem('siteLoaded')) return false;
    return true;
  });
  const [loading, setLoading] = useState(0);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  useEffect(() => {
    if (sessionStorage.getItem('siteLoaded')) {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
      document.body.style.backgroundColor = "#0b080c";
      const main = document.getElementsByTagName("main")[0];
      if (main) main.classList.add("main-active");

      setTimeout(() => {
        import("../utils/initialFX").then((module) => {
          if (module.initialFX) module.initialFX();
        });
      }, 50);
    } else if (window.innerWidth <= 768) {
      import("../utils/initialFX").then((module) => {
        if (module.initialFX) {
          setTimeout(() => {
            module.initialFX();
          }, 100);
        }
      });
    }
  }, []);

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
