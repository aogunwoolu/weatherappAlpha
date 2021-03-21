import React from 'react';
import Day from './day';
import ScrollMenu from "react-horizontal-scrolling-menu";

let list = [
    { name: "item1" },
    { name: "item2" },
    { name: "item3" },
    { name: "item4" },
    { name: "item5" },
    { name: "item6" },
    { name: "item7" },
    { name: "item8" },
    { name: "item9" },
    { name: "item10" },
    { name: "item11" },
    { name: "item12" },
    { name: "item13" },
    { name: "item14" },
    { name: "item15" },
    { name: "item16" },
    { name: "item17" },
    { name: "item18" },
    { name: "item19" },
    { name: "item20" },
    { name: "item21" },
    { name: "item22" },
    { name: "item23" },
    { name: "item24" },
    { name: "item25" }
];

const MenuItem = ({ text, selected }) => {
    return <div className={`menu-item ${selected ? "active" : ""}`}>{text}</div>;
};

export const Menu = (list, selected) =>
    list.map(el => {
    const { name } = el;

    return <Day text={name} key={name} selected={selected} />;
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

    constructor(props) {
        super(props);
        this.menu = null;
        this.menuItems = Menu(list.slice(0, list.length), this.state.selected);
    }

    componentDidUpdate(prevProps, prevState) {
    const { alignCenter } = prevState;
    const { alignCenter: alignCenterNew } = this.state;
    if (alignCenter !== alignCenterNew) {
        this.menu.setInitial();
    }
    }

    render(){
    const menu = this.menuItems;

    return (
        <>
            <ScrollMenu 
                scrollBy='1'
                data={menu}
                wrapperStyle={{
                    left: '150px',
                }}
            />
            
        </>
        );
    }
}

export default Days;