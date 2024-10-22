import dotenv from 'dotenv';
dotenv.config();

// WeatherService class for required objects
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: string;
  windSpeed: string;
  humidity: string;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: string,
    windSpeed: string,
    humidity: string) {
    this.city = city;
    this.tempF = tempF;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// class for the WeatherService
class WeatherService {
  baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org'; //url and api key from .env file
    this.apiKey = 'b341347737a76f3242bd62ba81ec30da';
  }

  // Define a method to get weather data (either from file or API)
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const url = `${this.baseURL}/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`;
      console.log(`Fetching weather for city: ${city}`);
      console.log(`API URL: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Raw API data:', data);

      const weatherArray = this.parseCurrentWeather(data);
      console.log('Parsed weather data:', weatherArray);

      return weatherArray;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // Parse the current weather data
  private parseCurrentWeather(data: any): Weather[] {
    if (!data?.list?.length) {
      throw new Error('Invalid weather data');
    }

    const dailyForecasts = data.list.filter((forecastItem: any) => {
      const time = forecastItem.dt_txt.split(' ')[1];
      return time === '12:00:00'; // Filter for forecasts at noon
    });

    const cityName = data.city.name;
    console.log('City Name:', cityName);

    const weatherArray: Weather[] = dailyForecasts.map((forecastItem: any) => {
      const date = new Date(forecastItem.dt * 1000).toLocaleDateString();
      const tempF = forecastItem.main.temp;
      const icon = forecastItem.weather[0].icon;
      const iconDescription = forecastItem.weather[0].description;
      const windSpeed = forecastItem.wind.speed;
      const humidity = forecastItem.main.humidity;

      return new Weather(cityName, date, icon, iconDescription, tempF, windSpeed, humidity);
    });

    console.log('Generated weather array:', weatherArray);
    return weatherArray;
  }
}

export default new WeatherService();

// exported