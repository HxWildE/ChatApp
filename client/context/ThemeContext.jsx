import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [font, setFont] = useState(localStorage.getItem('app-font') || 'Inter');
  
  useEffect(() => {
    localStorage.setItem('app-font', font);
    if (font === 'System') {
      document.body.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    } else {
      document.body.style.fontFamily = `"${font}", sans-serif`;
    }
  }, [font]);

  return (
    <ThemeContext.Provider value={{ font, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
};
