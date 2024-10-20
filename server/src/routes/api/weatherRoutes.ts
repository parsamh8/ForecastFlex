import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';
const router = Router();

//--------------import historyService and weatherService objects with methods

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  //GET weather data from city name
  try {
    const {cityName} = req.body; // get city name from request body, no need to parse json as middleware handles this
    console.log(`City name from the user input is: ${cityName}`);
    if (!cityName) { // If city is not in the request return 400 error.
      return res.status(400).json({ message: 'City name is required' });
    }

    // Fetch weather data for city and save it to the history
    const weatherArray = await weatherService.getWeatherForCity(cityName);
    const savedCity = await historyService.addCity(cityName, weatherArray); // save city and weather to search history
    console.log('this is the history response object.weather'+JSON.stringify(savedCity.weather))
    return res.status(200).json(savedCity.weather); // respond with the city weather
  } catch (error) {
    console.error('Error fetching weather:', error);
    return res.status(500).json({ message: 'Error fetching weather data' }); // server error message
  }

});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await historyService.getCities(); // get cities from JSON file using historyService method
    res.status(200).json(cities); // respond with the cities 
  } catch (error) {
    res.status(500).json({ message: 'Unable to get cities', error });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // pull id off of http request 
    await historyService.removeCity(id); // remove city from JSON file via ID using historyService method
    res.status(200).json({ message: 'City removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing city', error });
  }
});

export default router; // export router with new routes