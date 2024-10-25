// client/src/components/layout/Weather.tsx
'use client';

import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Loader, MapPin, Clock } from 'lucide-react';

interface WeatherData {
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // College Station coordinates
  const COLLEGE_STATION = {
    lat: 30.6280,
    lon: -96.3344,
    name: 'College Station'
  };

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchWeather = async () => {
      console.log('API Key:', process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY);

      if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
        console.error('OpenWeather API key is missing');
        setError('API key not configured');
        setIsLoading(false);
        return;
      }

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${COLLEGE_STATION.lat}&lon=${COLLEGE_STATION.lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=imperial`;
        console.log('Fetching weather from:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch weather: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weather data:', data);
        setWeather(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unable to load weather');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 5 minutes
    const weatherInterval = setInterval(fetchWeather, 5 * 60 * 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const getWeatherIcon = (weatherMain: string) => {
    const mainWeather = weatherMain.toLowerCase();
    console.log('Weather condition:', mainWeather);

    switch (mainWeather) {
      case 'clear':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader className="h-5 w-5 animate-spin text-[var(--panda-red)]" />
        <span className="text-sm">Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="text-sm text-gray-500">
        Weather unavailable: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 py-2 shadow-sm">
      {/* Location Row */}
      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
        <MapPin className="h-3 w-3" />
        <span>{COLLEGE_STATION.name}</span>
      </div>
      
      {/* Weather and Time Row */}
      <div className="flex items-center justify-between">
        {/* Weather Information */}
        <div className="flex items-center space-x-3">
          {getWeatherIcon(weather.weather[0].main)}
          <div>
            <div className="font-medium">
              {Math.round(weather.main.temp)}°F
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {weather.weather[0].description}
            </div>
          </div>
        </div>

        {/* Time Information */}
        <div className="flex items-center space-x-1 ml-4">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
}