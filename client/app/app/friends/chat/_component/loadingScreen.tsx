"use client"

import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"
import { useEffect, useState } from "react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 1
      })
    }, 50) // Update every 50ms to complete in 5 seconds (50ms * 100 = 5000ms)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-center space-y-3">
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Loading Chat
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span className="text-sm">End-to-end encrypted</span>
            </div>
          </div>
          <div className="w-72">
            <Progress 
              value={progress} 
              className="h-1 bg-muted" 
            />
          </div>
        </div>
      </div>
    </div>
  )
}