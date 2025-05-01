/**
 * Theme configuration
 * 
 * This file defines the available themes for the application.
 * Each theme has its own color palette and font settings.
 */

export type ThemeDefinition = {
  name: string;
  displayName: string;
  cssClass: string;
  isDark?: boolean;  // New property to indicate if the theme is dark
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  radius: string;
};

// Default theme (current light theme)
export const defaultTheme: ThemeDefinition = {
  name: "default",
  displayName: "Default",
  cssClass: "theme-default",
  isDark: false,
  colors: {
    background: "0 0% 100%",
    foreground: "224 71.4% 4.1%",
    card: "0 0% 100%",
    cardForeground: "224 71.4% 4.1%",
    popover: "0 0% 100%",
    popoverForeground: "224 71.4% 4.1%",
    primary: "220.9 39.3% 11%",
    primaryForeground: "210 20% 98%",
    secondary: "220 14.3% 95.9%",
    secondaryForeground: "220.9 39.3% 11%",
    muted: "220 14.3% 95.9%",
    mutedForeground: "220 8.9% 46.1%",
    accent: "220 14.3% 95.9%",
    accentForeground: "220.9 39.3% 11%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "210 20% 98%",
    border: "220 13% 91%",
    input: "220 13% 91%",
    ring: "224 71.4% 4.1%",
    chart1: "12 76% 61%",
    chart2: "173 58% 39%",
    chart3: "197 37% 24%",
    chart4: "43 74% 66%",
    chart5: "27 87% 67%",
  },
  fonts: {
    body: "var(--font-inter), system-ui, sans-serif",
    heading: "var(--font-inter), system-ui, sans-serif",
    mono: "var(--font-jetbrains-mono), monospace",
  },
  radius: "0.5rem",
};

// Dark theme
export const darkTheme: ThemeDefinition = {
  name: "dark",
  displayName: "Dark",
  cssClass: "theme-dark",  // Remove the space and the 'dark' class
  isDark: true,  // Mark as a dark theme explicitly
  colors: {
    background: "224 71.4% 4.1%",
    foreground: "210 20% 98%",
    card: "224 71.4% 4.1%",
    cardForeground: "210 20% 98%",
    popover: "224 71.4% 4.1%",
    popoverForeground: "210 20% 98%",
    primary: "210 20% 98%",
    primaryForeground: "220.9 39.3% 11%",
    secondary: "215 27.9% 16.9%",
    secondaryForeground: "210 20% 98%",
    muted: "215 27.9% 16.9%",
    mutedForeground: "217.9 10.6% 64.9%",
    accent: "215 27.9% 16.9%",
    accentForeground: "210 20% 98%",
    destructive: "0 62.8% 30.6%",
    destructiveForeground: "210 20% 98%",
    border: "215 27.9% 16.9%",
    input: "215 27.9% 16.9%",
    ring: "216 12.2% 83.9%",
    chart1: "220 70% 50%",
    chart2: "160 60% 45%",
    chart3: "30 80% 55%",
    chart4: "280 65% 60%",
    chart5: "340 75% 55%",
  },
  fonts: {
    body: "var(--font-inter), system-ui, sans-serif",
    heading: "var(--font-inter), system-ui, sans-serif",
    mono: "var(--font-jetbrains-mono), monospace",
  },
  radius: "0.5rem",
};

// New theme: Blue Sapphire
export const blueSapphireTheme: ThemeDefinition = {
  name: "blue-sapphire",
  displayName: "Blue Sapphire",
  cssClass: "theme-blue-sapphire",
  isDark: false,
  colors: {
    background: "210 50% 98%",
    foreground: "212 80% 20%",
    card: "0 0% 100%",
    cardForeground: "212 80% 20%",
    popover: "0 0% 100%",
    popoverForeground: "212 80% 20%",
    primary: "212 80% 35%",
    primaryForeground: "210 40% 98%",
    secondary: "210 40% 90%",
    secondaryForeground: "212 80% 35%",
    muted: "210 40% 96%",
    mutedForeground: "212 50% 40%",
    accent: "199 80% 40%",
    accentForeground: "0 0% 100%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "210 40% 98%",
    border: "212 30% 85%",
    input: "212 30% 85%",
    ring: "212 80% 35%",
    chart1: "212 80% 45%",
    chart2: "190 70% 50%",
    chart3: "230 60% 55%",
    chart4: "170 65% 45%",
    chart5: "200 85% 30%",
  },
  fonts: {
    body: "var(--font-nunito), system-ui, sans-serif",
    heading: "var(--font-nunito), system-ui, sans-serif",
    mono: "var(--font-jetbrains-mono), monospace",
  },
  radius: "0.375rem",
};

// New theme: Forest Green
export const forestGreenTheme: ThemeDefinition = {
  name: "forest-green",
  displayName: "Forest Green",
  cssClass: "theme-forest-green",
  isDark: false,
  colors: {
    background: "120 30% 98%",
    foreground: "125 50% 15%",
    card: "0 0% 100%",
    cardForeground: "125 50% 15%",
    popover: "0 0% 100%",
    popoverForeground: "125 50% 15%",
    primary: "135 50% 30%",
    primaryForeground: "120 40% 98%",
    secondary: "120 20% 90%",
    secondaryForeground: "135 50% 30%",
    muted: "120 20% 95%",
    mutedForeground: "125 30% 40%",
    accent: "150 60% 35%",
    accentForeground: "0 0% 100%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "120 40% 98%",
    border: "125 20% 85%",
    input: "125 20% 85%",
    ring: "135 50% 30%",
    chart1: "135 70% 40%",
    chart2: "95 60% 50%",
    chart3: "160 50% 45%",
    chart4: "80 55% 40%",
    chart5: "190 60% 35%",
  },
  fonts: {
    body: "var(--font-roboto), system-ui, sans-serif",
    heading: "var(--font-roboto-slab), serif",
    mono: "var(--font-fira-code), monospace",
  },
  radius: "0.25rem",
};

// All available themes
export const themes = [
  defaultTheme,
  darkTheme,
  blueSapphireTheme,
  forestGreenTheme,
];