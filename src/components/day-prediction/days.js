import React from 'react';
import Day from './day';
import ScrollMenu from "react-horizontal-scrolling-menu";

//global list
let list = [
];

//mapping the list items to Day objects
export const Menu = (list) =>
    list.map(el => {

    return <Day text={el["name"]} temp={el["temp"]} icn={el["img"]} dsc={el["desc"]} key={el["name"]} />;
});

//Days component definition
class Days extends React.Component {
    curr = new Date; // get current 

    //setting instance variables
    constructor(props) {
        super(props);
        this.menu = null;
        this.refreshDays();
    }

    //recreates day array for display
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

    //on update of the component, refresh days & display items
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