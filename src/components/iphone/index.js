// import preact
import React from 'react';
// import stylesheets for ipad & button
import Navbar from "../burger-menu/navbar";
import style from './phonestyle.css';
import ScrollMenu from "react-horizontal-scrolling-menu";


import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Reports from '../pages/Reports';
import Products from '../pages/Products';
import { Line } from 'react-chartjs-2';
import * as DL from 'chartjs-plugin-datalabels';



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
	

	parseWResponse = (parsed_json) => {
		//console.log(parsed_json)
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

	fetchWeatherData = (latitude, longitude) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=Metric&appid="+APIKEY;
		console.log(url)
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
			//this.fetchPlaces(this.state.latitude, this.state.longitude);
			}, this.errorPosition);
		}
	}

	
	// the main render method for the iphone component
	render() {
		const data = {
			labels: ['Now', '1:00am', '2:00am', '3:00am', '4:00am', '5:00am'],
			datasets: [
				{
				data: [1,19,9,8,-5,8],
				fill: false,
				backgroundColor: 'rgb(255,255,255)',
				borderColor: 'rgba(255,255,255,0.5)',
				borderDash: [10,5],
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

		const MenuItem = ({ text, selected }) => {
			return <div className={`menu-item ${selected ? "active" : ""}`}>{text}</div>;
		};
			
		const Menu = (list, selected) =>
			list.map(el => {
				const { name } = el;
			
				return <MenuItem text={name} key={name} selected={selected} />;
		});

		// check if temperature data is fetched, if so add the sign styling to the page
		//console.log(this.state);
		const tempStyles = this.state.temp ? `${'temperature'} ${'filled'}` : "temperature";
		
		
		// display all weather data
		return (
			<>
				<div className={ "container" }>
					{/* class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ > */}
					<div id = "he1" className={ "header"}>
					<Router>
						<Navbar/>
						</Router>
					</div>
					<div className={ "body" }>
						<div className={ "city" }>{ this.state.locate }</div>
						<div className={ "conditions" }>{ this.state.cond }</div>
						<img className={ "img" } src={'http://openweathermap.org/img/wn/'+this.state.icn+'@4x.png'} /><div/>
						<span className={ tempStyles }>{ this.state.temp }</span>
						<div className={ "conditions" }>{DateTime.now().toFormat('DDDD')}</div>
					</div>
					<br/>
					<ScrollMenu
						alignCenter={alignCenter}
						clickWhenDrag={clickWhenDrag}
						data={menu}
						dragging={dragging}
						hideArrows={hideArrows}
						hideSingleArrow={hideSingleArrow}
						onFirstItemVisible={this.onFirstItemVisible}
						onLastItemVisible={this.onLastItemVisible}
						onSelect={this.onSelect}
						onUpdate={this.onUpdate}
						ref={el => (this.menu = el)}
						scrollToSelected={scrollToSelected}
						selected={selected}
						transition={+transition}
						translate={translate}
						wheel={wheel}
					/>
					<div>
						<Line ref={this.chartReference} data={data} options={options} />
					</div>
				</div>
			</>
		);
	};
}
