// import preact
import React from 'react';
// import stylesheets for ipad & button
import ScrollMenu from "react-horizontal-scrolling-menu";
import StarfieldAnimation from 'react-starfield-animation';
import * as VscIcns from 'react-icons/vsc';
import * as AiIcns from 'react-icons/ai';

import ParticleAnimation from 'react-particle-animation';
import Particles from "react-tsparticles";
import 'reactjs-popup/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import datalabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';

import Home from '../pages/Home';
import Reports from '../pages/Reports';
import Products from '../pages/Products';
import Navbar from "../burger-menu/navbar";
import Days from '../day-prediction/days';
import style from './phonestyle.css';
import MapContainer from "../map/map";

import cloudDay from '../../assets/icons/FewCloudsDay.svg';

// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

var { DateTime } = require('luxon');;

const APIKEY = 'bceb51cbee4b751cc43eefea844fa6bf';
const GAPIKEY = 'AIzaSyDdfgXMyKCCD9FKeYF77xlldUVfVmiXDZ8';

const TSRegex = new RegExp('.thunderstorm.');
const DRegex = new RegExp('.drizzle.');
const RRegex = new RegExp('.rain.');
const SRegex = new RegExp('.snow.');
const CRegex = new RegExp('.clear.');
const CLRegex = new RegExp('.clouds.');

const bg = [
	"rain",
	"day",
	"night",
	"sunset",
];

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

		this.redirectTimeout = null;
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
		console.log(parsed_json);
		var arr = [];
		var arr2 = [];
		var days = [];
		for (let index = 0; index < 5; index++) {
			var names = parsed_json['hourly'][index.toString()]['temp'];
			var times = this.formatAMPM(new Date(parsed_json['hourly'][index.toString()]['dt'] * 1000));

			arr.push(names);
			arr2.push(times);
		}

		for (let index = 0; index <= 7; index++) {
			days.push({temp: parsed_json['daily'][index.toString()]['temp']['day'], time: this.formatAMPM(new Date(parsed_json['daily'][index.toString()]['dt'] * 1000)), weather: [{icon: parsed_json['daily'][index.toString()]['weather']['0']['icon']}, {name: parsed_json['daily'][index.toString()]['weather']['0']['main']}]});
		}

		// set states for fields so they could be rendered later on
		this.setState({
			hourlyTemp: arr,
			hourlyTime: arr2,
			futureDays: days,
		});      
	}

	parseWResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = Math.round(parsed_json['main']['temp']);
		var conditions = parsed_json['weather']['0']['description'];
		var feelsLike = Math.round(parsed_json['main']['feels_like']);
		var icon = parsed_json['weather']['0']['icon'];
		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions,
			fLike: feelsLike,
			icn: icon
		});      
	}

	parseGResponse = (parsed_json) => {
		const val = Math.floor(Math.random() * 11);
		var rec = Math.round(parsed_json['results'][String(val)]['name']);

		// set states for fields so they could be rendered later on
		this.setState({
			recommendation: rec,
		});      
	}

	//!still to do the algorithm for selecting the best place to visit from GAPI fetch (parseGResponse)
	fetchPlaces = (latitude, longitude, num) => {

		var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key="+GAPIKEY+"&location="+latitude+","+longitude+"&radius=5000&type="+this.recType[num];
		console.log(url);
		$.ajax({
			url: url,
			dataType: "json",
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
		clearTimeout(this.redirectTimeout);
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
			//console.log('Successfully found you at ' + this.state.latitude + ',' + this.state.longitude);
			this.fetchWeatherData(this.state.latitude, this.state.longitude);
			this.fetchHourly(this.state.latitude, this.state.longitude);
			
			}, this.errorPosition);
			
		}
	}

	isDay() {
		return (Date.now() + 60000 * new Date().getTimezoneOffset() + 21600000) % 86400000 / 3600000 > 12;
	}

	pickBG(){
		if (!(this.isDay())){
			return bg[2];
		}
		else if (SRegex.test(this.state.conditions)){
			return bg[1];
		}
		else if (DRegex.test(this.state.conditions)||RRegex.test(this.state.conditions)||CLRegex.test(this.state.conditions)||TSRegex.test(this.state.conditions)){
			return bg[0];
		}
		else{
			return bg[3];
		}
	}

	//! will get back to sort out the recommendations & loading
	componentDidMount(){
		// const { history } = this.props;
		// this.redirectTimeout = setTimeout(() => {
		// 	history.push('/weather');
		// }, 5000);

		// console.log("temp: "+this.state.temp);
		// if (this.state.temp < 10){
		// 	this.fetchPlaces(this.state.latitude, this.state.longitude, [2,3,4,8,10,15,17][Math.floor(Math.random() * 7)]);
		// }
		// else if (10<= this.state.temp < 15){
		// 	this.fetchPlaces(this.state.latitude, this.state.longitude, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,23,24,25,26,27][Math.floor(Math.random() * 28)]);
		// }
		// else if (15<= this.state.temp < 20){
		// 	this.fetchPlaces(this.state.latitude, this.state.longitude, [15,23][Math.floor(Math.random() * 2)]);
		// }
		// else if (20<= this.state.temp < 30){
		// 	this.fetchPlaces(this.state.latitude, this.state.longitude, [26,28][Math.floor(Math.random() * 2)]);
		// }


		// console.log("here: "+this.state.recommendation);
		// this.setState({displayText: "now is the time to visit "+this.state.recommendation});
	}

	
	// the main render method for the iphone component
	render() {
		const data = {
			labels: this.state.hourlyTime,
			datasets: [
				{
				pointRadius: 1.5,
				pointHoverRadius: 0,
				data: this.state.hourlyTemp,
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
				<div className={ 'container '+this.pickBG() } id="moveBack">
					{/* class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ > */}
					<div id = "he1" className={ "header"}>
					<Router>
						<Navbar />
						<Switch>
							<Route exact path="/loading">
								<div style={{position: 'absolute', left: '40%', top: '40%',}}>
									<VscIcns.VscLoading style={{animation: `spin 1s linear infinite`,width: '35%', height: 'auto'}}/>
									<div className={ "conditions" }>loading your weather</div>
								</div>
							</Route>
							<Route exact path="/">
								<div className={ "body" }>
									<div className={ "conditions" }><strong>{ this.state.cond }</strong></div>
									<div className={ "conditions" }>{ this.state.recommendation }</div>
									<div className={ "conditions" }>it's hot outside, do whatever</div>
									<div className={"floatOVer"}>
										<img className={ "fimg" } src={cloudDay} onError={console.log("couldn't find icon")}/>
										<div className={"floating"}>
											<span className={ tempStyles }>{ this.state.temp }</span>
											<div className={ "conditions" }>{DateTime.now().toFormat('DDDD')}</div>
											<div class="chartAreaWrapper">
												<Line data={data} options={options} plugins={[datalabels,plugins]} />
											</div>
											<div className={ "swipe" }>
												<AiIcns.AiOutlineLine/>
											</div>
											<br/>
											<Days data={this.state.futureDays}/>
										</div>
										
									</div>
								</div>
								
								<br/>
								
							</Route>
							<Route exact path="/settings" component={Products} />
							<Route exact path="/resetPassword" component={Reports} />
						</Switch>
					</Router>
					</div>
					
				</div>
			</>
		);
	};
}
