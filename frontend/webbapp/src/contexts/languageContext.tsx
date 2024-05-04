import { ReactNode, createContext, useContext, useState } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (newLanguage: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(
    localStorage.getItem("language") || "sv"
  );

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "To use the language context, you must place it inside LanguageProvider tag"
    );
  }
  return context;
}
