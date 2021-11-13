import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../LogoutButton/LogoutButton';
import ValidationError from '../Utils/ValidationError';
import './MainPage.css';
import { API_ENDPOINT, COOKIE_API_ENDPOINT } from '../config';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'universal-cookie';



const endpoint = API_ENDPOINT
const cookieEndpoint = COOKIE_API_ENDPOINT
const cookies = new Cookies();

export default class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: [1, 2],
            error: null,
            roomName: '',
            roomNameValid: false,
            validationMessages: {
                roomName: ''
            }
        }
    }
    handleCreateRoom = ev => {
        ev.preventDefault();
        const {create_room} = ev.target

        const room = {
            name: create_room.value
        }
        fetch(endpoint + 'api/rooms', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(room)
        })
        .then(res => {
            if(!res.ok){
                return res.json().then(e => Promise.reject(e))
            }
            else {
                this.setState({
                    rooms: [...this.state.rooms, room]
                })
                return res.json()
            }
        }
        )
        .catch(err => {
            this.setState({
                error: err
            })
        })
        this.setState({
            roomName: ''
        })
    }
    componentDidMount() {
        fetch(endpoint + 'api/rooms', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
            this.setState({
                rooms: resJson
            })
        })
        .catch(err => {
            this.setState({
                error: err
            })
        });
        
        let uuid = uuidv4();
        let currentDateObj = new Date();
        let currentDate = "" + currentDateObj.getUTCFullYear() + "-" + (currentDateObj.getMonth()+ 1) + "-" + currentDateObj.getDate();
        let currentTime = "" + currentDateObj.getHours() + ":" + currentDateObj.getMinutes() + ":" + currentDateObj.getSeconds();
        let currentDateTime = currentDate + " " + currentTime;

        if (this.doCookiesExist()) {
            this.updateCookies(currentDateTime);
        } else {
            this.createCookies(uuid, currentDateTime);
        }
    }
    doCookiesExist() {

        if (cookies.get("uuid") !== undefined) {
            return true;
        } else {
            return false;
        }
    }
    createCookies(uuid, currentDateTime) {
        cookies.set('uuid', uuid, {sameSite: 'none', secure: true});
        cookies.set("time", currentDateTime, {sameSite: "none", secure: true});
        cookies.set("pagelocation", "mainpage", {sameSite: 'none', secure: true});
        cookies.set("agentdata", navigator.userAgent, {sameSite: "none", secure: true});
        this.insertCookie()
    }
    updateCookies(currentDateTime) {
        let currentUuid = cookies.get("uuid")
        if (currentUuid !== "") {
            cookies.set("time", currentDateTime, {sameSite: "none", secure: true})
            cookies.set("pagelocation", "mainpage", {sameSite: "none", secure: true})
            cookies.set("agentdata", navigator.userAgent, {sameSite: "none", secure: true})
            this.insertCookie()
        } else {
            let newUuid = uuidv4();
            this.createCookies(newUuid)
        }
    }

    insertCookie() {
        let time = cookies.get("time");
        time = time.split(" ")
        let date = time[0]
        time = time[1].split(":")


        for (let i = 0; i < time.length; i++) {
            if (time[i].length < 2) {
                time[i] = "0" + time[i];
            }
        }
        let newTime = time.join(":");
        let finalDateTime = date + " " + newTime

        const cookie = {
            uuid: cookies.get("uuid"),
            time: finalDateTime,
            page: cookies.get("pagelocation"),
            agentdata: cookies.get("agentdata")
        }

        fetch(cookieEndpoint + "api/cookies?auth=" + process.env.KEY, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(cookie)
        })
        .then(res => 
            (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
        )
        .catch(res => {
           this.setState({
               error: res.error
           })
        })
    }
    validateRoomName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages}
        let hasError = false;

        const roomName = fieldValue.trim();

        if(roomName.length === 0 || roomName.length > 25) {
            fieldErrors.roomName = 'Room name must be greater than 0 and less than 25 characters.';
            hasError = true;
        }
        this.setState({
            validationMessages: fieldErrors,
            roomNameValid: !hasError
        })
    }
    updateRoomName(roomName) {
        this.setState({roomName}, () => {this.validateRoomName(roomName)})
    }
    render() {
        return (
            <div>
                <nav className="main_nav">
                    <h2 className="site_title">WeTube</h2>
                    <LogoutButton />
                </nav>

                <section className="main_page_main">
                    <section className="main_directions">
                        <h2>Welcome to WeTube!</h2>
                        <p>Select a room to join below, or create your own!</p>
                    </section>
                    <form className="create_room" onSubmit={this.handleCreateRoom}>
                        <label htmlFor="create_room">Room Name</label>
                        <input name="create_room" id="create_room" type="text" value={this.state.roomName} onChange={e => this.updateRoomName(e.target.value)}/>
                        {this.state.error === null ? null : <p>{this.state.error.error}</p>}
                        <ValidationError className="error" hasError={!this.state.roomNameValid} message={this.state.validationMessages.roomName}/>
                        <button className="create_button" disabled={!this.state.roomNameValid}>Create Room</button>
                    </form>
                    <section className="rooms_container">
                    <h2 className="room_label">Available Rooms</h2>
                        {this.state.rooms !== null ? this.state.rooms.map((item, index) => {
                            return <Link key={index} to={`/rooms/${item.name}`}><button className="room_button">Room {item.name}</button></Link>
                        }) : null}
                    </section>
                </section>
            </div>
        )
    }
}