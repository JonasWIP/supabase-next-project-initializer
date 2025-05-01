"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomTheme } from '@/components/ui/theme-provider';
import { themes } from '@/lib/themes';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const ThemeShowcase = () => {
  const { theme, setTheme, currentTheme } = useCustomTheme();
  // Add a client-side only state to prevent hydration mismatch
  const [hasMounted, setHasMounted] = React.useState(false);

  // Only show content after component has mounted to avoid hydration mismatch
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // If not mounted yet, render a placeholder to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-heading font-bold">Current Theme: Loading...</h2>
          <div className="h-6"></div>  {/* Placeholder for text */}
        </div>
        {/* Placeholder skeleton for the rest of the content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-muted rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-heading font-bold">Current Theme: {currentTheme.displayName}</h2>
        <p className="text-muted-foreground">
          This showcase demonstrates the various theme options available in the application.
          Use the theme selector to switch between themes.
        </p>
        
        <div className="flex items-center space-x-4 mt-2">
          <span className="font-medium">Switch Theme:</span>
          <ThemeToggle />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Palette Card */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Color Palette</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary mr-2"></div>
                <span>Primary</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary mr-2"></div>
                <span>Secondary</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-accent mr-2"></div>
                <span>Accent</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-muted mr-2"></div>
                <span>Muted</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-destructive mr-2"></div>
                <span>Destructive</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded bg-card border border-border mr-2"></div>
                <span>Card</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded bg-background border border-border mr-2"></div>
                <span>Background</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded border border-border mr-2"></div>
                <span>Border</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Typography Card */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Typography</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Heading Font</h4>
              <p className="font-heading text-lg">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Body Font</h4>
              <p>The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Mono Font</h4>
              <p className="font-mono text-sm">const example = &quot;The quick brown fox&quot;;</p>
            </div>
          </div>
        </Card>
        
        {/* UI Elements Card */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">UI Elements</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">Form Elements</h4>
              <div className="space-y-2">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Text input" 
                />
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="check" 
                    className="rounded-sm border-input bg-background"
                  />
                  <label htmlFor="check">Checkbox</label>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Charts Card */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Chart Colors</h3>
          <div className="h-40 w-full flex items-end justify-around p-2">
            <div className="w-12 bg-chart-1 rounded-t" style={{ height: '90%' }}></div>
            <div className="w-12 bg-chart-2 rounded-t" style={{ height: '65%' }}></div>
            <div className="w-12 bg-chart-3 rounded-t" style={{ height: '80%' }}></div>
            <div className="w-12 bg-chart-4 rounded-t" style={{ height: '50%' }}></div>
            <div className="w-12 bg-chart-5 rounded-t" style={{ height: '70%' }}></div>
          </div>
          <div className="flex justify-between mt-2 px-2 text-xs text-muted-foreground">
            <span>Chart 1</span>
            <span>Chart 2</span>
            <span>Chart 3</span>
            <span>Chart 4</span>
            <span>Chart 5</span>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {themes.map((themeOption) => (
          <Card 
            key={themeOption.name} 
            className={`p-4 cursor-pointer border-2 ${
              theme === themeOption.name ? 'border-primary' : 'border-border'
            }`}
            onClick={() => setTheme(themeOption.name)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{themeOption.displayName}</h3>
              {theme === themeOption.name && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-1 mb-3">
              <div 
                className="h-4 rounded" 
                style={{ backgroundColor: `hsl(${themeOption.colors.primary})` }}
              ></div>
              <div 
                className="h-4 rounded" 
                style={{ backgroundColor: `hsl(${themeOption.colors.secondary})` }}
              ></div>
              <div 
                className="h-4 rounded" 
                style={{ backgroundColor: `hsl(${themeOption.colors.accent})` }}
              ></div>
              <div 
                className="h-4 rounded" 
                style={{ backgroundColor: `hsl(${themeOption.colors.muted})` }}
              ></div>
              <div 
                className="h-4 rounded" 
                style={{ backgroundColor: `hsl(${themeOption.colors.destructive})` }}
              ></div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              {themeOption.name === 'dark' 
                ? 'Dark mode theme with light text on dark backgrounds'
                : `Theme with ${themeOption.fonts.body.split(',')[0]} font and ${themeOption.colors.primary.split(' ')[0]}° primary hue`
              }
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};