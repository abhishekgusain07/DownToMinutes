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
    <div className="flex h-screen bg-[#111B21]">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <svg
            viewBox="0 0 24 24"
            className="w-16 h-16 text-[#424F59]"
          >
            <path
              fill="currentColor"
              d="M12,2C6.477,2,2,6.477,2,12c0,1.89,.528,3.659,1.444,5.166L2.168,21.75c-.141,.469,.311,.921,.78,.78l4.584-1.276c1.507,.916,3.276,1.444,5.166,1.444,5.523,0,10-4.477,10-10S17.523,2,12,2Zm0,18c-1.68,0-3.3-.46-4.718-1.332l-.358-.23-3.725,1.037,1.037-3.725-.23-.358c-.872-1.418-1.332-3.038-1.332-4.718,0-4.962,4.038-9,9-9s9,4.038,9,9-4.038,9-9,9Z"
            />
          </svg>
          <div className="text-center mb-8">
            <h1 className="text-[#E9EDEF] text-xl font-light mb-1">WhatsApp</h1>
            <div className="flex items-center justify-center gap-2 text-[#8696A0]">
              <Lock className="w-3 h-3" />
              <span className="text-sm">End-to-end encrypted (NOT REALLY)</span>
            </div>
          </div>

          <div className="w-64">
            <Progress value={progress} className="h-1 bg-[#202C33]" />
          </div>
        </div>
      </div>
    </div>
  )
}