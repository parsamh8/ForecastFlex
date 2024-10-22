import fs from 'node:fs/promises'; // file system from node to read files
import { v4 as uuidv4 } from 'uuid'; // uuid for unique id
// City class with name and id properties
class City {
  name: string;
  id: string;
  weather: Array<{ // weather object to retrieve from history without recalling api
    name: string; 
    temperature: string;
    date: string;
    icon: string;
    iconDescription: string;
    tempF: string;
    windSpeed: string;
    humidity: string;
  }> | null;

  constructor(name: string, id: string, weather = null) {
    this.name = name;
    this.id = id;
    this.weather = weather;
  }
}

// HistoryService class
class HistoryService {
  // Read method that reads from the db.json file
  private async read() {
    return fs.promises.readFile('db/db.json', 'utf8');
  }

  // Write method that writes the updated cities array to the db.json file
  private async write(cities: City[]) {
    return fs.promises.writeFile('db/db.json', JSON.stringify(cities, null, 2));
  }

  // getCities method that reads the cities from the db.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    try {
      const citiesJson = await this.read();
      return JSON.parse(citiesJson) || [];
    } catch (err) {
      console.error('Error reading cities:', err);
      return [];
    }
  }

  // addCity method that adds a city to the db.json file
  async addCity(city: string, weather: any): Promise<City> {
    if (!city) throw new Error('City cannot be blank');

    const citiesArray = await this.getCities();
    const existingCity = citiesArray.find(c => c.name.toLowerCase() === city.toLowerCase());

    if (existingCity) {
      console.log('City already exists:', city);
      return existingCity;
    }

    const newCity = new City(city, uuidv4(), weather);
    const updatedCities = [...citiesArray, newCity];

    await this.write(updatedCities);
    console.log('New city added:', newCity);
    return newCity;
  }

  // removeCity method that removes a city from the db.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const filteredCities = cities.filter(city => city.id !== id);

    await this.write(filteredCities);
    console.log('City removed with ID:', id);
  }
}

export default new HistoryService(); // export the HistoryService instance