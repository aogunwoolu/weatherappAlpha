import React from 'react';
import Day from './day';
import ScrollMenu from "react-horizontal-scrolling-menu";
import {useState} from "react";

let list = [

];

const MenuItem = ({ text, selected }) => {
    return <div className={`menu-item ${selected ? "active" : ""}`}>{text}</div>;
};

export const Menu = (list, selected) =>
    list.map(el => {

    return <Day text={el["name"]} temp={el["temp"]} icn={el["img"]} dsc={el["desc"]} key={el["name"]} selected={selected} />;
});

class Days extends React.Component {
    state = {
        alignCenter: true,
        clickWhenDrag: false,
        dragging: true,
        hideArrows: true,
        hideSingleArrow: true,
        itemsCount: list.length,
        scrollToSelected: false,
        selected: "item1",
        translate: 0,
        transition: 0.3,
        wheel: true
    };

    curr = new Date; // get current 
    first = this.curr.getDate() - this.curr.getDay();

    constructor(props, futureDays) {
        super(props);
        this.menu = null;
        
    }

    refreshDays(prevState){
        // const { alignCenter } = prevState;
        // const { alignCenter: alignCenterNew } = this.state;

        // if (alignCenter !== alignCenterNew) {
        //     this.menu.setInitial();
        // }

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        for (var i = 1; i <= 8; i++) {

            var next = new Date(this.curr.getTime());
            next.setDate(this.first + i);
            //console.log(this.props.futureDays['temp'])
            //next.setDate(this.first + i);
            
            try{
                list.push({name: days[next.getDay()], temp: this.props.futureDays[i]['temp'], img: this.props.futureDays[i]['weather'][0]['icon'], desc: this.props.futureDays[i]['weather'][1]['name']})
            }
            catch{

            }
        }
        this.menuItems = Menu(list.slice(1, 8), this.state.selected);
    }

    // componentWillMount(){
    //     if (this.state.previstate !==undefined){
    //         this.refreshDays(this.state.previstate);
    //     }
    // }

    componentDidUpdate(prevProps, prevState) {
        

        console.log(list.length);
        
        if (this.props.futureDays !== null || list.length === 0){
            //this.setState({previstate: prevState});
            this.refreshDays(prevState);
        }
    }

    render(){
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