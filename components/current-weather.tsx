"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Sunrise, Sunset, Clock } from "lucide-react"
import type { CurrentWeatherData } from "@/hooks/use-weather"
import { getWeatherIcon } from "@/lib/weather-icons"
import { useEffect, useState } from "react"

interface CurrentWeatherProps {
  data: CurrentWeatherData
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const WeatherIcon = getWeatherIcon(data.weather[0].main)

  // Use state for formatted dates to avoid hydration mismatches
  const [formattedDate, setFormattedDate] = useState<string>("")
  const [formattedTime, setFormattedTime] = useState<string>("")
  const [sunriseTime, setSunriseTime] = useState<string>("")
  const [sunsetTime, setSunsetTime] = useState<string>("")

  // Format dates on the client side only
  useEffect(() => {
    const date = new Date(data.dt * 1000)

    setFormattedDate(
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date),
    )

    setFormattedTime(
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
    )

    setSunriseTime(
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(data.sys.sunrise * 1000)),
    )

    setSunsetTime(
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(data.sys.sunset * 1000)),
    )
  }, [data.dt, data.sys.sunrise, data.sys.sunset])

  return (
    <Card className="mb-8 bg-white/20 backdrop-blur-md text-white border-white/30">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold">
              {data.name}, {data.sys.country}
            </h2>
            <div className="flex items-center mt-1">
              <Clock size={16} className="mr-1" />
              <p>
                {formattedDate || "Loading..."} | {formattedTime || "Loading..."}
              </p>
            </div>
            <p className="text-xl mt-2 capitalize">{data.weather[0].description}</p>
          </div>

          <div className="flex items-center">
            <WeatherIcon size={64} className="mr-4" />
            <div className="text-center">
              <p className="text-5xl font-bold">{Math.round(data.main.temp)}°C</p>
              <p className="text-sm">Feels like: {Math.round(data.main.feels_like)}°C</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center">
            <Thermometer size={20} className="mr-2" />
            <div>
              <p className="text-sm">Pressure</p>
              <p className="font-semibold">{data.main.pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center">
            <Droplets size={20} className="mr-2" />
            <div>
              <p className="text-sm">Humidity</p>
              <p className="font-semibold">{data.main.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center">
            <Wind size={20} className="mr-2" />
            <div>
              <p className="text-sm">Wind Speed</p>
              <p className="font-semibold">{data.wind.speed} m/s</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex space-x-2">
              <Sunrise size={20} />
              <Sunset size={20} />
            </div>
            <div className="ml-2">
              <p className="text-sm">Sun</p>
              <p className="font-semibold">
                {sunriseTime || "Loading..."} / {sunsetTime || "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
