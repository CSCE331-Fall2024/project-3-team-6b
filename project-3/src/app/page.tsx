"use client";

import { useEffect, useState } from 'react';
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState<string>("");

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const updateTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 

    setTime(`${hours}:${minutes} ${ampm}`);
  };

  useEffect(() => {
    const lat = 30.6214;
    const lon = -96.3398;
    fetchWeather(lat, lon);

    updateTime(); 
    const interval = setInterval(updateTime, 60000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div>
      <h1>Panda Express POS System</h1>
      <p>Local Time: {time}</p>
      {error ? (
        <p>Error: {error}</p>
      ) : weather ? (
        <div>
          <h2>Weather in {weather.name}</h2>
          <p>Temp: {Math.round(weather.main.temp)}°F</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}
