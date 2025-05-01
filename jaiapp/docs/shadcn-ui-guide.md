# Shadcn/UI Implementation Guide

This guide will help you integrate and use shadcn/ui components in your SupaNext project.

## What is shadcn/ui?

[shadcn/ui](https://ui.shadcn.com/) is a collection of reusable components built with [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/). It provides a set of accessible, customizable components that you can copy and paste into your apps.

Unlike traditional component libraries, shadcn/ui is not installed as a dependency. Instead, you add the components you need directly to your project, which makes them:

- Fully customizable
- No external dependencies to update
- No configuration or build issues
- Easy to understand and modify to fit your needs

## Adding Components

Our project is already configured with shadcn/ui. You can add components using the following command:

```bash
npx shadcn@latest add [component-name]
```

For example, to add the Dialog component:

```bash
npx shadcn@latest add dialog
```

### Available Components

Here are some of the commonly used components from shadcn/ui:

- `accordion`
- `alert`
- `alert-dialog`
- `aspect-ratio`
- `avatar`
- `badge`
- `button` (already implemented in our project)
- `calendar`
- `card` (already implemented in our project)
- `checkbox`
- `dialog`
- `dropdown-menu`
- `form`
- `hover-card`
- `input`
- `label`
- `menubar`
- `popover`
- `progress`
- `radio-group`
- `select`
- `separator`
- `sheet`
- `skeleton`
- `slider`
- `switch`
- `table`
- `tabs`
- `textarea`
- `toast`
- `toggle`
- `tooltip`

Visit the [shadcn/ui docs](https://ui.shadcn.com/docs/components) for the complete list and detailed usage information.

## Using Components

After adding a component, you can import and use it in your React components:

```tsx
// Import the component
import { Button } from "@/components/ui/button";

// Use it in your component
export default function MyComponent() {
  return (
    <Button variant="outline">Click me</Button>
  );
}
```

### Component Variants

Most shadcn/ui components have different variants you can use. For example, the Button component has these variants:

```tsx
<Button>Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

And size variants:

```tsx
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

## Theming

Our project uses the shadcn/ui theming system with Tailwind CSS. The theme is defined in the following files:

- `tailwind.config.js` - Configures the theme colors and other Tailwind CSS settings
- `app/globals.css` - Contains CSS variables for the theme

### Dark Mode

The project supports both light and dark modes. The mode is controlled by the `theme` attribute on the `html` element and CSS variables in `globals.css`.

To toggle between light and dark mode, use the `ThemeProvider` component and the `useTheme` hook that are included in the project.

## Best Practices

1. **Use semantic components**: Choose components that best represent the meaning of your UI elements (e.g., `Button` for actions, `Dialog` for modal windows).

2. **Customize thoughtfully**: While you can customize any component, try to maintain consistency by creating reusable variants rather than one-off styles.

3. **Follow accessibility guidelines**: shadcn/ui components are built with accessibility in mind, but make sure you use them correctly (e.g., providing proper labels, aria attributes).

4. **Use composition**: Combine components to create more complex UI patterns instead of creating new components from scratch.

5. **Read the source code**: Since the components are directly in your project, don't hesitate to read and understand how they work.

## Troubleshooting

- **Component styling issues**: If a component doesn't look right, check if all the required CSS is imported in your globals.css file.

- **TypeScript errors**: Make sure you're using the components with the correct props as defined in their TypeScript interfaces.

- **Missing dependencies**: Some components require additional Radix UI packages. Check the installation instructions for each component.

## Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)