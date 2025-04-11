"use client"

import { useState, type FormEvent } from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchProps {
  onSearch: (query: string) => void
}

export function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 max-w-md mx-auto">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white/20 backdrop-blur-md text-white placeholder:text-white/70 border-white/30"
        />
        <Button
          type="submit"
          variant="outline"
          className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
        >
          <SearchIcon size={18} />
        </Button>
      </div>
    </form>
  )
}
