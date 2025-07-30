'use client'

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Plus, Minus, ArrowCounterClockwise, Sun, Moon } from "phosphor-react"
import { HedgehogCounter } from "@/components/hedgehog-counter"
import { HedgehogStats } from "@/components/hedgehog-stats"

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hedgehogCount, setHedgehogCount] = useState(0)
  const [totalCounted, setTotalCounted] = useState(0)
  const [sessions, setSessions] = useState(0)

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

    // Load saved data
    const savedCount = localStorage.getItem('hedgehogCount')
    const savedTotal = localStorage.getItem('totalCounted')
    const savedSessions = localStorage.getItem('sessions')
    
    if (savedCount) setHedgehogCount(parseInt(savedCount))
    if (savedTotal) setTotalCounted(parseInt(savedTotal))
    if (savedSessions) setSessions(parseInt(savedSessions))
  }, [mounted])

  // Save data whenever it changes
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('hedgehogCount', hedgehogCount.toString())
    localStorage.setItem('totalCounted', totalCounted.toString())
    localStorage.setItem('sessions', sessions.toString())
  }, [hedgehogCount, totalCounted, sessions, mounted])

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

  const incrementCount = () => {
    setHedgehogCount(prev => prev + 1)
    setTotalCounted(prev => prev + 1)
  }

  const decrementCount = () => {
    if (hedgehogCount > 0) {
      setHedgehogCount(prev => prev - 1)
    }
  }

  const resetCount = () => {
    if (hedgehogCount > 0) {
      setSessions(prev => prev + 1)
    }
    setHedgehogCount(0)
  }

  return (
    <div className="min-h-screen bg-background font-body-regular">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-title text-text-primary mb-2">
              🦔 Hedgehog Counter
            </h1>
            <p className="font-body-regular text-text-secondary">
              Keep track of all the hedgehogs you spot!
            </p>
          </div>
          
          <Button
            variant="outline"
            size="icon-default"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted ? (isDark ? <Sun weight="fill" /> : <Moon weight="fill" />) : <div className="w-4 h-4" />}
          </Button>
        </div>

        {/* Main Counter */}
        <div className="mb-8">
          <HedgehogCounter 
            count={hedgehogCount}
            onIncrement={incrementCount}
            onDecrement={decrementCount}
            onReset={resetCount}
          />
        </div>

        {/* Stats */}
        <HedgehogStats 
          currentCount={hedgehogCount}
          totalCounted={totalCounted}
          sessions={sessions}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button 
            size="lg"
            onClick={incrementCount}
            className="flex-1 min-w-[140px]"
          >
            <Plus weight="bold" />
            Spotted One!
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            onClick={decrementCount}
            disabled={hedgehogCount === 0}
            className="flex-1 min-w-[140px]"
          >
            <Minus weight="bold" />
            Oops, Miscount
          </Button>
        </div>

        <div className="flex justify-center mt-4">
          <Button 
            variant="secondary"
            size="default"
            onClick={resetCount}
            disabled={hedgehogCount === 0}
          >
            <ArrowCounterClockwise weight="bold" />
            New Session
          </Button>
        </div>

        {/* Fun Facts */}
        <div className="mt-12 p-6 bg-background-secondary rounded-lg border border-border">
          <h3 className="font-subtitle text-text-primary mb-4">🦔 Hedgehog Facts</h3>
          <div className="space-y-3 font-body-small text-text-secondary">
            <p>• Hedgehogs have around 5,000 to 7,000 spines on their backs</p>
            <p>• They can run up to 4.5 mph when they need to</p>
            <p>• Baby hedgehogs are called hoglets</p>
            <p>• They hibernate during winter months</p>
            <p>• Hedgehogs are excellent swimmers!</p>
          </div>
        </div>
      </div>
    </div>
  )
}