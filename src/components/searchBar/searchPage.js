import React, { useEffect } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import datalabels from 'chartjs-plugin-datalabels';
import * as AiIcns from 'react-icons/ai';
import * as BiIcns from 'react-icons/bi';
import * as FaIcns from 'react-icons/fa';
import * as WiIcns from 'react-icons/wi';
import * as RiIcns from 'react-icons/ri';
import * as MdIcns from 'react-icons/md';
import { Line } from 'react-chartjs-2';
import Days from '../day-prediction/days';
import Button from 'react-bootstrap/Button';

import cloudDay from '../../assets/icons/FewCloudsDay.svg';
import clearSkyN from '../../assets/icons/ClearSkyNight.svg';
import brokenClouds from '../../assets/icons/BrokenClouds.svg';
import clearSkyD from '../../assets/icons/ClearSkyDay.svg';
import fewCloudsN from '../../assets/icons/FewCloudsNight.svg';
import mist from '../../assets/icons/Mist.svg';
import rain from '../../assets/icons/Rain.svg';
import scatteredClouds from '../../assets/icons/ScatteredClouds.svg';
import showerRain from '../../assets/icons/ShowerRain.svg';
import snow from '../../assets/icons/Snow.svg';
import thunder from '../../assets/icons/ThunderStorm.svg';


import $ from 'jquery';
const APIKEY = 'bceb51cbee4b751cc43eefea844fa6bf';
const TSRegex = /(.*)thunderstorm(.*)/;
const DRegex = /(.*)drizzle(.*)/;
const RRegex = /(.*)rain(.*)/;
const SRegex = /(.*)snow(.*)/;
const CRegex = /(.*)clear(.*)/;
const CLRegex = /(.*)clouds(.*)/;
var { DateTime } = require('luxon');

const bg = [
	"rain",
	"night",
	"sunset",
	"day",
];

const SearchPage = (props) => {
  const [dataGot, setdataGot] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [weatherData, setWeatherData] = React.useState({
    locate: "",
		temp: 0,
		cond : "",
		fLike: 0,
		icn: null,
		sunriseSunset: "",
		humidity: 0,
		pressure: 0,
		min: 0,
		max: 0,
		vis: 0,
		wind: 0,
		clouds: 0,
  });
  const [futureData, setFutureData] = React.useState({
    hourlyTemp: [],
		hourlyTime: [],
		futureDays: [],
  });
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null
  });

  const isDay = () => {
		return (Date.now() + 60000 * new Date().getTimezoneOffset() + 21600000) % 86400000 / 3600000 > 12;
	}

  const iconSorter = () => {
		var cond = weatherData.cond
		console.log("cond: "+cond);
		console.log(CLRegex.test(cond));

    // if (!(this.isDay())){
    //   document.getElementsByClassName("container").className = document.getElementsByClassName("container").className.replace( /(?:^|\s)MyClass(?!\S)/g , '' )
    // }

		if (TSRegex.test(cond)){
			return thunder
		}
		else if (CRegex.test(cond)){
			return (isDay())? clearSkyD:clearSkyN;
		}
		else if (CLRegex.test(cond)){
			if (/(.*)few(.*)/.test(cond)){
				return (isDay())? cloudDay:fewCloudsN;
			}
			else if (/(.*)scattered(.*)/.test(cond)){
				return scatteredClouds;
			}
			else if (/(.*)broken(.*)/.test(cond)||/(.*)overcast(.*)/.test(cond)){
				return brokenClouds;
			}
		}
		else if (/(.*)mist(.*)/.test(cond)||/(.*)smoke(.*)/.test(cond)||/(.*)haze(.*)/.test(cond)||/(.*)fog(.*)/.test(cond)||/(.*)sand(.*)/.test(cond)||/(.*)dust(.*)/.test(cond)||/(.*)volcanic ash(.*)/.test(cond)||/(.*)squalls(.*)/.test(cond)){
			return mist;
		}
		else if (DRegex.test(cond)){
			return showerRain;
		}
		else if (RRegex.test(cond)){
			return rain;
		}
		else if (SRegex.test(cond)){
			return snow;
		}
	}

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    console.log(latLng);
    setAddress(value);
    setCoordinates(latLng);
    setdataGot(true);

    await fetchWeatherData(latLng.lat, latLng.lng);
		await fetchHourly(latLng.lat, latLng.lng);
  };

  const formatAMPM = (date) => {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}

	const parseHResponse = (parsed_json) => {
		var arr = [];
		var arr2 = [];
		var days = [];
		for (let index = 0; index < 5; index++) {
			var names = parsed_json['hourly'][index.toString()]['temp'];
			var times = formatAMPM(new Date(parsed_json['hourly'][index.toString()]['dt'] * 1000));

			arr.push(names);
			arr2.push(times);
		}

		for (let index = 0; index <= 7; index++) {
			days.push({'temp': parsed_json['daily'][index.toString()]['temp']['day'], 'time': formatAMPM(new Date(parsed_json['daily'][index.toString()]['dt'] * 1000)), 'weather': [{icon: parsed_json['daily'][index.toString()]['weather']['0']['icon']}, {'name': parsed_json['daily'][index.toString()]['weather']['0']['main']}]});
		}

		// set states for fields so they could be rendered later on
		setFutureData({
			hourlyTemp: arr,
			hourlyTime: arr2,
			futureDays: days,
		});      
	}

	const parseWResponse = (parsed_json) => {
		let location = parsed_json['name'];
		let temp_c = Math.round(parsed_json['main']['temp']);
		let conditions = parsed_json['weather']['0']['description'];
		let feelsLike = Math.round(parsed_json['main']['feels_like']);
		let icon = parsed_json['weather']['0']['icon'];

		let humidity = parsed_json['main']['humidity'];
		let pressure = parsed_json['main']['pressure'];
		let min =  parsed_json['main']['temp_min']
		let max = parsed_json['main']['temp_max']
		let vis = parsed_json['visibility'];
		let wind = parsed_json['wind'];
		let clouds = parsed_json['clouds']['all'];

		let sunriseSunset = {sunrise: parsed_json['sys']['sunrise'], sunset: parsed_json['sys']['sunset']}
		// set states for fields so they could be rendered later on
		setWeatherData({
			locate: location,
			temp: temp_c,
			cond : conditions,
			fLike: feelsLike,
			icn: icon,
			sunriseSunset: sunriseSunset,
			humidity: humidity,
			pressure: pressure,
			min: min,
			max: max,
			vis: vis,
			wind: wind,
			clouds: clouds,
		});      
	}

  const fetchHourly = (latitude,longitude) => {
		var url = "http://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude=current,minutely,alerts&units=Metric&appid="+APIKEY;
		
		$.ajax({
			url: url,
			dataType: "json",
			success : parseHResponse,
			async: true,
			error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		})
	}

	const fetchWeatherData = (latitude, longitude) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		//http://api.openweathermap.org/data/2.5/weather?lat=
		var url = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=Metric&appid="+APIKEY;

		$.ajax({
			url: url,
			dataType: "jsonp",
			success : parseWResponse,
			async: true,
			error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		})
		// once the data grabbed, hide the button
	}


  const data = {
    labels: futureData.hourlyTime,
    datasets: [
      {
      pointRadius: 1.5,
      pointHoverRadius: 0,
      data: futureData.hourlyTemp,
      fill: false,
      backgroundColor: 'rgb(255,255,255)',
      borderColor: 'rgba(255,255,255,0.5)',
      borderDash: [5],
      borderWidth: 1,
      datalabels: {
        color: 'white',
      }
      },
    ],
    
  }
  
  const options = {
    tooltips: {enabled: false},
    events: [],
    scales: {
      yAxes: [
      {
        gridLines: {
          display: false,
          zeroLineColor: '#ffcc33',
        },
        ticks: {
          display: false 
        }
      },
      ],
      xAxes: [{
        gridLines: {
          display: false, // must be false since we're going to draw our own 'gridlines'!
          color: 'rgba(255,255,255,0.5)', // can still set the colour.
          lineWidth: 1 // can still set the width.
        },
        ticks: {
          fontColor: "white",
        },
      }],
      
    },
    maintainAspectRatio: true,
    legend: { display: false },
    plugins: {
      datalabels: {
        display: true,	
        anchor: 'end',
        align: 'end',
        offset: '10',
        formatter: function(value, context) {
          return Math.round(value) + '°';
        },
      },
      
    },
    layout: {
      padding: {
        top: 50,
        right: 20,
      }
    },
  }

  

  const plugins = {
    afterRender: function(c, options) {
      let meta = c.getDatasetMeta(0),max;
      c.ctx.save();
      c.ctx.strokeStyle = c.config.options.scales.xAxes[0].gridLines.color;
      c.ctx.lineWidth = c.config.options.scales.xAxes[0].gridLines.lineWidth;
      c.ctx.beginPath();
      meta.data.forEach(function(e) {
        c.ctx.moveTo(e._model.x, meta.dataset._scale.bottom);
        c.ctx.lineTo(e._model.x, e._model.y);
      });
      c.ctx.textBaseline = 'top';
      c.ctx.textAlign = 'right';
      c.ctx.fillStyle = 'black';
      c.ctx.stroke();
      c.ctx.restore();
      }
  }

  // check if temperature data is fetched, if so add the sign styling to the page
  //console.log(this.state);
  const tempStyles = weatherData.temp ? `${'temperature'} ${'filled'}` : "temperature";

  const handleClick =(e)=> {
    props.parentCallback({"name": address, "lat": coordinates.lat, "lng": coordinates.lng});
    let locs = JSON.parse(localStorage.getItem('savedLocs'));
    if (address != ""){
      locs.push({"name": address, "lat": coordinates.lat, "lng": coordinates.lng});
      localStorage.setItem('savedLocs',JSON.stringify(locs));
      e.preventDefault();
    }
    
  }

  useEffect( () => {
    console.log(props);
    if (props.location.loc !== undefined){
      setAddress(props.location.loc.name);
      setCoordinates({lat: props.location.loc.lat, lng: props.location.loc.lng});
      setdataGot(true);

      fetchWeatherData(props.location.loc.lat, props.location.loc.lng);
      fetchHourly(props.location.loc.lat, props.location.loc.lng);
    }
  }, []);
  
  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div style={{
            float: 'center',
            position: 'relative',
            top: '-50px',
            left: '70px',
            color: '#FFFFFF',
            width: '210pt',
            zIndex: '100',
          }}>
            <br/>
            <section className="searchContainer">
              <h3><FaIcns.FaSave onClick={handleClick} className="one" style={{color:"black"}}/></h3>
              <input className="two" id="input" style={{borderRadius: "25px",textAlign: "center",}} {...getInputProps({ placeholder: "Type address" })} />
            </section>

            <div>
              {loading ? <div>...loading</div> : null}

              {suggestions.map(suggestion => {
                const style = {
                  color: "black",
                  backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <br/>
      {
        (dataGot)? (
          <div className={ "body" }>
            <div className={ "conditions2" }><strong>{ weatherData.cond }</strong></div>
              <div className={"floatOVer2"}>
                <img className={ "fimg2" } src={iconSorter()} onError={console.log("couldn't find icon")}/>
                <div className={"floating2"}>
                  <span className={ tempStyles }>{ weatherData.temp }</span>
                  <div className={ "conditions" }>{DateTime.now().toFormat('DDDD')}</div>
                  <div class="chartAreaWrapper">
                    <Line data={data} options={options} plugins={[datalabels,plugins]} />
                  </div>
                  <div className={ "swipe" }>
                    <AiIcns.AiOutlineMinus/>
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <Days futureDays={futureData.futureDays}/>
                  <p>more information</p>
                  <div className="info">
												<div className="split">
													<div className="left">
														<div className="itm"><p><WiIcns.WiHumidity/>humidity</p><p>{weatherData.humidity}%</p></div>
														<div className="itm"><p><WiIcns.WiBarometer/>pressure</p><p>{weatherData.pressure}hPa</p></div>
														<div className="itm"><p><RiIcns.RiArrowUpDownFill/>min/max</p><p>{weatherData.min}°/{weatherData.max}°</p></div>
													</div>
													<div className="right">
														<div className="itm"><p><MdIcns.MdVisibility/>visibility</p><p>{weatherData.vis}m</p></div>
														<div className="itm"><p><WiIcns.WiStrongWind/>wind</p><p>100000</p></div>
														<div className="itm"><p><WiIcns.WiCloud/>cloudiness</p><p>{weatherData.clouds}%</p></div>
													</div>
												</div>
											</div>
                </div>
              </div>
            </div>
            ):(
              <div>
                <p style={{textAlign: 'center'}}>type a place</p>
                <BiIcns.BiConfused/>
              </div>
            )
        
      }
      </div>
  );
}

export default SearchPage