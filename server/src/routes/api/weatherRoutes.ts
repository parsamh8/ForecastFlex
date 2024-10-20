import { Router, type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
console.log("start");
console.log(process.env.API_BASE_URL);
console.log("end");
// https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b341347737a76f3242bd62ba81ec30da&units=metric


const searchHistory: { id: string, city: string }[] = []; // In-memory search history array.

// POST Request to retrieve weather data based on city name
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;  // Get the city name from the request body.

  // Check if cityName is provided in the request
  if (!cityName) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    // Fetch weather data from the OpenWeatherMap API
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b341347737a76f3242bd62ba81ec30da&units=metric
`);

    // Parse the JSON response
    const weatherData = await response.json();

    // If the API request is successful
    if (response.ok) {
      // Save the city name to search history with a unique ID
      searchHistory.push({ id: (searchHistory.length + 1).toString(), city: cityName });

      // Respond with the formatted weather data
      return res.status(200).json([{
        city: weatherData.name,
        temperature: `${weatherData.main.temp}`,
        condition: weatherData.weather[0].description,
        humidity: `${weatherData.main.humidity}`,
        windSpeed: `${weatherData.wind.speed}`,
      }]);
    } else {
      // Handle errors returned by the OpenWeatherMap API
      return res.status(weatherData.cod).json({ message: weatherData.message });
    }
  } catch (error) {
    // Handle any unexpected server or network errors
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// GET Request to retrieve the search history
router.get('/history', async (_req: Request, res: Response) => {
  // Respond with the current search history
  return res.status(200).json(searchHistory);
});

// DELETE Request to remove a city from the search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;  // Get the ID of the city from the request parameters
  const index = searchHistory.findIndex(item => item.id === id);  // Find the index of the city in the search history

  // If the city is found, delete it from the history
  if (index !== -1) {
    searchHistory.splice(index, 1);  // Remove the city from the array
    return res.status(200).json({ message: 'City deleted from history' });
  }

  // If the city is not found, return a 404 error
  return res.status(404).json({ message: 'City not found in history' });
});

export default router;