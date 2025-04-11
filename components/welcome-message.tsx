"use client"

import { Button } from "@/components/ui/button"

export function WelcomeMessage() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="text-center py-10 text-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome to Weather App</h2>
      <p className="mb-4">We're trying to load weather information for your location or a default city.</p>
      <p className="mb-6">If no data appears, please use the search box above to find weather for any city.</p>
      <Button onClick={handleRefresh} variant="outline" className="bg-white/20 text-white hover:bg-white/30">
        Refresh Page
      </Button>
    </div>
  )
}
