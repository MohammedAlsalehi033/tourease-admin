'use client'

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // This is to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col items-center justify-start pt-12">
      <div className="app-bar w-full fixed top-0 left-0 z-10">
        <h1 className="text-headline-md">Flutter-inspired Theme</h1>
      </div>
      
      <div className="max-w-3xl w-full px-6 mt-16">
        <h1 className="mb-6">Material Design Theme</h1>
        
        <div className="card mb-8">
          <h2 className="mb-4">Theme Preferences</h2>
          <p className="mb-6">Select your preferred theme mode below:</p>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setTheme("light")}
              className={theme === 'light' ? 'btn-primary' : 'btn-outlined'}
            >
              Light Mode
            </button>
            
            <button 
              onClick={() => setTheme("dark")}
              className={theme === 'dark' ? 'btn-primary' : 'btn-outlined'}
            >
              Dark Mode
            </button>
          </div>
        </div>
        
        <div className="card mb-8">
          <h2 className="mb-4">Button Styles</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="btn-primary">Primary</button>
            <button className="btn-outlined">Outlined</button>
            <button className="btn-text">Text</button>
            <button className="btn-primary" disabled>Disabled</button>
          </div>
          
          <div className="divider"></div>
          
          <h2 className="my-4">Form Controls</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-title-md mb-2">Input Field</label>
              <input 
                type="text" 
                placeholder="Enter some text"
                className="input w-full" 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="checkbox" id="check1" />
              <label htmlFor="check1" className="text-body-md">Checkbox</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative inline-block w-11 h-6">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  id="switch1" 
                />
                <label 
                  htmlFor="switch1" 
                  className="switch absolute cursor-pointer"
                ></label>
              </div>
              <label htmlFor="switch1" className="text-body-md">Toggle Switch</label>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <h2 className="my-4">Typography</h2>
          <div className="space-y-2">
            <p className="text-display-lg font-bold">Display Large</p>
            <p className="text-display-md font-bold">Display Medium</p>
            <p className="text-display-sm font-bold">Display Small</p>
            <p className="text-headline-lg font-semibold">Headline Large</p>
            <p className="text-headline-md font-semibold">Headline Medium</p>
            <p className="text-headline-sm font-semibold">Headline Small</p>
            <p className="text-body-lg">Body Large</p>
            <p className="text-body-md">Body Medium</p>
            <p className="text-body-sm">Body Small</p>
          </div>
        </div>
        
        {/* Colors Section */}
        <div className="card mb-8">
          <h2 className="mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary"></div>
              <p className="mt-2 text-title-sm">Primary</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-primary-light"></div>
              <p className="mt-2 text-title-sm">Primary Light</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-error"></div>
              <p className="mt-2 text-title-sm">Error</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-success"></div>
              <p className="mt-2 text-title-sm">Success</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-warning"></div>
              <p className="mt-2 text-title-sm">Warning</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-info"></div>
              <p className="mt-2 text-title-sm">Info</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-light-background dark:bg-dark-background border border-gray-300 dark:border-gray-700"></div>
              <p className="mt-2 text-title-sm">Background</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-light-surface dark:bg-dark-surface border border-gray-300 dark:border-gray-700"></div>
              <p className="mt-2 text-title-sm">Surface</p>
            </div>
          </div>
        </div>
      </div>
    
      <div className="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div className="grid grid-cols-3 align-baseline gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 2</div>
  <div>Item 2</div>
</div>

<div className="inline-flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
    
    </div>
  );
}