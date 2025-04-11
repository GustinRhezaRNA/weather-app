import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudDrizzle, type LucideIcon } from "lucide-react"

export function getWeatherIcon(condition: string): LucideIcon {
  switch (condition.toLowerCase()) {
    case "clear":
      return Sun
    case "clouds":
      return Cloud
    case "rain":
      return CloudRain
    case "drizzle":
      return CloudDrizzle
    case "thunderstorm":
      return CloudLightning
    case "snow":
      return CloudSnow
    case "mist":
    case "fog":
    case "haze":
      return CloudFog
    default:
      return Cloud
  }
}
