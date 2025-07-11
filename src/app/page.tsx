"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Palette, Heart, Star, Sun, Moon } from "phosphor-react"

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Check system preference and apply theme
  useEffect(() => {
    // Check system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)
    
    // Apply initial theme
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Apply/remove dark class when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center">
          <h1 className="font-title mb-8 text-text-primary">Button Component Demo</h1>
          <Button 
            onClick={toggleTheme}
            variant="outline"
            icon={isDarkMode ? Sun : Moon}
            iconPosition="left"
            className="mb-8"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        {/* Debug Info */}
        <section className="bg-background-secondary p-4 rounded-lg border border-border">
          <h3 className="font-subtitle mb-2 text-text-primary">Debug Info</h3>
          <p className="font-body-small text-text-secondary">
            Current state: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong>
          </p>
          <p className="font-body-small text-text-secondary">
            Document classes: <strong>{typeof window !== 'undefined' ? document.documentElement.className : 'Loading...'}</strong>
          </p>
        </section>

        {/* Theme Info */}
        <section className="bg-background-secondary p-6 rounded-lg border border-border">
          <h2 className="font-subtitle mb-2 text-text-primary">Current Theme</h2>
          <p className="font-body-regular text-text-secondary">
            Currently using <strong>{isDarkMode ? 'Dark' : 'Light'}</strong> mode. 
            All components automatically adapt using semantic color variables.
          </p>
        </section>

        {/* Button Variants */}
        <section>
          <h2 className="font-subtitle mb-4 text-text-primary">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* Button Sizes */}
        <section>
          <h2 className="font-subtitle mb-4 text-text-primary">Button Sizes</h2>
          <div className="flex flex-wrap items-end gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Palette /></Button>
          </div>
        </section>

        {/* Buttons with Icons */}
        <section>
          <h2 className="font-subtitle mb-4 text-text-primary">Buttons with Icons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button icon={Heart} iconPosition="left">Like</Button>
              <Button icon={Star} iconPosition="right" variant="outline">Favorite</Button>
              <Button icon={Palette} variant="secondary">Design</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button icon={Heart} iconPosition="left" size="sm">Small Like</Button>
              <Button icon={Star} iconPosition="right" variant="outline" size="lg">Large Favorite</Button>
            </div>
          </div>
        </section>

        {/* Icon Only Buttons */}
        <section>
          <h2 className="font-subtitle mb-4 text-text-primary">Icon Only Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button size="icon" variant="default"><Palette /></Button>
            <Button size="icon" variant="outline"><Heart /></Button>
            <Button size="icon" variant="secondary"><Star /></Button>
            <Button size="icon" variant="ghost"><Palette /></Button>
            <Button size="icon" variant="destructive"><Heart /></Button>
          </div>
        </section>

        {/* Custom Icons */}
        <section>
          <h2 className="font-subtitle mb-4 text-text-primary">Custom Icons (Different Sizes)</h2>
          <div className="flex flex-wrap gap-4">
            <Button size="icon" icon={Heart} />
            <Button size="icon" icon={Star} variant="outline" />
            <Button size="icon" icon={Palette} variant="secondary" />
          </div>
        </section>

        {/* States Demo */}
        <section>
          <h2 className="font-subtitle mb-4 text-text-primary">Button States</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline">Normal Outline</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
          </div>
        </section>

        {/* Theme Demonstration */}
        <section className="bg-background-tertiary p-6 rounded-lg">
          <h2 className="font-subtitle mb-4 text-text-primary">Theme Demonstration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-brand hover:bg-brand-hover p-4 rounded transition-colors">
              <p className="font-label text-text-inverse-primary">Brand Colors</p>
            </div>
            <div className="bg-positive hover:bg-positive-hover p-4 rounded transition-colors">
              <p className="font-label text-text-inverse-primary">Positive</p>
            </div>
            <div className="bg-warning hover:bg-warning-hover p-4 rounded transition-colors">
              <p className="font-label text-text-inverse-primary">Warning</p>
            </div>
            <div className="bg-danger hover:bg-danger-hover p-4 rounded transition-colors">
              <p className="font-label text-text-inverse-primary">Danger</p>
            </div>
          </div>
          <p className="font-body-small text-text-secondary mt-4">
            Toggle between light and dark modes to see how all semantic colors automatically adapt.
          </p>
        </section>
      </div>
    </div>
  )
}
