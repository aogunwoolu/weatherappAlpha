import React from 'react';
import { Line } from 'react-chartjs-2';

export class future extends React.Component {
	constructor(props) {
		super(props);
		this.chartReference = React.createRef();
	}

	componentDidMount() {
	  console.log(this.chartReference); // returns a Chart.js instance reference
	}

	render() {
		const data = (canvas) => {
			const ctx = canvas.getContext("2d")
			const gradient = ctx.createLinearGradient(0,0,100,0);
			return {
				backgroundColor: gradient
			}
		}

		const options = {
			responsive: true,
			maintainAspectRatio: false,
			legend: {
				position: "none"
			},
			scales: {
				yAxes: [
				{
					ticks: {
						fontFamily: "Roboto Mono",
						fontColor: "#556F7B",
						fontStyle: "bold",
						beginAtZero: true,
						maxTicksLimit: 5,
						padding: 20
					},
					gridLines: {
						drawTicks: false,
						display: false,
						drawBorder: false
					}
				}
				],
				xAxes: [
				{
					gridLines: {
					zeroLineColor: "transparent"
					},
					ticks: {
						padding: 20,
						fontColor: "#556F7B",
						fontStyle: "bold",
						fontFamily: "Roboto Mono"
					},
					gridLines: {
						drawTicks: false,
						display: false,
						drawBorder: false
					}
				}
				]
		}
	}

		return (<Line ref={this.chartReference} data={data} options={options} />)
	}
}