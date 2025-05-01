# Styling Guide for SupaNext Template

This guide provides a comprehensive overview of the styling system used in the SupaNext Template. It explains how to leverage the theme system, component architecture, and styling patterns to create consistent and visually appealing interfaces.

## 1. Styling Architecture

The styling system in SupaNext Template is built on three key pillars:

1. **Tailwind CSS** - Utility-first CSS framework
2. **Theme System** - Multi-theme support with CSS variables
3. **Component Library** - shadcn/ui components and custom UI utilities

This approach provides flexibility while ensuring consistency across your application.

## 2. Theme System

### Available Themes

The template includes four built-in themes:

1. **Default** (Light) - Clean, professional light theme with Inter font
2. **Dark** - Modern dark theme for low-light environments
3. **Blue Sapphire** - Light theme with blue color scheme and Nunito font
4. **Forest Green** - Light theme with green color scheme and Roboto/Roboto Slab fonts

### Theme Structure

Each theme defines:

- **Color palette** (using HSL values)
- **Typography settings** (font families)
- **Border radius**
- **Chart colors** (for data visualization)

Themes are defined in `lib/themes.ts` and implemented in `app/globals.css` using CSS variables.

```typescript
// Example theme definition in lib/themes.ts
export const blueSapphireTheme: ThemeDefinition = {
  name: "blue-sapphire",
  displayName: "Blue Sapphire",
  cssClass: "theme-blue-sapphire",
  isDark: false,
  colors: {
    background: "210 50% 98%",
    foreground: "212 80% 20%",
    // Additional colors...
  },
  fonts: {
    body: "var(--font-nunito), system-ui, sans-serif",
    heading: "var(--font-nunito), system-ui, sans-serif",
    mono: "var(--font-jetbrains-mono), monospace",
  },
  radius: "0.375rem",
};
```

### Using Theme Variables

Tailwind is configured to use these CSS variables, allowing you to create theme-aware components:

```tsx
// Theme-aware button using Tailwind classes
<button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2">
  Submit
</button>
```

### Switching Themes

The theme can be switched using the `ThemeProvider` component:

```tsx
import { useCustomTheme } from '@/components/ui/theme-provider';

function MyComponent() {
  const { theme, setTheme, currentTheme } = useCustomTheme();
  
  return (
    <button onClick={() => setTheme('blue-sapphire')}>
      Switch to Blue Sapphire
    </button>
  );
}
```

## 3. UI Styles Utility

The `uiStyles` utility in `lib/ui-styles.ts` provides predefined styling patterns for common UI elements:

```typescript
import { uiStyles } from '@/lib/ui-styles';

// Usage examples
<p className={uiStyles.text.muted}>This is muted text</p>
<div className={uiStyles.bg.secondary}>Secondary background</div>
<button className={uiStyles.button.primary}>Primary Button</button>
```

### Available Style Categories

- **`text`**: Text styling (default, muted, primary, secondary, accent, success, warning, error)
- **`bg`**: Background styling (default, primary, secondary, accent, code)
- **`border`**: Border styling (default, accent, primary, error)
- **`button`**: Button variants (primary, secondary, destructive, outline, ghost, link)
- **`card`**: Card styling (default, hover)
- **`input`**: Form input styling (default, focus)
- **`container`**: Container styling (code)

## 4. Layout Components

The project includes reusable layout components in the `components/layout` directory:

### PageContainer

`PageContainer` provides consistent page layout with configurable width:

```tsx
import { PageContainer } from '@/components/layout/PageContainer';

export default function MyPage() {
  return (
    <PageContainer>
      <h1>Page Title</h1>
      {/* Page content */}
    </PageContainer>
  );
}
```

Options:
- `className`: Additional CSS classes
- `maxWidth`: Maximum width ('default', 'sm', 'md', 'lg', 'xl', 'full')

### PageHeader

`PageHeader` provides consistent page headers with title and description:

```tsx
import { PageHeader } from '@/components/layout/PageHeader';

export default function MyPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Page Title" 
        description="This is a description of the page."
      />
      {/* Page content */}
    </PageContainer>
  );
}
```

## 5. Component Styling with shadcn/ui

The template uses [shadcn/ui](https://ui.shadcn.com/) components which are built with Radix UI primitives and Tailwind CSS.

### Using shadcn/ui Components

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>Card Title</CardHeader>
      <CardContent>This is the card content.</CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
}
```

### Customizing Components

shadcn/ui components can be customized by:

1. **Modifying component source** - Since components are copied into your project
2. **Using Tailwind classes** - Override styles with additional classes
3. **Using the `cn` utility** - Compose class names conditionally

```tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function CustomButton({ className, ...props }) {
  return (
    <Button 
      className={cn('rounded-full', className)} 
      {...props} 
    />
  );
}
```

## 6. Responsive Design

The template supports fully responsive design using Tailwind's breakpoint system:

### Breakpoint Prefixes

- `sm:` - Small screens (640px and above)
- `md:` - Medium screens (768px and above)
- `lg:` - Large screens (1024px and above)
- `xl:` - Extra large screens (1280px and above)
- `2xl:` - 2X large screens (1536px and above)

### Example

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Content will be 1 column on mobile, 2 on medium screens, 3 on large screens */}
</div>
```

### Mobile Detection

For programmatic detection of mobile screens, use the `useMobile` hook:

```tsx
import { useMobile } from '@/hooks/use-mobile';

function MyResponsiveComponent() {
  const isMobile = useMobile();
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## 7. Form Components

The template includes form components with consistent styling:

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormAlert } from '@/components/forms/FormAlert';
import { FormDivider } from '@/components/forms/FormDivider';

export function MyForm() {
  return (
    <form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        
        <FormDivider>Additional Information</FormDivider>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        
        <FormAlert type="info">
          We'll never share your email.
        </FormAlert>
      </div>
    </form>
  );
}
```

## 8. Best Practices

### Theme-Aware Development

- Use theme variables instead of hard-coded colors
  - ✅ `bg-background text-foreground`
  - ❌ `bg-white text-black`

### Using the `cn` Utility

Use the `cn` utility from `lib/utils.ts` for composing class names:

```tsx
import { cn } from '@/lib/utils';

function MyComponent({ className, variant = 'default' }) {
  return (
    <div className={cn(
      'base-classes',
      variant === 'primary' && 'primary-classes',
      variant === 'secondary' && 'secondary-classes',
      className
    )}>
      Content
    </div>
  );
}
```

### Organizing Complex Classes

For components with many classes, organize by category:

```tsx
<div
  className={cn(
    // Layout
    "flex flex-col gap-4",
    // Appearance
    "bg-card text-card-foreground",
    // Spacing
    "p-4 md:p-6",
    // Miscellaneous
    "rounded-lg shadow-sm"
  )}
>
  Content
</div>
```

### Consistent Spacing

Use Tailwind's spacing scale for consistent layout:

```tsx
<div className="space-y-4">
  <h2 className="text-2xl font-bold">Section Title</h2>
  <p className="text-muted-foreground">Description text</p>
  <div className="flex gap-2">
    <Button>Primary Action</Button>
    <Button variant="outline">Secondary Action</Button>
  </div>
</div>
```

### Testing with Different Themes

Always test your components with all available themes using the theme showcase page at `/examples/themes`.

## 9. Chart and Data Visualization

The theme system includes chart colors for consistent data visualization:

```tsx
import { Line } from 'react-chartjs-2';

function Chart() {
  const chartData = {
    datasets: [
      {
        label: 'Dataset 1',
        borderColor: 'hsl(var(--chart-1))',
        data: [1, 2, 3, 4, 5],
      },
      {
        label: 'Dataset 2',
        borderColor: 'hsl(var(--chart-2))',
        data: [5, 4, 3, 2, 1],
      },
    ],
  };
  
  return <Line data={chartData} />;
}
```

## 10. Resources and Examples

- **Theme Showcase**: Visit `/examples/themes` to see all available themes
- **UI Components**: Visit `/examples/ui-components` for all available components
- **Example Pages**: Check the `/examples` directory for reference implementations
- **shadcn UI Documentation**: https://ui.shadcn.com/docs
- **Tailwind Documentation**: https://tailwindcss.com/docs