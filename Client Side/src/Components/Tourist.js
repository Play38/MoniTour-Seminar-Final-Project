import React, {Component} from 'react';
import Load from './Load'
import {MdAdd} from 'react-icons/md'
import {  CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
class Tourist extends Component {
    hasUnmounted = false;
    _isMounted = false;
    listStyle  = {
        display: "flex",
        alignItems: "stretch",
        marginTop:30,
        width:"100%",
        marginBottom: 7 + 'px',
        left: "48%",
        transform: "translateX(-50%)"
    };
    loadBar = {
        position:"relative",
        marginLeft:"auto",
        right:0,

        width:"20%"
    };
    listText = {
        position:"absolute",
        alignItems: 'center',

    }
    loadPic = {
        position:"relative",
        marginTop:30,
        marginBottom: 7 + 'px',
        left: "50%",
        transform: "translateX(-50%)",
        height:"50%",
        width:"50%"
    };

    constructor(props) {
        super(props);
        this.state = {
            loads: [],
            Latitude:0,
            Longitude:0,
            GPS:0
        }
        this.baseState = this.state
        this.eachLoad = this.eachLoad.bind(this)
        this.nextID = this.nextID.bind(this)
    }
    reset = () => {
        this.setState(this.baseState)
    }

    add({event = null, id = null, txt = 'default title', ld = 'default load', img = null, loc = null}){
        console.log(event,id,txt,ld,img,loc)
        this.setState(prevState => ({
            loads: [
                ...prevState.loads,
                {id: id !== null ? id : this.nextID(prevState.loads),
                    name:txt,
                    load:ld,
                    image:img,
                    location:loc,

                }
            ]
        }))
    }
    nextID() {
        this.uniqueId = this.state.loads.length
        ? this.state.loads.length -1
            : 0
        return ++this.uniqueId
    }
    componentDidMount() {
        this._isMounted = true;
        if (window.navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(async location => {
                if (this._isMounted) {
                    this.setState({
                        Latitude: location.coords.latitude,
                        Longitude: location.coords.longitude,
                        GPS: 1
                    })
                }

                //const url = 'https://moninode.herokuapp.com/load_data'; for real use
                const url = 'http://localhost:3000/load_data';
                fetch(url)
                    .then(res => res.json())
                    .then(data => data.map(item => {
                            if ((Math.abs(item.location.latitude - this.state.Latitude) <= 0.01) &&
                                (Math.abs(this.state.Latitude - item.location.latitude) <= 0.01)) {
                                this.add(
                                    {id: item.id, txt: item.name, ld: item.load, img: item.image}
                                )
                            }
                        }
                    ))
                    .catch(err => console.error(err));
                setInterval(async () => {
                    fetch(url)
                        .then(res => res.json())
                        .then(data => data.map(item => {
                            if (this._isMounted) {
                                if ((Math.abs(item.location.latitude - this.state.Latitude) <= 0.01) &&
                                    (Math.abs(this.state.Latitude - item.location.latitude) <= 0.01)) {
                                this.setState({
                                    loads: this.state.loads.map(el => (el.id === item.id ? {...el, load: item.load} : el))
                                });}
                            }
                            }
                        ))
                        .catch(err => console.error(err));
                }, 5000);
            })

    }
}
    componentWillUnmount() {
        this._isMounted = false;
    }
    eachLoad(name, i) {
        let currLoadCap;
        if((name.load.currCount === 0 && name.load.maxCount === 0) ||
            (name.load.currCount === 1 && name.load.maxCount === 0 ))
            currLoadCap = 0;
        else
        {
            currLoadCap = name.load.currCount/name.load.maxCount
            currLoadCap = currLoadCap.toFixed(2)}
        let predictload = parseInt(name.load.suggestion[1],10)
        return (
            <div key={`container ${i}`} className="card" style={this.listStyle}>
                <div class="card-body">
                    <Load key={`load${i}`} index={i}>
                        <h4 class="card-title">{name.name}</h4>
                        <img style={this.loadPic} class="card-img-top" src={name.image}/>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item" ></li>
                            <li className="list-group-item">
                                <p className="font-weight-bold" style={this.listText}>Current Load:</p>
                                <div style={this.loadBar}>
                                <CircularProgressbar value={name.load.currCount}
                                                     maxValue={name.load.maxCount}
                                                     text={`${currLoadCap*100}%`}
                                                     styles={{
                                                         path: {
                                                             transformOrigin: "center center",
                                                             strokeLinecap: "butt",
                                                             stroke: currLoadCap >= 0.7 ? "#bd2327" : "#2293dd"
                                                         },
                                                         trail: {
                                                             strokeWidth: 7
                                                         },
                                                         text: {
                                                             fontSize: 22,
                                                             fontWeight: 500,

                                                             animation: "fadein 2s",
                                                             fill: currLoadCap >= 0.7 ? "#bd2327" : "#2293dd"
                                                         }
                                                     }}

                                />
                                </div>
                            </li>
                            <li className="list-group-item" >
                                <p className="font-weight-bold" style={this.listText}>Predicted Load At {name.load.suggestion[0]}:00:</p>
                                <div style={this.loadBar}>
                                    <CircularProgressbar value={predictload}
                                                         maxValue={100}
                                                         text={`${predictload}%`}
                                                         styles={{
                                                             path: {
                                                                 transformOrigin: "center center",
                                                                 strokeLinecap: "butt",
                                                                 stroke: predictload >= 70 ? "#bd2327" : "#2293dd"
                                                             },
                                                             trail: {
                                                                 strokeWidth: 7
                                                             },
                                                             text: {
                                                                 fontSize: 22,
                                                                 fontWeight: 500,

                                                                 animation: "fadein 2s",
                                                                 fill: predictload >= 70 ? "#bd2327" : "#2293dd"
                                                             }
                                                         }}

                                    />
                                </div>
                            </li>
                            <li className="list-group-item" />

                        </ul>
                    </Load>
                </div>
            </div>


        )
    }
    render(){
        console.log("call")
        if(this.state.GPS === 0)
        {
            return(
                <div>Please Enable Your Gps Position</div>
            )
        }
        else {
            return (
                <div className='Tourist'>
                    {this.state.loads.map(this.eachLoad)}

                </div>

            )
        }
    }
}

export default Tourist;