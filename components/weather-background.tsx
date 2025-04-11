"use client"

interface WeatherBackgroundProps {
  weatherCondition: string
}

export function WeatherBackground({ weatherCondition }: WeatherBackgroundProps) {
  // Define background gradients based on weather conditions
  const getBackgroundStyle = () => {
    switch (weatherCondition.toLowerCase()) {
      case "clear":
        return "bg-gradient-to-b from-blue-400 to-blue-700" // Sunny sky
      case "clouds":
        return "bg-gradient-to-b from-gray-300 to-gray-600" // Cloudy sky
      case "rain":
      case "drizzle":
        return "bg-gradient-to-b from-gray-600 to-gray-900" // Rainy sky
      case "thunderstorm":
        return "bg-gradient-to-b from-gray-800 to-gray-950" // Stormy sky
      case "snow":
        return "bg-gradient-to-b from-blue-100 to-blue-300" // Snowy sky
      case "mist":
      case "fog":
      case "haze":
        return "bg-gradient-to-b from-gray-400 to-gray-700" // Misty sky
      default:
        return "bg-gradient-to-b from-blue-500 to-blue-800" // Default sky
    }
  }

  return <div className={`absolute inset-0 w-full h-full ${getBackgroundStyle()} transition-colors duration-1000`} />
}
