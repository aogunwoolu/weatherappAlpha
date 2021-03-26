import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as TiIcons from 'react-icons/ti';
import * as ImIcons from 'react-icons/im';

const SavedPage = (props) => {
    const [del, setDelete] = React.useState(false);
    var loc = JSON.parse(localStorage.getItem('savedLocs'));
    console.log(loc);
    
    const data = loc.map(el => {
        return el;
    })

    const containsObject = (obj, list) => {
		var i;
		for (i = 0; i < list.length; i++) {
			if (list[i].name == obj) {
				return i;
			}
		}
	
		return false;
	}

    const deleteTheLoc =(name)=> {
        let contains = containsObject(name, loc);
        console.log(contains);
        //if (contains == false){return;}
        if (contains > -1){
            loc.splice(contains, 1);
        }
        localStorage.setItem('savedLocs',JSON.stringify(loc));
        window.location.reload(false);
    }

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
        {
                (del)? (
                    <ImIcons.ImCross onClick={() => deleteTheLoc(d.name)}/>
                ): null
                
            }
    </li>)
    ;

    const handleClick =(e)=> {
        setDelete(!del);
    }

    return (
        <>
            <h1>saves</h1>
            <h3><ImIcons.ImBin onClick={handleClick}/></h3>
            <div style={{marginTop: '10px'}}>
            {listItems }
            </div>
        </>
    );
}


export default SavedPage