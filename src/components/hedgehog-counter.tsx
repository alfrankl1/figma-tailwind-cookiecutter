import { Button } from "@/components/ui/button"
import { Plus, Minus, ArrowCounterClockwise } from "phosphor-react"

interface HedgehogCounterProps {
  count: number
  onIncrement: () => void
  onDecrement: () => void
  onReset: () => void
}

export function HedgehogCounter({ 
  count, 
  onIncrement, 
  onDecrement, 
  onReset 
}: HedgehogCounterProps) {
  return (
    <div className="text-center">
      {/* Current Count Display */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-brand-tertiary border-4 border-brand rounded-full mb-4">
          <span className="font-display text-brand">
            {count}
          </span>
        </div>
        <div>
          <h2 className="font-title-small text-text-primary mb-1">
            Current Count
          </h2>
          <p className="font-body-small text-text-secondary">
            {count === 0 ? "No hedgehogs spotted yet" : 
             count === 1 ? "1 hedgehog spotted!" : 
             `${count} hedgehogs spotted!`}
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon-default"
          onClick={onDecrement}
          disabled={count === 0}
          aria-label="Decrease count"
        >
          <Minus weight="bold" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon-default"
          onClick={onReset}
          disabled={count === 0}
          aria-label="Reset count"
        >
          <ArrowCounterClockwise weight="bold" />
        </Button>
        
        <Button
          size="icon-default"
          onClick={onIncrement}
          aria-label="Increase count"
        >
          <Plus weight="bold" />
        </Button>
      </div>
    </div>
  )
}