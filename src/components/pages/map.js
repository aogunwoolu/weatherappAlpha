import React from 'react';
import MapContainer from '../map/map'

//map page component
function Products(props) {
  return (
    <div className='products'>
      <h2>Map</h2>
      <MapContainer lat={props.lat} lng={props.lng} />
    </div>
  );
}

export default Products;