import React from 'react';
import { Card } from 'react-bootstrap';

function Day() {
    return (
            <Card style={{ backgroundColor: 'rgb(6,11,38,0.5)', width: '10rem', height: '15rem', margin: '30px 10px 30px 10px', }}>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body style={{color: 'white', overflowWrap: 'break-word', borderLeft: '0px',}}>
                <Card.Title>Monday</Card.Title>
                <Card.Text style={{paddingLeft: '0px', overflowWrap: 'break-word'}}>
                    Some quick gdfghhghdfhdgfhdfgh
                </Card.Text>
            </Card.Body>
            </Card>
        );
}

export default Day;