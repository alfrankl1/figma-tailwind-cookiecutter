'use client'

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Palette, Heart, Download, Plus, ArrowRight, Sun, Moon, Trash, Lock, MagnifyingGlass } from "phosphor-react"
import { Input } from "@/components/ui/input"
import { InputCompact } from "@/components/ui/inputCompact"

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after component mounts on client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return // Don't run theme logic until mounted
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [mounted])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="min-h-screen p-8 pb-20 font-body-regular">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-title text-text-primary mb-2">
              Component Showcase
            </h1>
            <p className="font-body-regular text-text-secondary">
              Components, built on shadcn/ui then customized
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted ? (isDark ? <Sun /> : <Moon />) : <div className="w-4 h-4" />}
          </Button>
        </div>

        {/* All Variants */}
        <section className="mb-12">
          <h2 className="font-subtitle text-text-primary mb-6">All Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* All Sizes */}
        <section className="mb-12">
          <h2 className="font-subtitle text-text-primary mb-6">All Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Icons with Text */}
        <section className="mb-12">
          <h2 className="font-subtitle text-text-primary mb-6">Icons with Text</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button><Heart />Save</Button>
              <Button><Download />Download</Button>
              <Button>Add Item<Plus /></Button>
              <Button>Continue<ArrowRight /></Button>
            </div>
          </div>
        </section>

        {/* Icon Only Buttons */}
        <section className="mb-12">
          <h2 className="font-subtitle text-text-primary mb-6">Icon Only Buttons</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-subtitle-small text-text-secondary mb-3">Icon Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="icon-sm"><Palette weight="fill" /></Button>
                <Button size="icon-default"><Heart weight="fill" /></Button>
              </div>
            </div>
            <div>
              <h3 className="font-subtitle-small text-text-secondary mb-3">Different Variants as Icon Buttons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="ghost" size="icon-default"><Palette weight="fill" /></Button>
                <Button variant="outline" size="icon-default"><Heart weight="fill" /></Button>
                <Button variant="secondary" size="icon-default"><Download weight="fill" /></Button>
                <Button variant="default" size="icon-default"><Plus weight="fill" /></Button>
                <Button variant="destructive" size="icon-default"><Trash weight="fill" /></Button>
              </div>
            </div>
          </div>
        </section>


        {/* Interactive Examples */}
        <section className="mb-12">
          <h2 className="font-subtitle text-text-primary mb-6">Interactive Examples</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => alert('Clicked!')}>
                <Palette />
                Click Me
              </Button>
              <Button variant="outline" disabled>
                <Download />
                Disabled
              </Button>
              <Button variant="destructive">
                Delete
                <Trash />
              </Button>
            </div>
          </div>
        </section>

        {/* Input Examples */}
        <section className="mb-12">
          <h2 className="font-subtitle text-text-primary mb-6">Input Examples</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
            <Input label="Email" placeholder="Enter your email" />

            <Input variant="file" label="Upload file" />

            <Input 
              placeholder="Password"
              icon={Lock}
              type="password"
              error={true} 
              description="Password is required" 
            />
            </div>
          </div>
        </section>

        {/* Compact Input Examples */}
        <section className="mb-12">
          <h2 className="font-subtitle text-text-primary mb-6">Compact Input Examples</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Default */}
              <InputCompact placeholder="Search..." />
              {/* With icon explicitly set */}
              <InputCompact placeholder="Search with icon" icon={MagnifyingGlass} />
              {/* Error state */}
              <InputCompact placeholder="Error state" error={true} />
              {/* Filled state (simulate by passing defaultValue and state) */}
              <InputCompact defaultValue="Filled value" state="filled" />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
