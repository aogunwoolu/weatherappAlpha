import React from 'react';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Day() {
    return (
            <Card style={{ backgroundColor: 'rgb(6,11,38,0.5)', width: '10rem', height: '15rem', margin: '30px 10px 30px 10px', }}>
            <Card.Body style={{color: 'white', }}>
                <Card.Title style={{textAlign: 'center'}}>Monday</Card.Title>
                <Card.Text style={{textAlign: 'center', size: '5px'}}>
                    0°c
                </Card.Text>
            </Card.Body>
            </Card>
        );
}

export default Day;