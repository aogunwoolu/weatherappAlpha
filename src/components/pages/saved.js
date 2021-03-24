const SavedPage = (props) => {
    //console.log("saveddata: "+JSON.stringify(props.saved));
    const data = props.saved.map(el => {
        console.log("saveddata: "+JSON.stringify(el));
        return el;//<Day text={el["name"]} temp={el["temp"]} icn={el["img"]} dsc={el["desc"]} key={el["name"]} selected={selected} />;
})

    //const data =[{"name":"test1"},{"name":"test2"}];
    const listItems = data.map((d) => <li key={d.name}>{d.name}</li>);

    return (
        <div>
        {listItems }
        </div>
    );
}


export default SavedPage