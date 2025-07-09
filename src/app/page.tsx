"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark class to document element - fix for Next.js App Router
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        console.log('✅ Applied .dark class to document element');
        console.log('Current document classes:', document.documentElement.classList.toString());
      } else {
        document.documentElement.classList.remove('dark');
        console.log('❌ Removed .dark class from document element');
        console.log('Current document classes:', document.documentElement.classList.toString());
      }
    }
  }, [isDarkMode]);

  // Check system preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    console.log('🔄 Toggling dark mode from', isDarkMode, 'to', !isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  const debugCSS = () => {
    if (typeof window !== 'undefined') {
      const testEl = document.createElement('div');
      testEl.style.backgroundColor = 'var(--color-background)';
      testEl.style.color = 'var(--color-text-primary)';
      document.body.appendChild(testEl);
      
      const computedStyles = window.getComputedStyle(testEl);
      console.log('🎨 CSS Debug Info:');
      console.log('Background color:', computedStyles.backgroundColor);
      console.log('Text color:', computedStyles.color);
      console.log('--color-background value:', computedStyles.getPropertyValue('--color-background'));
      console.log('--color-text-primary value:', computedStyles.getPropertyValue('--color-text-primary'));
      
      document.body.removeChild(testEl);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Debug Section */}
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-8">
        <h3 className="font-bold mb-2">🐛 Debug Info</h3>
        <p><strong>Current mode:</strong> {isDarkMode ? 'Dark' : 'Light'}</p>
        <p><strong>Document has .dark class:</strong> {typeof window !== 'undefined' ? document.documentElement.classList.contains('dark').toString() : 'Loading...'}</p>
        <button 
          onClick={debugCSS}
          className="bg-red-500 text-white px-3 py-1 rounded mt-2 mr-2"
        >
          Debug CSS Values
        </button>
        <button 
          onClick={() => console.log('Current HTML element:', document.documentElement)}
          className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
        >
          Log HTML Element
        </button>
      </div>

      {/* Test Section with explicit colors */}
      <div className="mb-8 p-4 border-2 border-dashed border-gray-400">
        <h3 className="font-bold mb-4">🧪 Color Test Sections</h3>
        
        {/* Direct CSS variable test */}
        <div 
          style={{ 
            backgroundColor: 'var(--color-background)', 
            color: 'var(--color-text-primary)',
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid var(--color-border)'
          }}
        >
          <strong>Direct CSS Variables:</strong> This uses inline style with var(--color-background) and var(--color-text-primary)
        </div>

        {/* TailwindCSS utility classes */}
        <div className="bg-background text-text-primary p-4 mb-4 border border-border">
          <strong>Tailwind Utilities:</strong> This uses bg-background, text-text-primary, and border-border classes
        </div>

        {/* Fallback colors to compare */}
        <div className="bg-white text-black p-4 mb-4 border border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600">
          <strong>Standard Tailwind:</strong> This uses bg-white/dark:bg-gray-900 for comparison
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center bg-background-secondary p-6 rounded-lg border border-border">
          <h1 className="font-display text-text-brand-primary">
            Design System Demo
          </h1>
          
          <button 
            onClick={toggleDarkMode}
            className="bg-brand hover:bg-brand-hover text-text-inverse-primary dark:text-text-primary px-4 py-2 rounded font-button flex items-center space-x-2 transition-colors"
          >
            <span>{isDarkMode ? '☀️' : '🌙'}</span>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Typography Examples */}
        <div className="bg-neutral-tertiary p-6 rounded-lg">
          <h2 className="font-title text-text-neutral-primary mb-3">
            Semantic Font Classes
          </h2>
          
          <h3 className="font-title-small text-text-neutral-secondary mb-2">
            Typography Hierarchy
          </h3>
          
          <h4 className="font-subtitle text-text-brand-secondary mb-2">
            Subtitle Example
          </h4>
          
          <h5 className="font-subtitle-small text-text-neutral-tertiary mb-4">
            Subtitle Small Example
          </h5>
          
          <p className="font-body-large text-text-primary mb-3">
            This is large body text that demonstrates how our semantic font classes work with semantic color classes.
          </p>
          
          <p className="font-body-regular text-text-secondary mb-3">
            This is regular body text with proper line height and spacing for optimal readability.
          </p>
          
          <p className="font-body-small text-text-tertiary mb-4">
            This is small body text that might be used for secondary information.
          </p>
          
          <p className="font-caption text-text-neutral-tertiary mb-4">
            This is caption text for image descriptions or metadata.
          </p>
          
          <div className="font-code bg-neutral text-text-inverse-primary p-4 rounded mb-4">
            console.log("Code example with monospace font");
          </div>
          
          <div className="space-x-4">
            <button className="font-button bg-brand hover:bg-brand-hover text-text-inverse-primary px-4 py-2 rounded">
              Primary Button
            </button>
            
            <button className="font-button bg-neutral-secondary hover:bg-neutral-secondary-hover text-text-primary px-4 py-2 rounded">
              Secondary Button
            </button>
          </div>
        </div>
        
        {/* Color Examples */}
        <div className="bg-background-secondary p-6 rounded-lg">
          <h2 className="font-title-small text-text-neutral-primary mb-4">
            Semantic Color Classes
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-brand hover:bg-brand-hover p-4 rounded">
              <p className="font-label text-text-inverse-primary">Brand</p>
            </div>
            
            <div className="bg-positive hover:bg-positive-hover p-4 rounded">
              <p className="font-label text-text-inverse-primary">Positive</p>
            </div>
            
            <div className="bg-warning hover:bg-warning-hover p-4 rounded">
              <p className="font-label text-text-inverse-primary">Warning</p>
            </div>
            
            <div className="bg-danger hover:bg-danger-hover p-4 rounded">
              <p className="font-label text-text-inverse-primary">Danger</p>
            </div>
          </div>
        </div>
        
        {/* Interactive Examples */}
        <div className="bg-brand-tertiary p-6 rounded-lg">
          <h2 className="font-subtitle text-text-brand-primary mb-4">
            Interactive Elements
          </h2>
          
          <div className="space-y-4">
            <div className="border-border-secondary border-2 p-4 rounded">
              <label className="font-label text-text-brand-secondary block mb-2">
                Input Label
              </label>
              <input 
                type="text" 
                placeholder="Type something..."
                className="bg-background border-border-tertiary border w-full px-3 py-2 rounded focus:border-brand font-input"
              />
            </div>
            
            <div className="bg-positive-tertiary border-positive border-l-4 p-4 rounded">
              <p className="font-body-regular text-text-positive-primary">
                Success message with semantic colors and typography
              </p>
            </div>
            
            <div className="bg-warning-tertiary border-warning border-l-4 p-4 rounded">
              <p className="font-body-regular text-text-warning-primary">
                Warning message with semantic colors and typography
              </p>
            </div>
            
            <div className="bg-danger-tertiary border-danger border-l-4 p-4 rounded">
              <p className="font-body-regular text-text-danger-primary">
                Error message with semantic colors and typography
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
