# Theme System Guide

This guide explains the theme system implemented in the SupaNext Template. The system allows for both light/dark mode toggling and multiple predefined themes with different color schemes and typography.

## Overview

The theme system has been built to support:

- Multiple theme options beyond just light and dark mode
- Different color palettes for each theme
- Custom typography (fonts) for each theme
- Adjustable border radius and other design tokens
- Easy theme switching with persistent preferences

## Core Components

### 1. Theme Definitions

Themes are defined in `lib/themes.ts` as a collection of objects with the following structure:

```typescript
type ThemeDefinition = {
  name: string;            // Unique theme identifier
  displayName: string;     // User-friendly name
  cssClass: string;        // CSS class name applied to the HTML element
  colors: {                // HSL color values
    background: string;
    foreground: string;
    // other colors...
  };
  fonts: {                 // Font family definitions
    body: string;
    heading: string;
    mono: string;
  };
  radius: string;          // Default border radius
};
```

### 2. CSS Variables

Each theme's properties are applied using CSS variables defined in `app/globals.css`. The variables follow this pattern:

```css
.theme-name {
  --background: 210 50% 98%;
  --foreground: 212 80% 20%;
  /* other color variables */
  
  --font-body: var(--font-nunito), system-ui, sans-serif;
  --font-heading: var(--font-nunito), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;
  
  --radius: 0.375rem;
}
```

These CSS variables are then accessed by Tailwind CSS through the configuration in `tailwind.config.js`.

### 3. Theme Provider

The theme provider component (`components/ui/theme-provider.tsx`) is built on top of `next-themes` and handles:

- Setting the appropriate CSS class on the HTML element
- Persisting theme preferences
- Providing theme context to components

It also includes a custom hook called `useCustomTheme()` that provides access to:

- Current theme name
- Theme setting function
- Current theme object (with all properties)
- List of available themes

### 4. Theme Toggle

The theme toggle component (`components/ui/theme-toggle.tsx`) provides a user interface for switching between themes. It includes:

- A dropdown menu with all available themes
- Visual indicators for the currently active theme
- Support for system preference detection

## Available Themes

The following themes are currently available:

1. **Default** - The standard light theme with Inter font
2. **Dark** - Dark mode variant with light text on dark backgrounds
3. **Blue Sapphire** - A blue-focused theme with Nunito font
4. **Forest Green** - A green-focused theme with Roboto and Roboto Slab fonts

## Using Themes in Components

### Accessing Theme Properties

You can access the current theme and its properties using the `useCustomTheme` hook:

```tsx
import { useCustomTheme } from '@/components/ui/theme-provider';

function MyComponent() {
  const { theme, setTheme, currentTheme } = useCustomTheme();
  
  return (
    <div>
      <p>Current theme: {currentTheme.displayName}</p>
      <button onClick={() => setTheme('blue-sapphire')}>
        Switch to Blue Sapphire
      </button>
    </div>
  );
}
```

### Theme-Aware Styling

When styling components, use Tailwind CSS classes that reference theme variables:

```tsx
// Background and text color from theme
<div className="bg-background text-foreground">
  Content
</div>

// Primary color button
<button className="bg-primary text-primary-foreground">
  Submit
</button>

// Different font families
<h1 className="font-heading">Heading Text</h1>
<p className="font-sans">Body text</p>
<code className="font-mono">Code sample</code>
```

## Creating a New Theme

To add a new theme to the system:

1. Add a new theme definition in `lib/themes.ts`
2. Add corresponding CSS variables in `app/globals.css`
3. If using custom fonts, import and configure them in `app/layout.tsx`

Example of adding a new theme:

```typescript
// In lib/themes.ts
export const purpleReignTheme: ThemeDefinition = {
  name: "purple-reign",
  displayName: "Purple Reign",
  cssClass: "theme-purple-reign",
  colors: {
    background: "260 50% 97%",
    foreground: "260 60% 20%",
    // Add all required colors...
  },
  fonts: {
    body: "var(--font-poppins), system-ui, sans-serif",
    heading: "var(--font-playfair), serif",
    mono: "var(--font-fira-code), monospace",
  },
  radius: "0.75rem",
};

// Don't forget to add to the themes array
export const themes = [
  defaultTheme,
  darkTheme,
  blueSapphireTheme,
  forestGreenTheme,
  purpleReignTheme,
];
```

## Theme Showcase

To explore and test the available themes, visit the theme showcase page at `/examples/themes`. This page provides:

- A preview of all available themes
- Interactive theme switching
- Examples of UI elements with the current theme applied
- Typography samples

## Best Practices

1. **Always use theme variables**: Use `bg-background` instead of `bg-white` to ensure theme compatibility.

2. **Consider dark mode**: When designing components, consider how they will look in both light and dark modes.

3. **Test with different themes**: Ensure your components look good across all themes by testing them on the showcase page.

4. **Typography**: Use the correct font classes (`font-sans`, `font-heading`, `font-mono`) rather than hardcoding fonts.

5. **Custom components**: When creating custom components, leverage the `uiStyles` utility from `lib/ui-styles.ts` to ensure consistency.

## Extending the Theme System

The theme system can be further extended to support:

- User-customizable themes
- More granular control over theme properties
- Additional themes for specific sections or features
- Dynamic theme generation based on user preferences or branding requirements