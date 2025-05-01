// filepath: c:\Users\Jonas\Documents\GitHub\supanexttemplate\supanexttemplate\app\examples\ui-components\page.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

export default function UIComponentsPage() {
  const [progress, setProgress] = useState(45);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [alignment, setAlignment] = useState("center");
  
  return (
    <PageContainer maxWidth="xl">
      <PageHeader 
        title="UI Components Showcase" 
        description="This page showcases various UI components available in the project. Explore these components to understand how they work and how they can be used in your application."
      />
      
      <Tabs defaultValue="inputs" className="w-full mb-12">
        <TabsList className="mb-4" data-testid="tabs-container-inputs">
          <TabsTrigger value="inputs">Input Controls</TabsTrigger>
          <TabsTrigger value="display">Display Components</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Components</TabsTrigger>
          <TabsTrigger value="layout">Layout Components</TabsTrigger>
        </TabsList>
        
        {/* Input Controls Tab */}
        <TabsContent value="inputs" data-testid="tab-content-inputs" className="space-y-8">
          <h2 className="text-2xl font-bold mb-4">Input Controls</h2>
          
          {/* Buttons Section */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link Button</Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" className="gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  With Icon
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Form Controls Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Form Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Text Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-input">Default Input</Label>
                    <Input id="default-input" placeholder="Enter text..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled-input">Disabled Input</Label>
                    <Input id="disabled-input" placeholder="Disabled input" disabled />
                  </div>
                </CardContent>
              </Card>
              
              {/* Checkbox and Switch */}
              <Card>
                <CardHeader>
                  <CardTitle>Toggle Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">Accept terms and conditions</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="airplane-mode" checked={switchEnabled} onCheckedChange={setSwitchEnabled} />
                      <Label htmlFor="airplane-mode">Airplane Mode {switchEnabled ? 'On' : 'Off'}</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Radio Group */}
              <Card>
                <CardHeader>
                  <CardTitle>Radio Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">Option One</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Option Two</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">Option Three</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              {/* Select */}
              <Card>
                <CardHeader>
                  <CardTitle>Select</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select defaultValue="apple">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="strawberry">Strawberry</SelectItem>
                      <SelectItem value="kiwi">Kiwi</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              {/* Slider */}
              <Card>
                <CardHeader>
                  <CardTitle>Slider</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Value: {progress}</Label>
                      <Slider
                        value={[progress]}
                        onValueChange={(value) => setProgress(value[0])}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Toggle Group */}
              <Card>
                <CardHeader>
                  <CardTitle>Toggle Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <ToggleGroup type="single" value={alignment} onValueChange={setAlignment}>
                    <ToggleGroupItem value="left" aria-label="Left aligned">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-left">
                        <line x1="21" x2="3" y1="6" y2="6"/>
                        <line x1="15" x2="3" y1="12" y2="12"/>
                        <line x1="17" x2="3" y1="18" y2="18"/>
                      </svg>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Center aligned">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-center">
                        <line x1="21" x2="3" y1="6" y2="6"/>
                        <line x1="18" x2="6" y1="12" y2="12"/>
                        <line x1="21" x2="3" y1="18" y2="18"/>
                      </svg>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Right aligned">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-right">
                        <line x1="21" x2="3" y1="6" y2="6"/>
                        <line x1="21" x2="9" y1="12" y2="12"/>
                        <line x1="21" x2="7" y1="18" y2="18"/>
                      </svg>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Display Components Tab */}
        <TabsContent value="display" data-testid="tab-content-display" className="space-y-8">
          <h2 className="text-2xl font-bold mb-4">Display Components</h2>
          
          {/* Cards Section */}
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>A simple card with header and content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the main content of the card where you can put any information.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Card with Footer</CardTitle>
                    <CardDescription>A card with actions in the footer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Cards are versatile containers that can be used for various types of content.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button size="sm">Save</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle>Featured Card</CardTitle>
                    <CardDescription>With custom styling</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>Featured</Badge>
                      <Badge variant="outline">New</Badge>
                    </div>
                    <p>You can easily customize card components to match your design requirements.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Avatars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                
                <Avatar className="h-16 w-16">
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
          
          {/* Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Progress Bar: {progress}%</Label>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Feedback Components Tab */}
        <TabsContent value="feedback" data-testid="tab-content-feedback" className="space-y-8">
          <h2 className="text-2xl font-bold mb-4">Feedback Components</h2>
          
          {/* Alert Dialog */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Dialog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Show Alert Dialog</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
          
          {/* Tooltip */}
          <Card>
            <CardHeader>
              <CardTitle>Tooltip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-10 py-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover Me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a tooltip that appears when you hover</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button>Another Example</Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Tooltip can appear on different sides</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Layout Components Tab */}
        <TabsContent value="layout" data-testid="tab-content-layout" className="space-y-8">
          <h2 className="text-2xl font-bold mb-4">Layout Components</h2>
          
          {/* Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Accordion</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that match the other components&apos; aesthetic.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It&apos;s animated by default, but you can disable it if you prefer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          {/* Separator */}
          <Card>
            <CardHeader>
              <CardTitle>Separator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p>This is some content above the separator.</p>
                <Separator className="my-4" />
                <p>This is some content below the separator.</p>
              </div>
              
              <div className="flex items-center">
                <span>Left</span>
                <Separator className="mx-4" orientation="vertical" decorative />
                <span>Right</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Scroll Area */}
          <Card>
            <CardHeader>
              <CardTitle>Scroll Area</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72 w-full rounded-md border p-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Scrollable Content</h4>
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="py-2">
                      <p>This is scrollable content item #{i + 1}</p>
                      <p className="text-muted-foreground text-sm">
                        The ScrollArea component provides a customizable scrollbar.
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Component Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This showcase demonstrates a selection of the available UI components in the project.
            For more components and detailed documentation, check out the source files or the shadcn/ui documentation.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://ui.shadcn.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center px-4 py-2 bg-background border border-input rounded-md text-sm font-medium",
                "text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              )}
            >
              <span className="mr-2">🔗</span>
              shadcn/ui Docs
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center px-4 py-2 bg-background border border-input rounded-md text-sm font-medium",
                "text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              )}
            >
              <span className="mr-2">📂</span>
              Source Code
            </a>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}