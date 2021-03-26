// import react
import React from 'react';

//importing modules (and external CSS files)
import StarfieldAnimation from 'react-starfield-animation';
import SwipeableViews from 'react-swipeable-views';
import * as VscIcns from 'react-icons/vsc';
import * as AiIcns from 'react-icons/ai';
import * as WiIcns from 'react-icons/wi';
import * as RiIcns from 'react-icons/ri';
import * as MdIcns from 'react-icons/md';
import 'reactjs-popup/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import datalabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import $ from 'jquery';

//internal imports
import About from '../pages/about';
import Navbar from "../burger-menu/navbar";
import Days from '../day-prediction/days';
import SearchPage from "../searchBar/searchPage"
import SavedPage from "../pages/saved"
import style from './phonestyle.css';
import Suggestions from "../pages/map";

//image imports
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

//importing date for later use
var { DateTime } = require('luxon');

//API keys for openweather + google APIs
const APIKEY = 'bceb51cbee4b751cc43eefea844fa6bf';

//regular expressions to check against conditions (in multiple places)
const TSRegex = /(.*)thunderstorm(.*)/;
const DRegex = /(.*)drizzle(.*)/;
const RRegex = /(.*)rain(.*)/;
const SRegex = /(.*)snow(.*)/;
const CRegex = /(.*)clear(.*)/;
const CLRegex = /(.*)clouds(.*)/;

//background style names
const bg = [
	"rain",
	"night",
	"sunset",
	"day",
];

//tool tips (to guide users to the features)
const tooltips = [
	"want recomendations? maps tab!",
	"love to save? check out saved~",
	"don't forget to scroll!"
]

//main iphone class
export default class Iphone extends React.Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);

		//setting localstorage if it doesn't exist (akin to a singleton design pattern)
		if (localStorage.getItem('savedLocs') === null){localStorage.setItem('savedLocs',JSON.stringify([]))}
	}

	//annonymous function for sorting icons with regexes
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

	//function for formatting date for chart
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

	//function to deal with the hourly openweather API call (for the chart and cards)
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

	//function to deal with the one time openweather API call for the weather information (not the chart or cards)
	parseWResponse = (parsed_json) => {
		let location = parsed_json['name'];
		let temp_c = Math.round(parsed_json['main']['temp']);
		let conditions = parsed_json['weather']['0']['description'];
		let feelsLike = Math.round(parsed_json['main']['feels_like']);
		let icon = parsed_json['weather']['0']['icon'];

		let humidity = parsed_json['main']['humidity'];
		let pressure = parsed_json['main']['pressure'];
		let min =  Math.round(parsed_json['main']['temp_min']);
		let max = Math.round(parsed_json['main']['temp_max']);
		let vis = parsed_json['visibility'];
		let wind = parsed_json['wind'];
		let clouds = parsed_json['clouds']['all'];

		let sunriseSunset = {sunrise: parsed_json['sys']['sunrise'], sunset: parsed_json['sys']['sunset']}

		// set states for fields so they could be rendered later on
		this.setState({
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

	//fetches hourly and daily data for use with the chart + cards
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
	}

	//fetches one time data for use with the main info
	fetchWeatherData = async(latitude, longitude) => {
		var url = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=Metric&appid="+APIKEY;
		console.log(url);

		await
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseWResponse,
			async: true,
			error : function(req, err){ console.log('API call failed ' + err + ', ' + APIKEY); }
		})
	}

	//method that runs before the first render (used to set the initial statea)
	componentWillMount() {
		clearTimeout(this.redirectTimeout);
		this.setState({ 
			longitude:0,
			latitude: 0,
			textIdx: Math.floor(Math.random() * tooltips.length),

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

		//calls for the fetches happen here (so when the page loads, we get the data)
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

	//checks whether it is day or night (for bg + icons)
	isDay() {
		return (Date.now() + 60000 * new Date().getTimezoneOffset() + 21600000) % 86400000 / 3600000 > 12;
	}

	//picks backgrounds depending on the weather state
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

	//sets timer for 5 minutes to change tooltips (method called AFTER first render)
	componentDidMount(){
		this.timeout = setInterval(() => {
			let currentIdx = this.state.textIdx;
			this.setState({ textIdx: currentIdx + 1 });
		}, 300000);
	}

	//after refresh, clear timeout
	componentDidUnmount() {
		clearInterval(this.timeout);
	}

	//helper function to check if item exists in localstorage (using simple linear search)
	containsObject(obj, list) {
		var i;
		for (i = 0; i < list.length; i++) {
			if (list[i].name === obj.name) {
				return true;
			}
		}
	
		return false;
	}

	//parent function to handle child return value
	handleCallback = (childData) =>{
		if (!this.containsObject(childData,this.state.savedLocations)){
			this.state.savedLocations.push(childData);
		}
	}

	
	// the main render method for the iphone component
	render() {
		//data for the chartjs line graph
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
		
		//options for the chartjs line graph
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

		//custom plugin for the line graph (for the bottom lines)
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
		const tempStyles = this.state.temp ? `${'temperature'} ${'filled'}` : "temperature";
		//tooltips text is defined here (randomly picked each time)
		let textThatChanges = tooltips[this.state.textIdx % tooltips.length];
		
		// display all weather data
		return (
			<>
			{/* activates starfield animation if it is night-time */}
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
					null
				)
			}
			{/* picks background depending on weather condition */}
				<div className={ 'container '+this.pickBG() }>
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
									<div className={ "conditions" }>{textThatChanges}</div>
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
											<div className="info">
												<div className="split">
													<div className="left">
														<div className="itm"><p><WiIcns.WiHumidity/>humidity</p><p>{this.state.humidity}%</p></div>
														<div className="itm"><p><WiIcns.WiBarometer/>pressure</p><p>{this.state.pressure}hPa</p></div>
														<div className="itm"><p><RiIcns.RiArrowUpDownFill/>min/max</p><p>{this.state.min}°/{this.state.max}°</p></div>
													</div>
													<div className="right">
														<div className="itm"><p><MdIcns.MdVisibility/>visibility</p><p>{this.state.vis}m</p></div>
														<div className="itm"><p><WiIcns.WiHumidity/>wind</p><p>100000</p></div>
														<div className="itm"><p><WiIcns.WiHumidity/>humidity</p><p>{this.state.humidity}%</p></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<br/>
							</Route>
							<Route exact path="/about" component={About} />
							<Route exact path="/map" component={Suggestions} />
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
