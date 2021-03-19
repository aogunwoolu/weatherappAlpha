import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import MapContainer from "./map";

export default () => (
  <Popup trigger={<button> Trigger</button>} position="right center">
    <MapContainer/>
  </Popup>
);