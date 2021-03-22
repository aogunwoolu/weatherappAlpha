import React from 'react'

import Iphone from './components/iphone';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default class App extends React.Component {
	/*
		A render method to display the required Component on screen (iPhone or iPad) : selected by checking component's isTablet state
	*/
	render(){
		return (
			<div id="app">
				<Iphone/>
			</div>
		);
	}
}