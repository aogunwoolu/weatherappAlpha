// import preact
import React from 'react';
	
export default class Button extends React.Component {

	// rendering a function when the button is clicked
	render() {
		let cFunction = this.props.clickFunction;
		if(typeof cFunction !== 'function'){
			cFunction = () => {
				console.log("passed something as 'clickFunction' that wasn't a function !");
			}
		}
		return (
			<div>
				<button onClick={cFunction}>
					Display Weather
				</button>
			</div>
		);
	}
}
