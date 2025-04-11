"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorDisplayProps {
  message: string
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 text-white">
      <AlertCircle size={48} className="mb-4 text-red-400" />
      <h3 className="text-xl font-semibold mb-2">Error</h3>
      <p className="text-center max-w-md mb-4">{message}</p>
      <p className="text-center mb-6">
        Please try searching for a different location or check your internet connection.
      </p>
      <Button onClick={handleRefresh} variant="outline" className="bg-white/20 text-white hover:bg-white/30">
        Refresh Page
      </Button>
    </div>
  )
}
