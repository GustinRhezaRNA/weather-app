"use client"

import { useEffect, useState } from "react"
import { Search } from "@/components/search"
import { CurrentWeather } from "@/components/current-weather"
import { Forecast } from "@/components/forecast"
import { WeatherBackground } from "@/components/weather-background"
import { useWeather } from "@/hooks/use-weather"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorDisplay } from "@/components/error-display"
import { WelcomeMessage } from "@/components/welcome-message"

export function ClientWrapper() {
  const [searchQuery, setSearchQuery] = useState("")
  const { currentWeather, forecast, loading, error, fetchWeatherByCity, fetchWeatherByCoords, isApiKeyAvailable } =
    useWeather()
  const [initialLoad, setInitialLoad] = useState(true)
  const [fetchAttempts, setFetchAttempts] = useState(0)

  // List of default cities to try if geolocation fails
  const defaultCities = ["Jakarta", "Singapore", "London", "New York", "Tokyo"]

  useEffect(() => {
    // Function to try fetching weather for multiple cities
    const tryDefaultCities = async () => {
      // Try each city in the list until one works
      for (const city of defaultCities) {
        try {
          console.log(`Trying to fetch weather for ${city}...`)
          const result = await fetchWeatherByCity(city)
          if (result) {
            console.log(`Successfully fetched weather for ${city}`)
            return true
          }
        } catch (cityError) {
          console.log(`Failed to fetch weather for ${city}:`, cityError)
        }
      }
      return false
    }

    // Main function to get user location or use defaults
    const getUserLocation = async () => {
      try {
        // If we've already tried 3 times, stop trying to avoid infinite loops
        if (fetchAttempts >= 3) {
          console.log("Maximum fetch attempts reached, stopping")
          setInitialLoad(false)
          return
        }

        setFetchAttempts((prev) => prev + 1)

        // Check if geolocation is available
        if (typeof window !== "undefined" && navigator.geolocation) {
          try {
            // Set a timeout for geolocation request
            const locationPromise = new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                maximumAge: 0,
              })
            })

            // Race the location promise against a timeout
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error("Geolocation request timed out")), 5000)
            })

            try {
              // Try to get position with timeout
              const position = await Promise.race([locationPromise, timeoutPromise])
              const result = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude)
              if (!result) {
                throw new Error("Failed to fetch weather by coordinates")
              }
            } catch (locationError) {
              console.log("Using default cities due to location error:", locationError)
              await tryDefaultCities()
            }
          } catch (geoError) {
            console.log("Geolocation error:", geoError)
            await tryDefaultCities()
          }
        } else {
          // Geolocation not supported
          console.log("Geolocation not supported by browser")
          await tryDefaultCities()
        }
      } catch (error) {
        console.error("Error in getUserLocation:", error)
      } finally {
        setInitialLoad(false)
      }
    }

    getUserLocation()
  }, [fetchWeatherByCoords, fetchWeatherByCity, defaultCities, fetchAttempts])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      fetchWeatherByCity(query)
    }
  }

  // Show API key error if needed
  if (!isApiKeyAvailable) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <WeatherBackground weatherCondition="Clear" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-md">Weather App</h1>
          <div className="bg-red-500/70 backdrop-blur-md p-6 rounded-lg text-white max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">API Key Error</h2>
            <p>The OpenWeather API key is missing or invalid. Please check your environment variables.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {currentWeather && <WeatherBackground weatherCondition={currentWeather.weather[0].main} />}
      {!currentWeather && <WeatherBackground weatherCondition="Clear" />}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-md">Weather App</h1>

        <Search onSearch={handleSearch} />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : initialLoad ? (
          <WelcomeMessage />
        ) : (
          <>
            {currentWeather && <CurrentWeather data={currentWeather} />}
            {forecast && <Forecast data={forecast} />}
          </>
        )}
      </div>
    </main>
  )
}
