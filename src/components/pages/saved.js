import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as TiIcons from 'react-icons/ti';

const SavedPage = (props) => {
    //console.log("saveddata: "+JSON.stringify(props.saved));
    var loc = JSON.parse(localStorage.getItem('savedLocs'));
    
    const data = loc.map(el => {
        console.log("saveddata: "+JSON.stringify(el));
        return el;//<Day text={el["name"]} temp={el["temp"]} icn={el["img"]} dsc={el["desc"]} key={el["name"]} selected={selected} />;
})
    //const data =[{"name":"test1"},{"name":"test2"}];
    const listItems = data.map((d) => 
    <li style={{listStyleType: 'none'}}>
        <Link to={{pathname:'/search', loc: d}}>
            <Card style={{ backgroundColor: 'rgb(6,11,38,0.2)', display: 'block', overflow: 'auto', borderRadius: '50px', padding:'0', margin: '10px 5px 5px 0px', }}>
            <Card.Body style={{color: 'white', }}>
                <TiIcons.TiLocationOutline/>
                <Card.Title>{d.name}</Card.Title>
            </Card.Body>
            </Card>
        </Link>
    </li>);

    return (
        <>
            <h1>saves</h1>
            <div style={{marginTop: '10px'}}>
            {listItems }
            </div>
        </>
    );
}


export default SavedPage