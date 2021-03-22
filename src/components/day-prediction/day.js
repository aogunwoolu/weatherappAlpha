import React from 'react';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Day =(props)=> {
    return (
            <Card style={{ backgroundColor: 'rgb(6,11,38,0.5)', width: '10rem', height: '15rem', margin: '30px 10px 30px 10px', }}>
            <Card.Body style={{color: 'white', }}>
                <Card.Title style={{textAlign: 'center'}}>{props.text}</Card.Title>
                <Card.Text style={{textAlign: 'center', size: '5px', color: '#878787'}}>
                    <strong>{Math.round(props.temp)}°c</strong>
                </Card.Text>
                <img style={{margin: '0 0 0 10px'}} src={`http://openweathermap.org/img/wn/${props.icn}@2x.png`}/>
                <Card.Text style={{textAlign: 'center', size: '3px'}}>{props.dsc}</Card.Text>
            </Card.Body>
            </Card>
        );
}

export default Day;