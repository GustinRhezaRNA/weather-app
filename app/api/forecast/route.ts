import { NextResponse } from "next/server"

//ga beda jauh sama weather cuma ini forecast/prediksi cuaca

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // Mengambil data kota
  const city = searchParams.get("city")
  // Mengambil data latitude (garis lintang)
  const lat = searchParams.get("lat")
  // Mengambil data longitude (garis bujur)
  const lon = searchParams.get("lon")

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  if (!API_KEY) {
    return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
  }

  let url: string

  if (city) {
    // City-based query
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  } else if (lat && lon) {
    // Coordinates-based query
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
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
    console.error("Error fetching forecast data:", error)
    return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
  }
}
