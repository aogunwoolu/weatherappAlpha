import React from 'react';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './day.module.css';

//day component definition (with information passed from upper level - Days)
const Day =(props)=> {
    return (
            <Card className={styles.card}>
            <Card.Body style={{color: 'white', }}>
                <Card.Title style={{textAlign: 'center'}}>{props.text}</Card.Title>
                <Card.Text style={{textAlign: 'center', size: '5px', }}>
                    <strong>{Math.round(props.temp)}°c</strong>
                </Card.Text>
                <img style={{margin: '0 0 0 10px'}} src={`http://openweathermap.org/img/wn/${props.icn}@2x.png`}/>
                <Card.Text style={{textAlign: 'center', size: '3px'}}>{props.dsc}</Card.Text>
            </Card.Body>
            </Card>
        );
}

export default Day;