// import preact
import React from 'react';
// import stylesheets for ipad & button
import ScrollMenu from "react-horizontal-scrolling-menu";
import StarfieldAnimation from 'react-starfield-animation';
import ParticleAnimation from 'react-particle-animation';
import Particles from "react-tsparticles";
import 'reactjs-popup/dist/index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as DL from 'chartjs-plugin-datalabels';

import Home from '../pages/Home';
import Reports from '../pages/Reports';
import Products from '../pages/Products';
import { Line } from 'react-chartjs-2';
import Navbar from "../burger-menu/navbar";
import style from './phonestyle.css';
import popup from "../map/popup";

// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

var plugin = { DL };

var { DateTime } = require('luxon');;

const APIKEY = 'bceb51cbee4b751cc43eefea844fa6bf';
const GAPIKEY = 'AIzaSyDdfgXMyKCCD9FKeYF77xlldUVfVmiXDZ8';

export default class Iphone extends React.Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		// button display state
		this.recType = [
			"tourist_attraction",
			"amusement_park",
			"aquarium",
			"art_gallery",
			"bakery",
			"bar",
			"beauty_salon",
			"bicycle_store",
			"book_store",
			"bowling_alley",
			"cafe",
			"casino",
			"clothing_store",
			"department_store",
			"florist",
			"gym",
			"hair_care",
			"library",
			"movie_rental",
			"movie_theater",
			"museum",
			"night_club",
			"park",
			"restaurant",
			"shopping_mall",
			"spa",
			"stadium",
			"zoo"
		]
	}

	formatAMPM = (date) => {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}
	//hi

	parseHResponse = (parsed_json) => {
		var arr = [];
		var arr2 = [];
		for (let index = 0; index < 12; index++) {
			arr.push(parsed_json['hourly'][index.toString()]['temp']);
			arr2.push(this.formatAMPM(new Date(parsed_json['hourly'][index.toString()]['dt'] * 1000)));
		}
		var now = new Date();
		var daysOfYear = [];
		// set states for fields so they could be rendered later on
		this.setState({
			hourlyTemp: arr,
			hourlyTime: arr2,
		});      
	}

	parseWResponse = (parsed_json) => {
		
		var location = parsed_json['name'];
		var temp_c = Math.round(parsed_json['main']['temp']);
		var conditions = parsed_json['weather']['0']['description'];
		var feelsLike = Math.round(parsed_json['main']['feels_like']);
		var icon = parsed_json['weather']['0']['icon'];
		console.log(icon)
		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions,
			fLike: feelsLike,
			icn: icon
		});      
	}

	//!still to do the algorithm for selecting the best place to visit from GAPI fetch (parseGResponse)
	fetchPlaces = (latitude, longitude) => {
		var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key="+GAPIKEY+"&location="+latitude+","+longitude+"&radius=5000&type="+this.recType[0];
		console.log(url)
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseGResponse,
			error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	fetchMap = (latitude,longitude) => {
		var url = "https://maps.googleapis.com/maps/api/js?key="+latitude+"&lon="+longitude+"&exclude=current,minutely,alerts&units=Metric&appid="+APIKEY;
		$.ajax({
			url: url,
			dataType: "json",
			success : this.parseHResponse,
			error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	fetchHourly = (latitude,longitude) => {
		var url = "http://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude=current,minutely,alerts&units=Metric&appid="+APIKEY;
		$.ajax({
			url: url,
			dataType: "json",
			success : this.parseHResponse,
			error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	fetchWeatherData = (latitude, longitude) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		//http://api.openweathermap.org/data/2.5/weather?lat=
		var url = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=Metric&appid="+APIKEY;

		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseWResponse,
			error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	componentWillMount() {
		this.setState({ 
			longitude:0,
			latitude: 0,

			temp: "",
			display: true,
			locate: "",
			temp: 0,
			cond : "", 
			icn: "",
			recNum: 0
		});

		if (!navigator.geolocation){
			this.setState({statusText: 'Your browser does not support geolocation...'});
		}
		else{
			navigator.geolocation.getCurrentPosition((position) => {
			var lat = position.coords.latitude;
			var longitude = position.coords.longitude;
			this.setState({longitude: longitude, latitude: lat});
			console.log('Successfully found you at ' + this.state.latitude + ',' + this.state.longitude);
			this.fetchWeatherData(this.state.latitude, this.state.longitude);
			this.fetchHourly(this.state.latitude, this.state.longitude);
			}, this.errorPosition);
		}
	}

	
	// the main render method for the iphone component
	render() {
		const data = {
			labels: this.state.hourlyTime,
			datasets: [
				{
				data: this.state.hourlyTemp,
				fill: false,
				backgroundColor: 'rgb(255,255,255)',
				borderColor: 'rgba(255,255,255,0.5)',
				datalabels: {
					color: '#FFCE56'
				}
				},
			],
			
		}
		
		const options = {
			scales: {
				yAxes: [
				{
					display: false,
				},
				],
				xAxes: [{
					gridLines: {
						display: false,
					},
					ticks: {
                        fontColor: "white",
					}
				}],
			},
			maintainAspectRatio: true,
			legend: { display: false },
			plugins: {
			// Change options for ALL labels of THIS CHART
				datalabels: {
					color: '#36A2EB'
				}
			},
		}

		// check if temperature data is fetched, if so add the sign styling to the page
		//console.log(this.state);
		const tempStyles = this.state.temp ? `${'temperature'} ${'filled'}` : "temperature";
		
		
		// display all weather data
		return (
			<>
				<StarfieldAnimation
					style={{
						pointerEvents: 'none',
						position: 'absolute',
						width: '100%',
						height: '100%',
					}}
				/> 
				<div className={ "container" }>
					{/* class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ > */}
					<div id = "he1" className={ "header"}>
					<Router>
						<Navbar/>
						<Switch>
							<Route exact path="/">
								<div className={ "body" }>
									<div className={ "city" }>{ this.state.locate }</div>
									<div className={ "conditions" }>{ this.state.cond }</div>
									<img className={ "img" } src={'http://openweathermap.org/img/wn/'+this.state.icn+'@4x.png'} onError={console.log("couldn't find icon")}/><div/>
									<span className={ tempStyles }>{ this.state.temp }</span>
									<div className={ "conditions" }>{DateTime.now().toFormat('DDDD')}</div>
								</div>
								<br/>
								<popup/>
								<div>
									<Line ref={this.chartReference} data={data} options={options} />
								</div>
							</Route>
							<Route exact path="/reports" component={Products} />
							<Route exact path="/resetPassword" component={Reports} />
						</Switch>
					</Router>
					</div>
					
				</div>
			</>
		);
	};
}
