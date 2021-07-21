import React from "react";

import "./App.css";

import "weather-icons/css/weather-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Weather from "./app_component/weather.component";
import Form from "./app_component/form.component";

//api call api.openweathermap.org/data/2.5/weather?q=London,uk
const API_key = "add your api key here";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      fahrenheit: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: "",
      error: false
    };
        
    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sprinkle",
      Rain: "wi-rain",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-cloudy"
    };
  }

  convertFahrenheit(temp) {
    let far = (Math.round(temp*1.8-459.67));
    return far;
  }

  getWeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon: this.weatherIcon.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
        default:
          this.setState({ icon: this.weatherIcon.Clear });
    }
  }
  
  getWeather = async (e) => {
   
    e.preventDefault();
   
    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;
   
   if(city && country){
    const api_call = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}`
    );

    const response = await api_call.json();

    console.log(response);

    this.setState({
      city: `${response.name},${response.sys.country}`,
      fahrenheit: this.convertFahrenheit(response.main.temp),
      temp_max: this.convertFahrenheit(response.main.temp_max),
      temp_min: this.convertFahrenheit(response.main.temp_min),
      description: response.weather[0].description,
    });

    this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
   }else{
     this.setState({error: true});
   }
  };

  render() {
    return (
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error}/>
        <Weather
          city={this.state.city}
          country={this.state.country}
          temp_fahrenheit={this.state.fahrenheit}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
      </div>
    );
  }

}

export default App;
