"use client"

import { useState, useCallback } from "react"

// Types for OpenWeather API responses
export interface CurrentWeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  dt: number
}

export interface ForecastData {
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      humidity: number
    }
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    wind: {
      speed: number
    }
    dt_txt: string
  }>
  city: {
    name: string
    country: string
  }
}

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  const isApiKeyAvailable = !!API_KEY

  // Update to use our API routes
  const fetchWeatherByCity = useCallback(async (city: string) => {
    if (!city) return null

    setLoading(true)
    setError(null)

    try {
      // Use our API route instead of calling OpenWeather directly
      const encodedCity = encodeURIComponent(city)

      // Fetch current weather
      const currentWeatherResponse = await fetch(`/api/weather?city=${encodedCity}`)

      if (!currentWeatherResponse.ok) {
        const errorData = await currentWeatherResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `City not found or API error (${currentWeatherResponse.status})`)
      }

      const currentWeatherData = await currentWeatherResponse.json()
      setCurrentWeather(currentWeatherData)

      // Fetch forecast
      const forecastResponse = await fetch(`/api/forecast?city=${encodedCity}`)

      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Forecast data not available (${forecastResponse.status})`)
      }

      const forecastData = await forecastResponse.json()
      setForecast(forecastData)

      return { currentWeatherData, forecastData }
    } catch (err) {
      console.error("Error fetching weather data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Update to use our API routes
  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)

    try {
      // Use our API route instead of calling OpenWeather directly

      // Fetch current weather
      const currentWeatherResponse = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)

      if (!currentWeatherResponse.ok) {
        const errorData = await currentWeatherResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Location not found or API error (${currentWeatherResponse.status})`)
      }

      const currentWeatherData = await currentWeatherResponse.json()
      setCurrentWeather(currentWeatherData)

      // Fetch forecast
      const forecastResponse = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`)

      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Forecast data not available (${forecastResponse.status})`)
      }

      const forecastData = await forecastResponse.json()
      setForecast(forecastData)

      return { currentWeatherData, forecastData }
    } catch (err) {
      console.error("Error fetching weather data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    currentWeather,
    forecast,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    isApiKeyAvailable,
  }
}
