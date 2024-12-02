// src/components/layout/WeatherInfo.tsx
'use client';

import { useState, useEffect } from 'react';
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

const COLLEGE_STATION = {
  lat: 30.6280,
  lon: -96.3344,
  name: 'College Station'
};

const WeatherIcon = ({ condition }: { condition: string }) => {
  const mainWeather = condition.toLowerCase();
  switch (mainWeather) {
    case 'clear':
      return <Sun className="h-5 w-5 text-yellow-500" />;
    case 'clouds':
      return <Cloud className="h-5 w-5 text-gray-500" />;
    case 'rain':
    case 'drizzle':
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    default:
      return <Cloud className="h-5 w-5 text-gray-500" />;
  }
};

export default function WeatherInfo() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchWeather = async () => {
      if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
        setError('API key not configured');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${COLLEGE_STATION.lat}&lon=${COLLEGE_STATION.lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=imperial`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch weather: ${response.status}`);
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load weather');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 5 * 60 * 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 p-2">
        <Loader className="h-4 w-4 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <div className="flex flex-col bg-white rounded-lg px-3 py-1">
      <div className="flex items-center space-x-1 text-xs text-gray-500">
        <MapPin className="h-3 w-3" />
        <span>{COLLEGE_STATION.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <WeatherIcon condition={weather.weather[0].main} />
        <span className="text-sm font-medium">
          {Math.round(weather.main.temp)}°F
        </span>
        <Clock className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </span>
      </div>
    </div>
  );
}