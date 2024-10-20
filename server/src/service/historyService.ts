import fs from 'node:fs/promises'; // file system from node to read files
import { v4 as uuidv4 } from 'uuid'; // uuid for unique id
// City class with name and id properties
class City {
  name: string;
  id: string;
  weather: [{ // weather object to retrieve from history without recalling api
    name: string; 
    temperature: string;
    date: string;
    icon: string;
    iconDescription: string;
    tempF: string;
    windSpeed: string;
    humidity: string;
  }] | null;
  constructor(
    name: string,
    id: string,
    weather = null
  ) {
    this.name = name;
    this.id = id;
    this.weather = weather;
  }

}
// HistoryService class
class HistoryService {
  // Read method that reads from the db.json file
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'r',
      encoding: 'utf8',
    });
  }
  // Write method that writes the updated cities array to the db.json file
  private async write(cities: City[]) {
    return await fs.writeFile(
      'db/db.json',
      JSON.stringify(cities, null, '\t')
    );
  }
  // getCities method that reads the cities from the db.json file uand returns them as an array of City objects
  async getCities() {
    return await this.read().then((citiesJson) => {
      let parsedCities: City[];

      
      try {
        parsedCities = [].concat(JSON.parse(citiesJson)); // If JSON.parse(citiesJson) returns an array, concat will return that array. If it returns a single object (not an array), 
        // concat will convert the objects into an array with those objects as elements.
      } catch (err) {
        // If cities isn't an array or can't be turned into one, send back a new empty array
        parsedCities = [];
      }

      return parsedCities; // return the parsed cities
    });
  }
  // addCity method that adds a city to the db.json file
  async addCity(city: string, weather: any) {
    if (!city) {
      throw new Error('City can not be blank');
    }
    const citiesArray = await this.getCities(); // get cities array
    let cityExists = false; 
    let existingCity = new City('','',null);
    let element: any;
    for (element of citiesArray) {
      if (city.toLowerCase() === citiesArray[element].name.toLowerCase()) { // check if city already exists in the array of cities
        cityExists = true; // set the flag if a matching name is found
        existingCity = citiesArray[element]; // Store the existing city object
        break; // exit if city exists
      }
    }
    // if it doesnt exist, create a new city objet
    if (!cityExists) {
      const newCity: City = {
        name: city,
        id: uuidv4(), // Add a unique id to the city using uuid package for delete lookup
        weather
      }
      console.log('this is a new city object with weather' + JSON.stringify(newCity));


      // Get all cities, add the new city, write all the updated cities, return the new city
      return await this.getCities()
        .then((parsedCities) => {
          return [...parsedCities, newCity]; // merge new city with parsedCities array
        })
        .then((updatedCities) => this.write(updatedCities)) // write the array to the JSON file
        .then(() => newCity); // return new city
    } else {
      console.log('City already exists: ' + city); // if city doesnt exist, log a response and return the current city
      return existingCity;
  } }

  // removeCity method that removes a city from the db.json file
  async removeCity(id: string) {
    return await this.getCities().then((cities: City[]): City[] => { // get parsed cities array
      return cities.filter(city => city.id !== id); // filter out passed id
    })
      .then((filteredCities) => this.write(filteredCities)) // write updated array back to file
  }
}


export default new HistoryService(); // export history service object with methods