import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  //mengambil data kota
  const city = searchParams.get("city")
  //mengambil data latitude(garis lintang)
  const lat = searchParams.get("lat")
  //mengambil data longitude(garis bujur)
  const lon = searchParams.get("lon")

  //mengambil API key dari env
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  if (!API_KEY) {
    return NextResponse.json({ error: "API key belum dikonfgurasi" }, { status: 500 })
  }

  //url untuk mengambil data dari openweathermap
  let url: string

  if (city) {
    // City-based query
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  } else if (lat && lon) {
    // Coordinates-based query
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  } else {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || `API error (${response.status})` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
