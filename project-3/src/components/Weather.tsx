"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=30.6214&lon=-96.3398&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : weather ? (
        <>
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            width={40}
            height={40}
            priority
          />
          <div>
            <p className="text-sm font-medium">
              {Math.round(weather.main.temp)}°F
            </p>
            <p className="text-xs capitalize text-gray-500">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Weather;
