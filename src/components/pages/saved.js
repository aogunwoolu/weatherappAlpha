import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './saved.module.css'
import * as TiIcons from 'react-icons/ti';
import * as ImIcons from 'react-icons/im';

//saved page
const SavedPage = (props) => {
    //state definitions (deleting and styling for deleting)
    const [del, setDelete] = React.useState(false);
    const [style, setStyle] = React.useState("");

    //get localstorage array
    var loc = JSON.parse(localStorage.getItem('savedLocs'));
    
    //map to data constant
    const data = loc.map(el => {
        return el;
    })

    //helper function: check to see if object exists in a list
    const containsObject = (obj, list) => {
		var i;
		for (i = 0; i < list.length; i++) {
			if (list[i].name == obj) {
				return i;
			}
		}
	
		return false;
	}

    //X button event handler
    const deleteTheLoc =(name)=> {
        let contains = containsObject(name, loc);
        if (contains > -1){
            loc.splice(contains, 1);
        }
        localStorage.setItem('savedLocs',JSON.stringify(loc));
        window.location.reload(false);
    }

    //mapper for all items in localStorage to cards
    const listItems = data.map((d) => 
    <li style={{listStyleType: 'none'}}>
        <div className={style}>
        <Link className="Dleft" to={{pathname:'/search', loc: d}}>
            <Card className={styles.card}>
            <Card.Body style={{color: 'white', }}>
                <TiIcons.TiLocationOutline/>
                <Card.Title>{d.name}</Card.Title>
            </Card.Body>
            </Card>
        </Link>
        {
                (del)? (
                    <ImIcons.ImCross className="right del" onClick={() => deleteTheLoc(d.name)}/>
                ): null
                
            }
        </div>
    </li>)
    ;

    //delete button event handler
    const handleClick =(e)=> {
        if (del){
            setStyle("");
        }
        else{
            setStyle("split save");
        }
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