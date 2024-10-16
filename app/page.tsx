"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Globe, ChevronDown, Check, Search } from "lucide-react"
import Link from "next/link"
import { Nunito } from 'next/font/google'
import './globals.css'

// I'm using the Nunito font for a clean, modern look
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

// Here's a list of timezones I want to support. I've chosen major cities 
// from different parts of the world to give users a good range of options.
const timezones = [
  { name: "UTC", city: "UTC", offset: "+00:00" },
  { name: "Europe/London", city: "London", offset: "+00:00" },
  { name: "Europe/Dublin", city: "Dublin", offset: "+00:00" },
  { name: "Europe/Lisbon", city: "Lisbon", offset: "+00:00" },
  { name: "Europe/Paris", city: "Paris", offset: "+01:00" },
  { name: "Europe/Berlin", city: "Berlin", offset: "+01:00" },
  { name: "Europe/Rome", city: "Rome", offset: "+01:00" },
  { name: "Europe/Madrid", city: "Madrid", offset: "+01:00" },
  { name: "Europe/Amsterdam", city: "Amsterdam", offset: "+01:00" },
  { name: "Europe/Brussels", city: "Brussels", offset: "+01:00" },
  { name: "Europe/Vienna", city: "Vienna", offset: "+01:00" },
  { name: "Europe/Stockholm", city: "Stockholm", offset: "+01:00" },
  { name: "Europe/Copenhagen", city: "Copenhagen", offset: "+01:00" },
  { name: "Europe/Oslo", city: "Oslo", offset: "+01:00" },
  { name: "Europe/Warsaw", city: "Warsaw", offset: "+01:00" },
  { name: "Europe/Budapest", city: "Budapest", offset: "+01:00" },
  { name: "Europe/Prague", city: "Prague", offset: "+01:00" },
  { name: "Europe/Athens", city: "Athens", offset: "+02:00" },
  { name: "Europe/Bucharest", city: "Bucharest", offset: "+02:00" },
  { name: "Europe/Helsinki", city: "Helsinki", offset: "+02:00" },
  { name: "Europe/Kiev", city: "Kiev", offset: "+02:00" },
  { name: "Europe/Riga", city: "Riga", offset: "+02:00" },
  { name: "Europe/Sofia", city: "Sofia", offset: "+02:00" },
  { name: "Europe/Tallinn", city: "Tallinn", offset: "+02:00" },
  { name: "Europe/Vilnius", city: "Vilnius", offset: "+02:00" },
  { name: "Africa/Cairo", city: "Cairo", offset: "+02:00" },
  { name: "Africa/Johannesburg", city: "Johannesburg", offset: "+02:00" },
  { name: "Africa/Lagos", city: "Lagos", offset: "+01:00" },
  { name: "Africa/Nairobi", city: "Nairobi", offset: "+03:00" },
  { name: "Africa/Casablanca", city: "Casablanca", offset: "+00:00" },
  { name: "Africa/Accra", city: "Accra", offset: "+00:00" },
  { name: "Africa/Addis_Ababa", city: "Addis Ababa", offset: "+03:00" },
  { name: "Europe/Moscow", city: "Moscow", offset: "+03:00" },
  { name: "Europe/Istanbul", city: "Istanbul", offset: "+03:00" },
  { name: "Asia/Dubai", city: "Dubai", offset: "+04:00" },
  { name: "Asia/Tehran", city: "Tehran", offset: "+03:30" },
  { name: "Asia/Baku", city: "Baku", offset: "+04:00" },
  { name: "Asia/Yerevan", city: "Yerevan", offset: "+04:00" },
  { name: "Asia/Kabul", city: "Kabul", offset: "+04:30" },
  { name: "Asia/Karachi", city: "Karachi", offset: "+05:00" },
  { name: "Asia/Tashkent", city: "Tashkent", offset: "+05:00" },
  { name: "Asia/Kolkata", city: "Mumbai", offset: "+05:30" },
  { name: "Asia/Colombo", city: "Colombo", offset: "+05:30" },
  { name: "Asia/Kathmandu", city: "Kathmandu", offset: "+05:45" },
  { name: "Asia/Dhaka", city: "Dhaka", offset: "+06:00" },
  { name: "Asia/Almaty", city: "Almaty", offset: "+06:00" },
  { name: "Asia/Yangon", city: "Yangon", offset: "+06:30" },
  { name: "Asia/Bangkok", city: "Bangkok", offset: "+07:00" },
  { name: "Asia/Jakarta", city: "Jakarta", offset: "+07:00" },
  { name: "Asia/Phnom_Penh", city: "Phnom Penh", offset: "+07:00" },
  { name: "Asia/Ho_Chi_Minh", city: "Ho Chi Minh City", offset: "+07:00" },
  { name: "Asia/Shanghai", city: "Shanghai", offset: "+08:00" },
  { name: "Asia/Singapore", city: "Singapore", offset: "+08:00" },
  { name: "Asia/Hong_Kong", city: "Hong Kong", offset: "+08:00" },
  { name: "Asia/Taipei", city: "Taipei", offset: "+08:00" },
  { name: "Asia/Kuala_Lumpur", city: "Kuala Lumpur", offset: "+08:00" },
  { name: "Asia/Manila", city: "Manila", offset: "+08:00" },
  { name: "Asia/Makassar", city: "Makassar", offset: "+08:00" },
  { name: "Asia/Seoul", city: "Seoul", offset: "+09:00" },
  { name: "Asia/Tokyo", city: "Tokyo", offset: "+09:00" },
  { name: "Asia/Pyongyang", city: "Pyongyang", offset: "+09:00" },
  { name: "Australia/Darwin", city: "Darwin", offset: "+09:30" },
  { name: "Australia/Adelaide", city: "Adelaide", offset: "+09:30" },
  { name: "Australia/Sydney", city: "Sydney", offset: "+10:00" },
  { name: "Australia/Melbourne", city: "Melbourne", offset: "+10:00" },
  { name: "Australia/Brisbane", city: "Brisbane", offset: "+10:00" },
  { name: "Australia/Hobart", city: "Hobart", offset: "+10:00" },
  { name: "Pacific/Port_Moresby", city: "Port Moresby", offset: "+10:00" },
  { name: "Pacific/Guadalcanal", city: "Honiara", offset: "+11:00" },
  { name: "Pacific/Noumea", city: "Noumea", offset: "+11:00" },
  { name: "Pacific/Auckland", city: "Auckland", offset: "+12:00" },
  { name: "Pacific/Fiji", city: "Suva", offset: "+12:00" },
  { name: "Pacific/Tongatapu", city: "Nuku'alofa", offset: "+13:00" },
  { name: "Pacific/Apia", city: "Apia", offset: "+13:00" },
  { name: "Pacific/Kiritimati", city: "Kiritimati", offset: "+14:00" },
  { name: "America/Anchorage", city: "Anchorage", offset: "-09:00" },
  { name: "America/Los_Angeles", city: "Los Angeles", offset: "-08:00" },
  { name: "America/Vancouver", city: "Vancouver", offset: "-08:00" },
  { name: "America/Phoenix", city: "Phoenix", offset: "-07:00" },
  { name: "America/Denver", city: "Denver", offset: "-07:00" },
  { name: "America/Chicago", city: "Chicago", offset: "-06:00" },
  { name: "America/Mexico_City", city: "Mexico City", offset: "-06:00" },
  { name: "America/Regina", city: "Regina", offset: "-06:00" },
  { name: "America/New_York", city: "New York", offset: "-05:00" },
  { name: "America/Toronto", city: "Toronto", offset: "-05:00" },
  { name: "America/Bogota", city: "Bogota", offset: "-05:00" },
  { name: "America/Lima", city: "Lima", offset: "-05:00" },
  { name: "America/Caracas", city: "Caracas", offset: "-04:00" },
  { name: "America/Santiago", city: "Santiago", offset: "-04:00" },
  { name: "America/St_Johns", city: "St. John's", offset: "-03:30" },
  { name: "America/Sao_Paulo", city: "São Paulo", offset: "-03:00" },
  { name: "America/Buenos_Aires", city: "Buenos Aires", offset: "-03:00" },
  { name: "America/Montevideo", city: "Montevideo", offset: "-03:00" },
  { name: "America/Godthab", city: "Nuuk", offset: "-03:00" },
  { name: "America/Noronha", city: "Fernando de Noronha", offset: "-02:00" },
  { name: "Atlantic/Cape_Verde", city: "Praia", offset: "-01:00" },
  { name: "Atlantic/Azores", city: "Ponta Delgada", offset: "-01:00" },
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

// Replace the existing Logo component with this new Canvas-based Logo
const Logo = ({ primaryColor, secondaryColor, currentTime }: { primaryColor: string; secondaryColor: string; currentTime: Date }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawClock = () => {
      ctx.clearRect(0, 0, 40, 40);

      // Draw the circle
      ctx.beginPath();
      ctx.arc(20, 20, 18, 0, 2 * Math.PI);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      const hours = currentTime.getHours() % 12;
      const minutes = currentTime.getMinutes();

      // Calculate angles for hour and minute hands
      const hourAngle = (hours + minutes / 60) * (Math.PI * 2 / 12) - Math.PI / 2;
      const minuteAngle = minutes * (Math.PI * 2 / 60) - Math.PI / 2;

      // Draw hour hand
      ctx.beginPath();
      ctx.lineCap = 'round'; // Add rounded end to the line
      ctx.moveTo(20, 20);
      ctx.lineTo(20 + Math.cos(hourAngle) * 8, 20 + Math.sin(hourAngle) * 8);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw minute hand
      ctx.beginPath();
      ctx.lineCap = 'round'; // Add rounded end to the line
      ctx.moveTo(20, 20);
      ctx.lineTo(20 + Math.cos(minuteAngle) * 12, 20 + Math.sin(minuteAngle) * 12);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    drawClock();

    const intervalId = setInterval(drawClock, 1000);

    return () => clearInterval(intervalId);
  }, [primaryColor, secondaryColor, currentTime]);

  return <canvas ref={canvasRef} width={40} height={40} />;
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

  // Modify the currentTime state to include timezone
  const [currentTime, setCurrentTime] = useState({ time: new Date(), timezone });

  // Update this useEffect to handle both regular updates and timezone changes
  useEffect(() => {
    const updateTime = () => {
      if (timeData) {
        const newTime = new Date(timeData.dateTime);
        setCurrentTime({ time: newTime, timezone });
      }
    };

    // Update immediately when timeData changes (which includes timezone changes)
    updateTime();

    // Set up an interval for regular updates
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [timeData, timezone]);

  // Modify the fetchTime function to update currentTime immediately
  const fetchTime = useCallback(async (tz: string) => {
    try {
      const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(tz)}`);
      const data: TimeApiResponse = await response.json();
      setTimeData(data);
      setCurrentTime({ time: new Date(data.dateTime), timezone: tz });
    } catch (error) {
      console.error("Failed to fetch time:", error);
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
      setCurrentTime({ time: now, timezone: tz });
    }
  }, []);

  // This effect handles time updates and outside clicks for dropdowns
  useEffect(() => {
    // Fetch time immediately on mount or timezone change
    fetchTime(timezone);

    // Set up an interval to fetch time from API every 1 second
    const updateInterval = setInterval(() => {
      fetchTime(timezone);
    }, 1000); // Fetch every 1 second

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

    // Cleanup function to clear interval and remove event listener
    return () => {
      clearInterval(updateInterval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchTime, timezone]);

  // This effect updates the favicon when the theme changes or time updates
  useEffect(() => {
    const updateFavicon = () => {
      if (!timeData) return; // Don't update if we don't have time data

      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Use timeData instead of new Date()
        const hours = timeData.hour % 12;
        const minutes = timeData.minute;

        // Calculate angles for hour and minute hands
        const hourAngle = (hours + minutes / 60) * (Math.PI * 2 / 12) - Math.PI / 2;
        const minuteAngle = minutes * (Math.PI * 2 / 60) - Math.PI / 2;

        // Draw the circle
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, 2 * Math.PI);
        ctx.strokeStyle = currentTheme.colors[2];
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw hour hand
        ctx.beginPath();
        ctx.lineCap = 'round'; // Add rounded end to the line
        ctx.moveTo(16, 16);
        ctx.lineTo(16 + Math.cos(hourAngle) * 7, 16 + Math.sin(hourAngle) * 7);
        ctx.strokeStyle = currentTheme.colors[0];
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw minute hand
        ctx.beginPath();
        ctx.lineCap = 'round'; // Add rounded end to the line
        ctx.moveTo(16, 16);
        ctx.lineTo(16 + Math.cos(minuteAngle) * 9, 16 + Math.sin(minuteAngle) * 9);
        ctx.strokeStyle = currentTheme.colors[0];
        ctx.lineWidth = 3;
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
      }
    };

    // Update favicon immediately if we have time data
    if (timeData) {
      updateFavicon();
    }

    // Set up an interval to update the favicon every minute
    const intervalId = setInterval(updateFavicon, 60000);

    return () => clearInterval(intervalId);
  }, [currentTheme, timeData]); // Add timeData to the dependency array

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
          <Logo primaryColor={currentTheme.colors[2]} secondaryColor={currentTheme.colors[0]} currentTime={currentTime.time} />
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
                    <div className="flex items-center">
                      <span className="mr-2 text-sm opacity-70">{tz.offset}</span>
                      {timezone === tz.name && <Check size={16} style={{ color: currentTheme.colors[0] }} />}
                    </div>
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
                href="https://github.com/Pinpas/timesimple" 
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