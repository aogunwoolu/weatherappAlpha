import React from 'react'

import Ipad from './components/ipad';
import Iphone from './components/iphone';

export default class App extends React.Component {
//var App = React.createClass({

	// once the components are loaded, checks if the url bar has a path with "ipad" in it, if so sets state of tablet to be true
	componentWillMount() {
		const urlBar = window.location.href;
		if(urlBar.includes("ipad")) {
			this.setState({
				"isTablet": true
			});
		} else {
			this.setState({
				"isTablet": false
			});
		}
	}

	/*
		A render method to display the required Component on screen (iPhone or iPad) : selected by checking component's isTablet state
	*/
	render(){
		if(this.state.isTablet){
			return (
				<div id="app">
					<Ipad/>
				</div>   				
			);
		} 
		else {
			return (
				<div id="app">
					<Iphone/>
				</div>
			);
		}
	}
}