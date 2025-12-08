"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import type { Location } from "@/lib/types/location"
import { formatLocation } from "@/lib/types/location"
import { searchLocations } from "@/lib/utils/location"

interface LocationInputProps {
  value: Location | null
  onChange: (location: Location | null) => void
  placeholder?: string
  required?: boolean
}

export default function LocationInput({
  value,
  onChange,
  placeholder = "Search for a city...",
  required = false,
}: LocationInputProps) {
  const [query, setQuery] = useState(value ? formatLocation(value) : "")
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      setQuery(formatLocation(value))
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    if (newQuery.trim().length > 0) {
      const results = searchLocations(newQuery)
      setSuggestions(results)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      onChange(null)
    }
  }

  const handleSelect = (location: Location) => {
    setQuery(formatLocation(location))
    onChange(location)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[selectedIndex])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Delay to allow click on suggestion to register
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false)
        // If query doesn't match selected value, reset
        if (value && query !== formatLocation(value)) {
          setQuery(value ? formatLocation(value) : "")
        }
      }
    }, 200)
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.trim().length > 0 && suggestions.length > 0) {
            setShowSuggestions(true)
          }
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((location, index) => (
            <button
              key={`${location.city}-${location.country}`}
              type="button"
              onClick={() => handleSelect(location)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                index === selectedIndex ? "bg-muted" : ""
              }`}
            >
              {formatLocation(location)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

