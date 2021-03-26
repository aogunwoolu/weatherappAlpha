// import preact
import React from 'react';
// import stylesheets for ipad & button
import ScrollMenu from "react-horizontal-scrolling-menu";
import StarfieldAnimation from 'react-starfield-animation';
import SwipeableViews from 'react-swipeable-views';
import * as VscIcns from 'react-icons/vsc';
import * as AiIcns from 'react-icons/ai';

import ParticleAnimation from 'react-particle-animation';
import Particles from "react-tsparticles";
import 'reactjs-popup/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import datalabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import Places from "google-places-web";
import Async from 'react-async';

import Home from '../pages/Home';
import Reports from '../pages/Reports';
import About from '../pages/about';
import Navbar from "../burger-menu/navbar";
import Days from '../day-prediction/days';
import SearchPage from "../searchBar/searchPage"
import SavedPage from "../pages/saved"
import style from './phonestyle.css';
import MapContainer from "../map/map";
import Sun from "../sun/sun";

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

// import jquery for API calls
import $ from 'jquery';

var { DateTime } = require('luxon');

const APIKEY = 'bceb51cbee4b751cc43eefea844fa6bf';
const GAPIKEY = 'AIzaSyDdfgXMyKCCD9FKeYF77xlldUVfVmiXDZ8';

const TSRegex = /(.*)thunderstorm(.*)/;
const DRegex = /(.*)drizzle(.*)/;
const RRegex = /(.*)rain(.*)/;
const SRegex = /(.*)snow(.*)/;
const CRegex = /(.*)clear(.*)/;
const CLRegex = /(.*)clouds(.*)/;

const bg = [
	"rain",
	"night",
	"sunset",
	"day",
];

// Places.apiKey = "AIzaSyDdfgXMyKCCD9FKeYF77xlldUVfVmiXDZ8";
// Places.debug = true; // boolean;

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

		if (localStorage.getItem('savedLocs') === null){localStorage.setItem('savedLocs',JSON.stringify([]))}
	}

	iconSorter = () => {
		var cond = this.state.cond
		console.log("cond: "+cond);
		console.log(CLRegex.test(cond));

		if (TSRegex.test(cond)){
			return thunder
		}
		else if (CRegex.test(cond)){
			return (this.isDay())? clearSkyD:clearSkyN;
		}
		else if (CLRegex.test(cond)){
			if (/(.*)few(.*)/.test(cond)){
				return (this.isDay())? cloudDay:fewCloudsN;
			}
			else if (/(.*)scattered(.*)/.test(cond)){
				return scatteredClouds;
			}
			else if (/(.*)broken(.*)/.test(cond)||/(.*)overcast(.*)/.test(cond)){
				return brokenClouds;
			}
		}
		else if (/(.*)mist(.*)/.test(cond)){
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

	parseHResponse = (parsed_json) => {
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
			days.push({'temp': parsed_json['daily'][index.toString()]['temp']['day'], 'time': this.formatAMPM(new Date(parsed_json['daily'][index.toString()]['dt'] * 1000)), 'weather': [{icon: parsed_json['daily'][index.toString()]['weather']['0']['icon']}, {'name': parsed_json['daily'][index.toString()]['weather']['0']['main']}]});
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
	fetchPlaces = async(latitude, longitude, num) => {
		// var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key="+GAPIKEY+"&location="+latitude+","+longitude+"&radius=5000&type="+this.recType[num];
		
		// await
		// $.ajax({
		// 	url: url,
		// 	dataType: "json",
		// 	success : this.parseGResponse,
		// 	async: true,
		// 	error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		// })
		// // once the data grabbed, hide the button
		// this.setState({ display: false });



		// try {
		// 	const response = await Places.nearbysearch({
		// 	  location: "-37.814,144.96332", // LatLon delimited by ,
		// 	  radius: "500",  // Radius cannot be used if rankBy set to DISTANCE
		// 	  type: [], // Undefined type will return all types
		// 	  rankby: "distance" // See google docs for different possible values
		// 	});
		   
		// 	const { status, results, next_page_token, html_attributions } = response;
		//   } catch (error) {
		// 	console.log(error);
		//   }
	}

	fetchHourly = async(latitude,longitude) => {
		var url = "http://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude=current,minutely,alerts&units=Metric&appid="+APIKEY;
		
		await
		$.ajax({
			url: url,
			dataType: "json",
			success : this.parseHResponse,
			async: true,
			error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	fetchWeatherData = async(latitude, longitude) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		//http://api.openweathermap.org/data/2.5/weather?lat=
		var url = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=Metric&appid="+APIKEY;

		await
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseWResponse,
			async: true,
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
			recNum: 0,
			futureDays: [],

			savedLocations: [],
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
			

		console.log("temp: "+this.state.temp);
		if (this.state.temp < 10){
			this.fetchPlaces(this.state.latitude, this.state.longitude, [2,3,4,8,10,15,17][Math.floor(Math.random() * 7)]);
		}
		else if (10<= this.state.temp < 15){
			this.fetchPlaces(this.state.latitude, this.state.longitude, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,23,24,25,26,27][Math.floor(Math.random() * 28)]);
		}
		else if (15<= this.state.temp < 20){
			this.fetchPlaces(this.state.latitude, this.state.longitude, [15,23][Math.floor(Math.random() * 2)]);
		}
		else if (20<= this.state.temp < 30){
			this.fetchPlaces(this.state.latitude, this.state.longitude, [26,28][Math.floor(Math.random() * 2)]);
		}


		console.log("here: "+this.state.recommendation);
		this.setState({displayText: "now is the time to visit "+this.state.recommendation});
			}, this.errorPosition);
		}
	}

	isDay() {
		return (Date.now() + 60000 * new Date().getTimezoneOffset() + 21600000) % 86400000 / 3600000 > 12;
	}

	pickBG(){
		if (!(this.isDay())){
			return bg[1];
		}
		else if (SRegex.test(this.state.cond)){
			return bg[1];
		}
		else if (DRegex.test(this.state.cond)||RRegex.test(this.state.cond)||CLRegex.test(this.state.cond)||TSRegex.test(this.state.cond)){
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

		
	}

	containsObject(obj, list) {
		var i;
		for (i = 0; i < list.length; i++) {
			if (list[i].name === obj.name) {
				return true;
			}
		}
	
		return false;
	}

	handleCallback = (childData) =>{
		if (!this.containsObject(childData,this.state.savedLocations)){
			this.state.savedLocations.push(childData);
		}
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
			{
				(!(this.isDay()))? (
				<StarfieldAnimation
					style={{
						pointerEvents: 'none',
						position: 'absolute',
						width: '100%',
						height: '100%',
					}}
				/> 
				) : (
					null//<Sun/>
				)
	}
				<div className={ 'container '+this.pickBG() }>
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
									<div className={ "conditions" }>{this.state.recommendation}</div>
									<div className={"floatOVer"}>
										<img className={ "fimg" } src={this.iconSorter()} onError={console.log("couldn't find icon")}/>
										<div className={"floating"}>
											<span className={ tempStyles }>{ this.state.temp }</span>
											<div className={ "conditions" }>{DateTime.now().toFormat('DDDD')}</div>
											<SwipeableViews>
                                                <div style={Object.assign({})}>
                                                    <div class="chartAreaWrapper">
                                                        <Line data={data} options={options} plugins={[datalabels,plugins]} />
                                                    </div>
                                                </div>
                                                <div style={Object.assign({})}>
                                                    <div class="chartAreaWrapper">
                                                        <Line data={data} options={options} plugins={[datalabels,plugins]} />
                                                    </div>
                                                </div>
                                                <div style={Object.assign({})}>
                                                    <div class="chartAreaWrapper">
                                                        <Line data={data} options={options} plugins={[datalabels,plugins]} />
                                                    </div>
                                                </div>
                                            </SwipeableViews>
											<div className={ "swipe" }>
												<AiIcns.AiOutlineMinus/>
											</div>
											<br/>
											<br/>
											<br/>
											<Days futureDays={this.state.futureDays}/>
											<p>more information</p>
										</div>
									</div>
								</div>
								<br/>
							</Route>
							<Route exact path="/about" component={About} />
							<Route exact path="/map" component={Map} />
							<Route exact path="/search" render={(props) => (<SearchPage {...props} parentCallback = {this.handleCallback}/>)} />
							<Route exact path="/saved" render={(props) => (<SavedPage {...props} saved={this.state.savedLocations}/>)} />
						</Switch>
					</Router>
					</div>
					
				</div>
			</>
		);
	};
}
