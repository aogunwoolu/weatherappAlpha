import React from 'react';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './day.module.css';

//day component definition (with information passed from upper level - Days)
const Day =(props)=> {
    return (
            <Card className={styles.card}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styles.center}>{props.text}</Card.Title>
                <Card.Text className={styles.center}>
                    <strong>{Math.round(props.temp)}°c</strong>
                </Card.Text>
                <img className={styles.icon} src={`http://openweathermap.org/img/wn/${props.icn}@2x.png`}/>
                <Card.Text className={styles.center}>{props.dsc}</Card.Text>
            </Card.Body>
            </Card>
        );
}

export default Day;