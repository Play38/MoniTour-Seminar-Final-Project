import React, {Component} from 'react';
import Load from './Load'
import {  CircularProgressbar} from 'react-circular-progressbar';
import RTChart from 'react-rt-chart';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import './c3.css';
import ReactSpeedometer from "react-d3-speedometer"
import 'react-circular-progressbar/dist/styles.css';
import '../mdb/css/mdb.css'
import axios from "axios";
let showchart = false;
class Manager extends Component {
    _isMounted = false;
    loginBack = {
        background:"linear-gradient(rgba(250,0,0,0.5),transparent)",
        backgroundColor:"#ffbc78", /*this your primary color*/
        minHeight: "100%",
        minWidth: "1024px",

    /* Set up proportionate scaling */
    width: "100%",
    height: "auto",

    /* Set up positioning */
    position: "fixed",
    top: 0,
    left: 0,
    };
    formStyle = {
        display:"flex",
        margin:"0 auto",
        marginLeft:"300",
        flexDirection: "column",
        marginTop:28,
        width:"30%",
    }
    listStyle  = {
        position:"relative",
        marginTop:30,
        width: 34 + 'rem',
        marginBottom: 7 + 'px',
        left: "5%",
        transform: "translateX(-5%)",
        backgroundColor:"#faf8f6"
    };
    loadBar = {
        position:"relative",
        marginLeft:"auto",
        right:0,
        width:"20%"
    };
    listcolor= {

        backgroundColor:"#faf8f6"
    };
    titleStyle = {
        fontSize: "calc(9px + 1vw)",
    }
    listText = {
        position:"absolute",
        alignItems: 'center',
        fontSize: "calc(4px + 1vw)",
        color:"#8c8a88",
        whiteSpace: "pre-wrap",
        top : "50%",
        left:"25%",
        transform: "translate(-25%, -50%)",

    }
    infoText = {
        fontSize: 20,
        fontWeight:"bold",
        color:"#d48636",
        display:"inline-block",
        whiteSpace: "pre-wrap",
    }
    infoWarp = {
        flex: "1 1 auto",
        textAlign: "center",
        backgroundColor:"#faf8f6"

    }
    infoImage = {
        margin: "-10px 50px 0 0",
        width: "100px",
        objectFit: "contain",
    alignSelf: "flex-start",

    }
    loadPic = {
        margin: "0 auto",
        borderRadius: 100/ 9,
    };
    charts = {
        left:200,
        display:"flex",
        flexDirection: "row",
        marginTop:28,
        width:"70%",
        backgroundColor:"#faf8f6"
    }
    charts2 = {

        display:"flex",
        flexDirection: "row",
        marginTop:28,
        width:413,
        margin:"0 auto",
        right:"3%",
        transform: "translateX(-3%)",
        marginBottom:"-1%",
        backgroundColor:"#faf8f6"
    }
    chartStyle = {
        flex:1,
        textAlign:"center",
    }
    gaugeStyle ={
        flex:1,
        textAlign:"center",
        marginTop:"10%",
        //transform: "translate(0%, 23%)",
        //transform: "translateX(-50%)",
        //verflow:"hidden",
        padding:0,
    }
    headerPicture= {
        position:"relative",
        //transform: "translateX(-5%)",
        top:0,
        left:"3%",
    }
    sideBar = {
       position:"absolute",
        display:"flex",
        flexDirection: "column",
        left:0,
        top:0,
        height:"100%",
        overflow:"hidden",
        width:"7%",
        backgroundColor:"#2c3652"
    }
    sidePicture= {
        position:"relative",
        //transform: "translateX(-5%)",
        marginTop:30,
        textAlign:"center",
        AlignItems: "center",
        JustifyContent: "center",
        left:12
    }
   sideText = {
        fontSize: "18",
        fontWeight:"bold",
        color:"#ffffff",
    }
    selectedSideBar = {
        backgroundColor:"#404c79"
    }

    constructor(props) {
        super(props);
        this.state = {
            loads: [],
            gaugeSum:0,
            counter:0,
            username: '',
            password: '',
            error: '',
            logged:false,
            id:0,
            category:"",
            lname:"",
        }
        this.baseState = this.state
        this.eachLoad = this.eachLoad.bind(this)
        this.nextID = this.nextID.bind(this)
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);
        this.handleIDChange = this.handleIDChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmitPost = this.handleSubmitPost.bind(this)
    }
    reset = () => {
        this.setState(this.baseState)
    }

    add({event = null, id = null, txt = 'default title', ld = 'default load', img = null}){
        this.setState(prevState => ({
            loads: [
                ...prevState.loads,
                {id: id !== null ? id : this.nextID(prevState.loads),
                    name:txt,
                    load:ld,
                    image:img,

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
        //const url = 'https://moninode.herokuapp.com/load_data'; for real use
        const url = 'http://localhost:3000/load_data';
        let GaugeSumTemp = 0
        let counter = 0
        let innercount = 0
        fetch(url)
            .then(res => res.json())
            .then(data => data.map(item => {
                    if (item.manager === true) {
                        GaugeSumTemp = GaugeSumTemp +  (item.load.currCount)
                        this.add({id: item.id, txt: item.name, ld: item.load, img: item.image})
                        counter = counter+1
                    }
                })).catch(err => console.error(err));

        setTimeout( () => {
            showchart = true;
            if (this._isMounted) {this.setState({
                gaugeSum: GaugeSumTemp,
                counter: counter

            })}
        }, 1000);

        setInterval( async () => {
            innercount = 0
            let loadtemp = this.state.loads
            GaugeSumTemp = 0;
            fetch(url)
                .then(res => res.json())
                .then(data => data.map(item => {
                    if (item.manager === true) {
                        let loadindex = loadtemp.findIndex(x => x.id == item.id);
                        loadtemp[loadindex].load = item.load
                        GaugeSumTemp = GaugeSumTemp + (item.load.currCount)
                        innercount++
                        if (this._isMounted) {
                            if (innercount === counter) {
                                let gaudgeshow = GaugeSumTemp
                                GaugeSumTemp = 0
                                this.setState({
                                    loads: loadtemp,
                                    gaugeSum: gaudgeshow
                                })}}}})).catch(err => console.error(err));}, 5000);
    }
    componentWillUnmount() {
        this._isMounted = false;
        showchart = false;
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
                        <h4 class="card-title" style={this.titleStyle}>{name.name} </h4>
                        <img style={this.loadPic} class="card-img-top" src={name.image}/>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item" style={this.listcolor} ></li>
                            <li className="list-group-item" style={this.listcolor}>
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
                            <li className="list-group-item"style={this.listcolor} >
                                <p className="font-weight-bold" style={this.listText}>Predicted Load
                                    {"\n"}At {name.load.suggestion[0]}:00:</p>
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
                            <li className="list-group-item" style={this.listcolor}/>

                        </ul>
                    </Load>
                </div>
            </div>


        )
    }
    dismissError() {
        this.setState({ error: '' });
    }

    handleSubmit(evt) {
        evt.preventDefault();

        if (!this.state.username) {
            return this.setState({ error: 'Username is required' });
        }

        if (!this.state.password) {
            return this.setState({ error: 'Password is required' });
        }

        if(this.state.username === "admin" && this.state.password === "admin") {
            this.setState({logged: true})
        }
        else
            return this.setState({ error: 'invalid username or password' });
        return this.setState({ error: '' });
    }

    handleUserChange(evt) {
        this.setState({
            username: evt.target.value,
        });
    };

    handlePassChange(evt) {
        this.setState({
            password: evt.target.value,
        });
    }
    handleIDChange = event => {
        this.setState({ id: event.target.value });
    }
    handleChangeSelect = event => {
        this.setState(({lname: event.target.value}))
        console.log(this.state.lname)
    }
    handleCategoryChange = event => {
        this.setState({ category: event.target.value });
    }
    handleSubmitPost(evt) {
        evt.preventDefault();

        const user = {
            name: this.state.lname,
            category: this.state.category
        };

        axios.post(`http://localhost:3000/load_data`, { user })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }

    render() {
        let data = {
            date: new Date(),
            Visitors: this.state.gaugeSum,
        };
        let chart = {
            axis: {
                y: {min: 0, max: 30}
            },
            point: {
                show: true
            }
        };
        if (this.state.logged) {
            let optionTemplate = this.state.loads.map(v => (
                <option value={v.name}>{v.name}</option>
            ));
            return (
                <div className='Manager' style={this.Manager}>
                    <img style={this.headerPicture} src={require('../images/monitourLogoDash.png')}/>
                    <div style={this.sideBar}>
                        <div>
                            <img style={this.sidePicture} src={require('../images/weblogo.png')}/>
                        </div>
                        <hr
                            style={{
                                color: "black",
                                backgroundColor: "white",
                                height: 5
                            }}
                        />
                        <div style={this.selectedSideBar}>
                            <img style={this.sidePicture} src={require('../images/dashboard.png')}/>
                            <p style={this.sideText}>Dashboard</p>
                        </div>
                    </div>
                    <div>
                        <form onSubmit={this.handleSubmitPost}>
                            <label>
                                Name:
                                <select value={this.state.value} onChange={this.handleChangeSelect}>
                                    <option disabled selected value> -- select an option -- </option>
                                    {optionTemplate}
                                </select>
                                Category
                                <input type="txt" name="name" onChange={this.handleCategoryChange} />
                            </label>
                            <button type="submit">Add</button>
                        </form>
                    </div>
                    <div style={this.infoData}>
                        <div className="card" style={this.charts2}>
                            <div className="card">
                                <div className="card-body" style={this.infoWarp}>
                                    <img style={this.infoImage} src={require('../images/building2.png')}/>
                                    <p style={this.infoText}>{this.state.counter}</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body" style={this.infoWarp}>
                                    <img style={this.infoImage} src={require('../images/warning2.png')}/>
                                    <p style={this.infoText}>0</p>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={this.charts}>
                            <div className="card-body" style={this.gaugeStyle}>
                                <ReactSpeedometer
                                    value={this.state.gaugeSum}
                                    needleColor="steelblue"
                                    needleTransitionDuration={4000}
                                    needleTransition="easeElastic"
                                    currentValueText="Current Overall Load: ${value}"
                                    minValue={0}
                                    maxValue={20}
                                    segments={4}
                                    customSegmentStops={[0, 5, 10, 15, 20]}
                                    segmentColors={[
                                        "#72f507",
                                        "#fff200",
                                        "#ff8c00",
                                        "#e32133",
                                    ]}

                                />
                            </div>
                            {showchart ? <div className="card-body" style={this.chartStyle}>
                                <p style={this.titleStyle}>Load History</p>
                                <RTChart
                                    chart={chart}
                                    fields={['Visitors']}
                                    data={data}
                                    maxValues={8}/>
                            </div> : <div className="card-body"/>}
                        </div>
                    </div>

                </div>

            )
        }
        else
        {

            return (
                <div className='Manager' style={this.loginBack}>
                    <img style={this.headerPicture} src={require('../images/monitourLogoDash.png')}/>
                    <MDBContainer>
                        <MDBRow>

                                <form onSubmit={this.handleSubmit} style={this.formStyle}>
                                    {
                                        this.state.error &&
                                        <h3 data-test="error" onClick={this.dismissError}>
                                            <button onClick={this.dismissError}>✖</button>
                                            {this.state.error}
                                        </h3>
                                    }
                                    <p className="h5 text-center mb-4">Welcome</p>
                                    <div className="white-text">
                                        <MDBInput  label="Type your username" icon="user" group type="text" validate error="wrong"
                                                  input = "ttt"success="right" data-test="username" value={this.state.username} onChange={this.handleUserChange}/>
                                        <MDBInput label="Type your password" icon="lock" group type="password" validate data-test="password"  value={this.state.password} onChange={this.handlePassChange}/>
                                    </div>
                                    <div className="text-center">
                                        <MDBBtn class="btn peach-gradient" type="submit">Login</MDBBtn>
                                    </div>

                                </form>
                        </MDBRow>
                    </MDBContainer>
                </div>
            );
        }
        }


}

export default Manager;