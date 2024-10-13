"use client"

import { useState, useEffect, useRef } from "react"
import { Globe, ChevronDown, Check, Search } from "lucide-react"
import Link from "next/link"
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

const timezones = [
  { name: "UTC", city: "Coordinated Universal Time" },
  { name: "Europe/London", city: "London" },
  { name: "Europe/Paris", city: "Paris" },
  { name: "Europe/Amsterdam", city: "Amsterdam" },
  { name: "Africa/Cairo", city: "Cairo" },
  { name: "Europe/Moscow", city: "Moscow" },
  { name: "Asia/Dubai", city: "Dubai" },
  { name: "Asia/Kolkata", city: "Mumbai" },
  { name: "Asia/Shanghai", city: "Shanghai" },
  { name: "Asia/Singapore", city: "Singapore" },
  { name: "Asia/Tokyo", city: "Tokyo" },
  { name: "Asia/Seoul", city: "Seoul" },
  { name: "Australia/Sydney", city: "Sydney" },
  { name: "Pacific/Auckland", city: "Auckland" },
  { name: "America/Los_Angeles", city: "Los Angeles" },
  { name: "America/New_York", city: "New York" },
  { name: "America/Toronto", city: "Toronto" },
  { name: "America/Mexico_City", city: "Mexico City" },
  { name: "America/Sao_Paulo", city: "São Paulo" },
  { name: "Africa/Johannesburg", city: "Johannesburg" },
]

const themes = [
  { name: "worldly dark", colors: ["#e2b714", "#323437", "#646669"] },
  { name: "moon dark", colors: ["#d79921", "#282828", "#a89984"] },
  { name: "spatula", colors: ["#ff79c6", "#282a36", "#f8f8f2"] },
]

interface WorldTimeApiResponse {
  datetime: string;
  timezone: string;
}

export default function Component() {
  const [time, setTime] = useState<Date | null>(null)
  const [is24Hour, setIs24Hour] = useState(true)
  const [timezone, setTimezone] = useState("UTC")
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTheme, setCurrentTheme] = useState(themes[0])
  const [localTimezone, setLocalTimezone] = useState("")

  const timezoneDropdownRef = useRef<HTMLDivElement>(null)
  const themeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
        const data: WorldTimeApiResponse = await response.json();
        setTime(new Date(data.datetime));
      } catch (error) {
        console.error("Failed to fetch time:", error);
        setTime(new Date()); // Fallback to system time
      }
    };

    fetchTime();
    const timer = setInterval(fetchTime, 1000);

    const handleClickOutside = (event: MouseEvent) => {
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target as Node)) {
        setIsTimezoneDropdownOpen(false)
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    // Get the local timezone
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setLocalTimezone(localTz)
    setTimezone(localTz) // Set the initial timezone to the local timezone

    return () => {
      clearInterval(timer)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [timezone])

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24Hour,
      timeZone: timezone,
    }
    return new Intl.DateTimeFormat("en-US", options).format(date)
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: timezone,
    }
    return new Intl.DateTimeFormat("en-US", options).format(date)
  }

  const getTimezoneOffset = (tz: string) => {
    const now = new Date()
    const tzTime = new Date(now.toLocaleString("en-US", { timeZone: tz }))
    const utcTime = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }))
    const diffHours = (tzTime.getTime() - utcTime.getTime()) / 3600000
    const sign = diffHours >= 0 ? "+" : "-"
    return `${sign}${Math.abs(Math.round(diffHours))}H`
  }

  const sortedTimezones = [...timezones].sort((a, b) => {
    const offsetA = getTimezoneOffset(a.name)
    const offsetB = getTimezoneOffset(b.name)
    return parseInt(offsetA) - parseInt(offsetB)
  })

  const filteredTimezones = sortedTimezones.filter(tz =>
    tz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tz.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const scrollbarStyles = {
    // Webkit browsers like Chrome, Safari
    '::-webkit-scrollbar': {
      width: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: currentTheme.colors[1],
    },
    '::-webkit-scrollbar-thumb': {
      background: currentTheme.colors[2],
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: currentTheme.colors[0],
    },
    // Firefox
    scrollbarWidth: 'thin',
    scrollbarColor: `${currentTheme.colors[2]} ${currentTheme.colors[1]}`,
  } as const;

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
    setIsTimezoneDropdownOpen(false);
  };

  return (
    <div className={`flex flex-col items-center justify-between min-h-screen bg-[#323437] text-[#646669] ${nunito.className}`} style={{ backgroundColor: currentTheme.colors[1], color: currentTheme.colors[2] }}>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative mb-2" ref={timezoneDropdownRef}>
          <button
            onClick={() => setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
            className="flex items-center space-x-2 text-xl font-bold focus:outline-none hover:text-[#e2b714] transition-colors"
            style={{ color: currentTheme.colors[2] }}
          >
            <Globe size={24} />
            <span>{timezones.find(tz => tz.name === timezone)?.city || timezone}</span>
            <ChevronDown size={24} />
          </button>
          {isTimezoneDropdownOpen && (
            <div className="absolute mt-2 w-80 bg-[#2c2e31] rounded-md shadow-lg z-10" style={{ backgroundColor: currentTheme.colors[1] }}>
              <div className="flex items-center p-2 bg-[#232528]" style={{ backgroundColor: currentTheme.colors[1] }}>
                <Search size={20} className="mr-2" style={{ color: currentTheme.colors[2] }} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent text-[#e2b714] placeholder-[#646669] focus:outline-none"
                  style={{ color: currentTheme.colors[0] }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto" style={scrollbarStyles}>
                {filteredTimezones.map((tz) => (
                  <button
                    key={tz.name}
                    className="w-full text-left px-4 py-2 hover:bg-[#232528] flex items-center justify-between"
                    style={{ color: currentTheme.colors[2], backgroundColor: currentTheme.colors[1] }}
                    onClick={() => handleTimezoneChange(tz.name)}
                  >
                    <span>{tz.city}</span>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">{getTimezoneOffset(tz.name)}</span>
                      {timezone === tz.name && <Check size={16} style={{ color: currentTheme.colors[0] }} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="text-9xl font-bold mb-4" style={{ color: currentTheme.colors[0] }}>
          {time ? formatTime(time) : ''}
        </div>
        <div className="text-2xl font-light mb-2">
          {time ? formatDate(time) : ''}
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className="text-xl font-bold hover:text-[#e2b714] transition-colors"
            style={{ color: currentTheme.colors[2] }}
          >
            {is24Hour ? "24 hour clock" : "am/pm"}
          </button>
        </div>
        <footer className="w-full py-2 px-4 text-xs">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-[#e2b714] transition-colors" style={{ color: currentTheme.colors[2] }}>contact</Link>
              <Link href="#" className="hover:text-[#e2b714] transition-colors" style={{ color: currentTheme.colors[2] }}>support</Link>
              <Link href="#" className="hover:text-[#e2b714] transition-colors" style={{ color: currentTheme.colors[2] }}>github</Link>
              <Link href="#" className="hover:text-[#e2b714] transition-colors" style={{ color: currentTheme.colors[2] }}>discord</Link>
              <Link href="#" className="hover:text-[#e2b714] transition-colors" style={{ color: currentTheme.colors[2] }}>twitter</Link>
              <Link href="#" className="hover:text-[#e2b714] transition-colors" style={{ color: currentTheme.colors[2] }}>terms</Link>
              <Link href="#" className="hover:text-[#e2b714] transition-colors" style={{ color: currentTheme.colors[2] }}>security</Link>
              <Link href="#" className="hover:text-[#e2b714] transition-colors" style={{ color: currentTheme.colors[2] }}>privacy</Link>
            </div>
            <div className="flex items-center space-x-4 relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="hover:text-[#e2b714] transition-colors focus:outline-none"
                style={{ color: currentTheme.colors[2] }}
              >
                {currentTheme.name}
              </button>
              <span>v1.0.0</span>
              {isThemeDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#2c2e31] rounded-md shadow-lg z-10" style={{ backgroundColor: currentTheme.colors[1] }}>
                  <div className="flex items-center p-2 bg-[#232528]" style={{ backgroundColor: currentTheme.colors[1] }}>
                    <Search size={20} className="mr-2" style={{ color: currentTheme.colors[2] }} />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full bg-transparent text-[#e2b714] placeholder-[#646669] focus:outline-none"
                      style={{ color: currentTheme.colors[0] }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto" style={scrollbarStyles}>
                    {filteredThemes.map((theme) => (
                      <button
                        key={theme.name}
                        className="w-full text-left px-4 py-2 hover:bg-[#232528] flex items-center justify-between"
                        style={{ color: currentTheme.colors[2], backgroundColor: currentTheme.colors[1] }}
                        onClick={() => {
                          setCurrentTheme(theme)
                          setIsThemeDropdownOpen(false)
                        }}
                      >
                        <span>{theme.name}</span>
                        <div className="flex space-x-1">
                          {theme.colors.map((color, index) => (
                            <div key={index} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}