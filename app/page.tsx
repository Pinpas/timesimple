"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Globe, ChevronDown, Check, Search } from "lucide-react"
import Link from "next/link"
import { Nunito } from 'next/font/google'
import './globals.css'
import Head from "next/head"

// I'm using the Nunito font for a clean, modern look
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

// Here's a list of timezones I want to support. I've chosen major cities 
// from different parts of the world to give users a good range of options.
const timezones = [
  { name: "UTC", city: "UTC" },
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

// I've created a bunch of color themes. Each theme has a name and three colors:
// The first color is for highlights, the second for backgrounds, and the third for text.
const themes = [
  { name: "worldly dark", colors: ["#e2b714", "#323437", "#646669"] },
  { name: "moon dark", colors: ["#d79921", "#282828", "#a89984"] },
  { name: "spatula", colors: ["#ff79c6", "#282a36", "#f8f8f2"] },
  { name: "frog pond", colors: ["#50fa7b", "#285943", "#77ab59"] },
  { name: "lion's mane", colors: ["#ffb86c", "#4a3f35", "#d0a85c"] },
  { name: "skyscraper", colors: ["#5555ff", "#1e2a3a", "#a0b9d9"] },
  { name: "rainy day", colors: ["#8be9fd", "#44475a", "#6272a4"] },
  { name: "fluffy cloud", colors: ["#f8f8f2", "#b8c0c2", "#6272a4"] },
  { name: "loyal dog", colors: ["#bd93f9", "#3b4252", "#81a1c1"] },
  { name: "curious cat", colors: ["#ff79c6", "#282a36", "#f8f8f2"] },
  { name: "playful dolphin", colors: ["#8be9fd", "#0b2447", "#576cbc"] },
  { name: "local cafe", colors: ["#ffb86c", "#3c3836", "#a89984"] },
  { name: "timezone traveler", colors: ["#50fa7b", "#282a36", "#6272a4"] },
  { name: "desert oasis", colors: ["#f1fa8c", "#5b4636", "#d79921"] },
  { name: "arctic chill", colors: ["#8be9fd", "#2e3440", "#eceff4"] },
  { name: "lava lamp", colors: ["#ff5555", "#282a36", "#ff79c6"] },
  { name: "forest canopy", colors: ["#50fa7b", "#2d3436", "#55efc4"] },
  { name: "ocean depths", colors: ["#8be9fd", "#0c2461", "#4a69bd"] },
  { name: "neon nights", colors: ["#ff79c6", "#170055", "#9d0191"] },
  { name: "pastel dream", colors: ["#ffb8d1", "#c8d6e5", "#8395a7"] },
  { name: "retro gaming", colors: ["#50fa7b", "#121212", "#ff5555"] },
]

// This interface defines the structure of the response I expect from the time API
interface TimeApiResponse {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  dateTime: string;
  timeZone: string;
}

// This is a simple SVG logo component. I'm using it in the navbar.
// It takes primary and secondary colors as props to match the current theme.
const Logo = ({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6V12L16 14" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// This component dynamically updates the favicon based on the current theme.
// It's a neat little touch that makes the site feel more cohesive.
const DynamicFavicon = ({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) => {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Draw the circle
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, 2 * Math.PI);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw the clock hands
      ctx.beginPath();
      ctx.moveTo(16, 16);
      ctx.lineTo(16, 8);
      ctx.moveTo(16, 16);
      ctx.lineTo(22, 18);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update favicon
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = canvas.toDataURL("image/x-icon");
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [primaryColor, secondaryColor]);

  return null;
};

export default function Component() {
  // Here are all the state variables I'm using to manage the app's behavior
  const [timeData, setTimeData] = useState<TimeApiResponse | null>(null)
  const [is24Hour, setIs24Hour] = useState(true)
  const [timezone, setTimezone] = useState(() => {
    // I'm setting the initial timezone to the user's local timezone
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  })
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTheme, setCurrentTheme] = useState(themes[0])

  // These refs help me manage the dropdown menus
  const timezoneDropdownRef = useRef<HTMLDivElement>(null)
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const initialFetchDone = useRef(false)

  // This function fetches the current time for a given timezone from an API
  const fetchTime = useCallback(async (tz: string) => {
    try {
      const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(tz)}`);
      const data: TimeApiResponse = await response.json();
      setTimeData(data);
    } catch (error) {
      console.error("Failed to fetch time:", error);
      // If the API call fails, I fall back to using the system time
      const now = new Date();
      setTimeData({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        seconds: now.getSeconds(),
        dateTime: now.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  }, []);

  // This effect handles time updates and outside clicks for dropdowns
  useEffect(() => {
    // Fetch time immediately on mount or timezone change
    fetchTime(timezone);

    // I'm using two intervals here:
    // 1. A fast interval to update seconds locally
    const fastInterval = setInterval(() => {
      setTimeData(prevTimeData => {
        if (!prevTimeData) return null;
        
        let { year, month, day, hour, minute, seconds } = prevTimeData;
        seconds++;
        
        // Handle rollovers for seconds, minutes, and hours
        if (seconds >= 60) {
          seconds = 0;
          minute++;
          if (minute >= 60) {
            minute = 0;
            hour++;
            if (hour >= 24) {
              hour = 0;
              // I'm not handling day/month/year rollovers here
              // The API call will correct this soon
            }
          }
        }
        
        return { ...prevTimeData, hour, minute, seconds };
      });
    }, 1000);

    // 2. A slower interval to fetch time from API
    const slowInterval = setInterval(() => {
      fetchTime(timezone);
    }, 30000); // Fetch every 30 seconds

    // This function closes the dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target as Node)) {
        setIsTimezoneDropdownOpen(false)
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup function to clear intervals and remove event listener
    return () => {
      clearInterval(fastInterval);
      clearInterval(slowInterval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchTime, timezone]);

  // This effect updates the favicon when the theme changes
  useEffect(() => {
    // This effect will run when the theme changes
    const updateFavicon = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Draw the circle
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, 2 * Math.PI);
        ctx.strokeStyle = currentTheme.colors[2];
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw the clock hands
        ctx.beginPath();
        ctx.moveTo(16, 16);
        ctx.lineTo(16, 8);
        ctx.moveTo(16, 16);
        ctx.lineTo(22, 18);
        ctx.strokeStyle = currentTheme.colors[0];
        ctx.lineWidth = 2;
        ctx.stroke();

        // Update favicon
        const faviconUrl = canvas.toDataURL("image/x-icon");
        
        // Remove existing favicon
        const existingFavicon = document.querySelector("link[rel*='icon']");
        if (existingFavicon) {
          document.head.removeChild(existingFavicon);
        }

        // Create and add new favicon
        const link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = faviconUrl;
        document.head.appendChild(link);

        // Force favicon refresh
        const faviconTag = document.createElement('link');
        faviconTag.rel = 'shortcut icon';
        faviconTag.href = 'data:image/x-icon;,';
        document.head.appendChild(faviconTag);
        document.head.removeChild(faviconTag);
      }
    };

    // Update favicon immediately
    updateFavicon();

    // Update favicon again after a short delay
    const timeoutId = setTimeout(updateFavicon, 100);

    return () => clearTimeout(timeoutId);
  }, [currentTheme]);

  // This function handles timezone changes
  const handleTimezoneChange = useCallback((newTimezone: string) => {
    setTimezone(newTimezone);
    setIsTimezoneDropdownOpen(false);
    fetchTime(newTimezone);
  }, [fetchTime]);

  // These functions format the time and date for display
  const formatTime = () => {
    if (!timeData) return '';
    const { hour, minute, seconds } = timeData;
    const formattedSeconds = Math.min(59, Math.max(0, seconds)).toString().padStart(2, '0');
    if (is24Hour) {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${formattedSeconds}`;
    } else {
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${formattedSeconds} ${period}`;
    }
  }

  const formatDate = () => {
    if (!timeData) return '';
    const { year, month, day } = timeData;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // I'm sorting the timezones alphabetically by city name
  const sortedTimezones = useMemo(() => {
    return [...timezones].sort((a, b) => a.city.localeCompare(b.city));
  }, []);

  // These filtered arrays are used for the search functionality in dropdowns
  const filteredTimezones = sortedTimezones.filter(tz =>
    tz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tz.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // These styles make the scrollbars match the current theme
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

  // The main render function
  return (
    <div className={`flex flex-col items-center min-h-screen bg-[#323437] text-[#646669] ${nunito.className}`} style={{ backgroundColor: currentTheme.colors[1], color: currentTheme.colors[2] }}>
      {/* Navbar */}
      <nav className="w-full py-4 flex justify-center items-center">
        <div className="flex items-center">
          <Logo primaryColor={currentTheme.colors[2]} secondaryColor={currentTheme.colors[0]} />
          <span className="text-2xl font-bold ml-2" style={{ color: currentTheme.colors[0] }}>TimeSimple</span>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        {/* Timezone dropdown */}
        <div className="relative mb-4 w-full max-w-xs" ref={timezoneDropdownRef}>
          <button
            onClick={() => setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
            className="flex items-center justify-center space-x-2 text-xl font-bold focus:outline-none hover:text-[#e2b714] transition-colors w-full"
            style={{ color: currentTheme.colors[2] }}
          >
            <Globe size={24} />
            <span className="truncate">{timezones.find(tz => tz.name === timezone)?.city || timezone}</span>
            <ChevronDown size={24} />
          </button>
          {isTimezoneDropdownOpen && (
            <div className="absolute mt-2 w-full bg-[#2c2e31] rounded-md shadow-lg z-10" style={{ backgroundColor: currentTheme.colors[1] }}>
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
                    {timezone === tz.name && <Check size={16} style={{ color: currentTheme.colors[0] }} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Time display */}
        <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4 text-center" style={{ color: currentTheme.colors[0] }}>
          {timeData ? formatTime() : ''}
        </div>
        {/* Date display */}
        <div className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
          {timeData ? formatDate() : ''}
        </div>
      </div>
      {/* Footer */}
      <div className="w-full">
        {/* 24-hour/AM-PM toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className="text-lg sm:text-xl font-bold hover:text-[#e2b714] transition-colors"
            style={{ color: currentTheme.colors[2] }}
          >
            {is24Hour ? "Switch to AM/PM" : "Switch to 24-hour"}
          </button>
        </div>
        <footer className="w-full py-2 px-4 text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">

              <Link 
                href="https://x.com/Hugotions" 
                className="hover:text-[#e2b714] transition-colors" 
                style={{ color: currentTheme.colors[2] }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                twitter
              </Link>
              <Link 
                href="https://github.com/Pinpas" 
                className="hover:text-[#e2b714] transition-colors" 
                style={{ color: currentTheme.colors[2] }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                github
              </Link>
            </div>
            <div className="flex items-center space-x-4 relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="hover:text-[#e2b714] transition-colors focus:outline-none"
                style={{ color: currentTheme.colors[2] }}
              >
                {currentTheme.name}
              </button>
              <span>v0.0.1</span>
              {isThemeDropdownOpen && (
                <div className="absolute sm:bottom-full sm:right-0 bottom-[100%] left-1/2 sm:left-auto transform -translate-x-1/2 sm:translate-x-0 mb-2 w-64 bg-[#2c2e31] rounded-md shadow-lg z-10" style={{ backgroundColor: currentTheme.colors[1] }}>
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
                  <div className="max-h-80 overflow-y-auto" style={scrollbarStyles}>
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
                        <span className="flex items-center">
                          {theme.name}
                          {currentTheme.name === theme.name && (
                            <Check size={16} className="ml-2" style={{ color: currentTheme.colors[0] }} />
                          )}
                        </span>
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