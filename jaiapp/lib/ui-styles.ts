/**
 * UI Styles utility
 * 
 * This file contains reusable styling patterns that leverage shadcn/ui's theme variables
 * to provide consistent styling across the application.
 */

export const uiStyles = {
  // Text colors for different states
  text: {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-green-600 dark:text-green-500',
    warning: 'text-amber-600 dark:text-amber-500',
    error: 'text-red-600 dark:text-red-400',
  },

  // Background colors
  bg: {
    default: 'bg-background',
    primary: 'bg-muted/50',
    secondary: 'bg-muted',
    accent: 'bg-accent',
    code: 'bg-background',
  },
  
  // Border styles
  border: {
    default: 'border border-border',
    accent: 'border border-accent',
    primary: 'border border-primary',
    error: 'border border-destructive',
  },
  
  // Button styles
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  
  // Card styles
  card: {
    default: 'bg-card text-card-foreground',
    hover: 'hover:bg-muted/50 transition-colors',
  },
  
  // Input styles
  input: {
    default: 'bg-background border-input',
    focus: 'focus-visible:ring-1 focus-visible:ring-ring',
  },
  
  // Container styles
  container: {
    code: 'p-4 rounded bg-background border border-border overflow-auto text-sm font-mono',
  },
};