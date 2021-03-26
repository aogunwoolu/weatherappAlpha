import React from 'react';
import Day from './day';
import ScrollMenu from "react-horizontal-scrolling-menu";

let list = [

];

export const Menu = (list) =>
    list.map(el => {

    return <Day text={el["name"]} temp={el["temp"]} icn={el["img"]} dsc={el["desc"]} key={el["name"]} />;
});

class Days extends React.Component {
    curr = new Date; // get current 

    constructor(props) {
        super(props);
        this.menu = null;
        this.refreshDays();
    }

    refreshDays(){
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        list = []
        for (var i = 0; i <= 7; i++) {

            var next = new Date();
            next.setDate(this.curr.getDate() + i);
            
            try{
                list.push({name: days[next.getDay()], temp: this.props.futureDays[i]['temp'], img: this.props.futureDays[i]['weather'][0]['icon'], desc: this.props.futureDays[i]['weather'][1]['name']})
            }
            catch{

            }
        }
        this.menuItems = Menu(list.slice(1, 8));
    }

    componentDidUpdate(prevProps, prevState) {
        this.refreshDays();
    }

    render(){
    this.refreshDays();
    const menu = this.menuItems;

    return (
        <>
            <p>this week's preditions</p>
            <ScrollMenu 
                scrollBy='1'
                data={menu}
                itemStyle=""
            />
            
        </>
        );
    }
}

export default Days;