'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnimationsExamplePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['Simple', 'Stagger', 'Gestures'];
  
  return (
    <PageContainer>
      <PageHeader title="Framer Motion Examples" />
      
      <div className="mb-8">
        <p className="text-muted-foreground">
          Interactive examples using Framer Motion to create smooth animations in your Next.js application.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 border-b">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab}
            className={`px-4 py-2 font-medium ${activeTab === index ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab(index)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Simple animations */}
      {activeTab === 0 && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Fade and Scale</CardTitle>
              <CardDescription>Simple fade and scale animation with a button click</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? 'Hide' : 'Show'} Element
              </Button>
              
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-secondary rounded-lg text-center"
                >
                  <h3 className="text-xl font-bold mb-2">Hello Animation!</h3>
                  <p>This element animates in and out smoothly.</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hover Animation</CardTitle>
              <CardDescription>Interactive hover effects on cards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <motion.div
                    key={item}
                    className="p-4 bg-card rounded-lg border cursor-pointer"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="font-bold">Interactive Card {item}</h3>
                    <p className="text-sm text-muted-foreground">Hover or click me!</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stagger animations */}
      {activeTab === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Staggered Animation</CardTitle>
            <CardDescription>Elements that animate in sequence</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item, i) => (
                <motion.div
                  key={item}
                  className="h-32 bg-primary/5 rounded-lg flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                  }}
                >
                  <span className="text-xl font-bold">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      )}

      {/* Gesture animations */}
      {activeTab === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Gesture Animations</CardTitle>
            <CardDescription>Animations triggered by user interactions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <motion.div
              className="w-32 h-32 bg-primary rounded-full flex items-center justify-center cursor-grab"
              drag
              dragConstraints={{
                top: -50,
                left: -50,
                right: 50,
                bottom: 50,
              }}
              whileDrag={{ scale: 1.2 }}
              whileTap={{ cursor: "grabbing" }}
            >
              <span className="text-primary-foreground font-bold">Drag me!</span>
            </motion.div>
            <p className="mt-4 text-muted-foreground text-sm text-center">
              Try dragging the circle around!
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          These examples demonstrate just a small sample of what&apos;s possible with Framer Motion. 
          Check out the <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">official documentation</a> for more advanced animations.
        </p>
      </div>
    </PageContainer>
  );
}