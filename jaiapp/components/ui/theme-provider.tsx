"use client"

import * as React from "react"
import { themes, ThemeDefinition } from "@/lib/themes"

type ThemeContextType = {
  theme: string;
  currentTheme: ThemeDefinition;
  setTheme: (theme: string) => void;
  availableThemes: ThemeDefinition[];
};

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "default",
  currentTheme: themes[0],
  setTheme: () => {},
  availableThemes: themes,
});

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  forcedTheme?: string;
};

/**
 * Function to apply theme CSS variables directly to the HTML element
 */
function applyThemeVariables(theme: ThemeDefinition) {
  if (typeof window === "undefined") return;
  
  const html = document.documentElement;
  
  // Apply all CSS color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    html.style.setProperty(cssVarName, value);
  });
  
  // Apply font variables
  html.style.setProperty('--font-body', theme.fonts.body);
  html.style.setProperty('--font-heading', theme.fonts.heading);
  html.style.setProperty('--font-mono', theme.fonts.mono);
  
  // Apply radius
  html.style.setProperty('--radius', theme.radius);
}

/**
 * Custom Theme Provider that directly manages theme classes
 */
export function ThemeProvider({
  children,
  defaultTheme = "default",
  storageKey = "theme",
  forcedTheme,
}: ThemeProviderProps) {
  // State to keep track of the current theme
  const [theme, setThemeState] = React.useState<string>(() => {
    if (forcedTheme) return forcedTheme;
    
    // Try to get from localStorage, but this will only work on client
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme) return storedTheme;
        
        // Check for system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) return "dark";
      } catch (e) {
        console.error("Error reading theme from localStorage:", e);
      }
    }
    
    return defaultTheme;
  });
  
  // Get the current theme object
  const currentTheme = React.useMemo(
    () => themes.find(t => t.name === theme) || themes[0],
    [theme]
  );

  // Function to change the theme
  const setTheme = React.useCallback((newTheme: string) => {
    console.log(`Setting theme to: ${newTheme}`);
    setThemeState(newTheme);
    
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        console.error("Error setting theme in localStorage:", e);
      }
    }
  }, [storageKey]);

  // Apply theme classes whenever the theme changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (forcedTheme) return;
    
    const html = document.documentElement;
    console.log(`Applying theme: ${theme}, class: ${currentTheme?.cssClass}`);
    
    // Force a clean slate by removing all possible theme classes
    const themeClasses = ['theme-default', 'theme-dark', 'dark', 'theme-blue-sapphire', 'theme-forest-green'];
    themeClasses.forEach(cls => {
      html.classList.remove(cls);
    });
    
    // Apply the new theme class with a slight delay to ensure DOM updates
    setTimeout(() => {
      if (currentTheme) {
        console.log(`Adding class: ${currentTheme.cssClass}`);
        html.classList.add(currentTheme.cssClass);
        
        // If it's a dark theme, also add the 'dark' class
        if (currentTheme.isDark) {
          html.classList.add("dark");
        }
        
        // Apply theme variables directly as inline styles (belt and suspenders approach)
        applyThemeVariables(currentTheme);
        
        // Force a style recalculation
        document.body.style.transition = 'background-color 0.1s';
        setTimeout(() => {
          document.body.style.transition = '';
        }, 100);
      }
    }, 10);
  }, [currentTheme, forcedTheme, theme]);

  // Listen for system preference changes
  React.useEffect(() => {
    if (typeof window === "undefined" || forcedTheme) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      // Only change theme if set to 'system'
      if (theme === "system") {
        setTheme(mediaQuery.matches ? "dark" : "default");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [forcedTheme, setTheme, theme]);

  const value = React.useMemo(() => ({
    theme,
    currentTheme,
    setTheme,
    availableThemes: themes,
  }), [theme, currentTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context
 */
export function useCustomTheme() {
  const context = React.useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a ThemeProvider");
  }
  
  return context;
}