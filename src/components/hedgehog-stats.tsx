interface HedgehogStatsProps {
  currentCount: number
  totalCounted: number
  sessions: number
}

export function HedgehogStats({ 
  currentCount, 
  totalCounted, 
  sessions 
}: HedgehogStatsProps) {
  const averagePerSession = sessions > 0 ? (totalCounted / sessions).toFixed(1) : '0'
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Current Session */}
      <div className="bg-background-secondary p-6 rounded-lg border border-border text-center">
        <div className="text-2xl font-bold text-brand mb-2">
          {currentCount}
        </div>
        <div className="font-label-bold text-text-primary mb-1">
          This Session
        </div>
        <div className="font-caption text-text-tertiary">
          Current count
        </div>
      </div>

      {/* Total Count */}
      <div className="bg-background-secondary p-6 rounded-lg border border-border text-center">
        <div className="text-2xl font-bold text-positive mb-2">
          {totalCounted}
        </div>
        <div className="font-label-bold text-text-primary mb-1">
          Total Spotted
        </div>
        <div className="font-caption text-text-tertiary">
          All time count
        </div>
      </div>

      {/* Sessions */}
      <div className="bg-background-secondary p-6 rounded-lg border border-border text-center">
        <div className="text-2xl font-bold text-neutral mb-2">
          {sessions}
        </div>
        <div className="font-label-bold text-text-primary mb-1">
          Sessions
        </div>
        <div className="font-caption text-text-tertiary">
          Avg: {averagePerSession} per session
        </div>
      </div>
    </div>
  )
}