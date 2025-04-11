"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ForecastData } from "@/hooks/use-weather"
import { getWeatherIcon } from "@/lib/weather-icons"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useEffect, useState } from "react"

interface ForecastProps {
  data: ForecastData
}

export function Forecast({ data }: ForecastProps) {
  // Use state for processed data to avoid hydration mismatches
  const [chartData, setChartData] = useState<any[]>([])
  const [dailyForecast, setDailyForecast] = useState<any[]>([])

  // Process data on the client side only
  useEffect(() => {
    // Process data for the chart
    const processedChartData = data.list.slice(0, 7).map((item) => {
      const date = new Date(item.dt * 1000)
      return {
        time: `${date.getHours()}:00`,
        temperature: Math.round(item.main.temp),
        humidity: item.main.humidity,
      }
    })

    setChartData(processedChartData)

    // Group forecast data by day
    const dailyData: Record<string, any> = {}

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000)
      const day = date.toLocaleDateString("id-ID", { weekday: "long" })

      if (!dailyData[day] || date.getHours() > 12) {
        dailyData[day] = {
          date: date,
          temp: Math.round(item.main.temp),
          weather: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        }
      }
    })

    // Convert to array and limit to 7 days
    setDailyForecast(Object.values(dailyData).slice(0, 7))
  }, [data])

  return (
    <div className="space-y-8">
      <Card className="bg-white/20 backdrop-blur-md text-white border-white/30">
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
            {dailyForecast.map((day, index) => {
              const WeatherIcon = getWeatherIcon(day.weather)
              return (
                <div key={index} className="flex flex-col items-center p-2 rounded-lg bg-white/10">
                  <p className="font-medium">{day.date.toLocaleDateString("id-ID", { weekday: "short" })}</p>
                  <WeatherIcon size={36} className="my-2" />
                  <p className="text-xl font-bold">{day.temp}°C</p>
                  <p className="text-xs text-center capitalize">{day.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/20 backdrop-blur-md text-white border-white/30">
        <CardHeader>
          <CardTitle>Temperature & Humidity Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
                  <YAxis
                    yAxisId="left"
                    stroke="rgba(255,255,255,0.7)"
                    domain={["dataMin - 5", "dataMax + 5"]}
                    label={{ value: "°C", position: "insideLeft", angle: -90, dy: 50, fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="rgba(255,255,255,0.7)"
                    domain={[0, 100]}
                    label={{ value: "%", position: "insideRight", angle: -90, dy: 50, fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#FF9500"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Temperature (°C)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#00C6FF"
                    strokeWidth={2}
                    name="Humidity (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
