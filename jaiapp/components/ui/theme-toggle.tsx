"use client"

import * as React from "react"
import { Check, Moon, Paintbrush, Sun, Monitor } from "lucide-react"
import { useCustomTheme } from "./theme-provider"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme, currentTheme, availableThemes } = useCustomTheme()

  // Check if we're in a dark theme
  const isDark = currentTheme.isDark || false

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {/* Show sun icon when in light mode */}
          <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'scale-0' : 'scale-100'}`} />
          
          {/* Show moon icon when in dark mode */}
          <Moon 
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'scale-100' : 'scale-0'}`} 
          />
          
          {/* Show paintbrush icon for custom themes */}
          {theme !== 'default' && theme !== 'dark' && theme !== 'system' && (
            <Paintbrush 
              className="absolute h-[1.2rem] w-[1.2rem] opacity-40" 
              style={{ transform: 'scale(0.85)' }}
            />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            System
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
            {theme === "system" && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Color Themes
          </DropdownMenuLabel>
          
          {availableThemes.map((themeOption) => {
            // Skip system theme as it's handled above
            if (themeOption.name === 'system') return null;
            
            // Skip the dark theme to show separately
            if (themeOption.name === 'dark') return null;
            
            return (
              <DropdownMenuItem 
                key={themeOption.name}
                onClick={() => setTheme(themeOption.name)}
              >
                <div className="flex items-center flex-1">
                  <div 
                    className="mr-2 h-4 w-4 rounded-full border" 
                    style={{ 
                      backgroundColor: `hsl(${themeOption.colors.primary})`,
                      borderColor: `hsl(${themeOption.colors.border})` 
                    }}
                  />
                  <span>{themeOption.displayName}</span>
                </div>
                {theme === themeOption.name && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Dark Mode
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
            {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}